// app/CheckoutScreen.jsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const boxSize = width / 2 - 30;

export default function CheckoutScreen() {
  const { state } = useCart();
  const router = useRouter();

  const total = useMemo(
    () => state.cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.cartItems]
  );

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  // --------------- Fake Razorpay ---------------
  const handleFakeRazorpay = async () => {
    if (total <= 0) return Alert.alert("Cart empty", "Add products first");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push(
        `/PaymentResult?success=true&amount=${total}&txnId=fake_razorpay_${Date.now()}`
      );
    }, 900);
  };

  // --------------- Stripe: open card-entry screen ---------------
  const openStripeFlow = () => {
    if (total <= 0) return Alert.alert("Cart empty", "Add products first");
    router.push({
      pathname: "/StripePayment",
      params: { amount: total },
    });
  };

  // --------------- COD (Cash on Delivery) ---------------
  const handleCOD = async () => {
    if (total <= 0) return Alert.alert("Cart empty", "Add products first");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push(
        `/PaymentResult?success=true&amount=${total}&txnId=cod_${Date.now()}`
      );
    }, 700);
  };

  // --------------- UPI (Android deep link) ---------------
  const handleUPI = async () => {
    if (Platform.OS !== "android") return Alert.alert("UPI only works on Android");
    if (total <= 0) return Alert.alert("Cart empty", "Add products first");

    const upiVpa = "9347372180@apl"; // fake
    const txnId = `txn_${Date.now()}`;
    const payUrl = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(
      "My E-Store"
    )}&tr=${txnId}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Order Payment")}`;

    try {
      const supported = await Linking.canOpenURL(payUrl);
      if (!supported) return Alert.alert("No UPI app", "Install a UPI app to proceed");
      await Linking.openURL(payUrl);
    } catch (err) {
      Alert.alert("UPI Error", "Unable to open UPI app");
    }
  };

  const onPayPress = () => {
    if (!selectedMethod) return Alert.alert("Choose method", "Select a payment method");

    switch (selectedMethod) {
      case "razorpay":
        return handleFakeRazorpay();
      case "stripe":
        return openStripeFlow();
      case "cod":
        return handleCOD();
      case "upi":
        return handleUPI();
      default:
        Alert.alert("Error", "Unknown method");
    }
  };

  const PaymentOption = ({ id, icon, label, color }) => (
    <TouchableOpacity
      style={[
        styles.paymentBox,
        selectedMethod === id && { borderWidth: 2, borderColor: "#eb5616", transform: [{ scale: 1.02 }] },
      ]}
      onPress={() => setSelectedMethod(id)}
      activeOpacity={0.85}
    >
      <View style={[styles.paymentInner, { backgroundColor: color }]}>{icon}</View>
      <Text style={styles.paymentText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.title}</Text>
        <View style={styles.qtyPriceRow}>
          <Text style={styles.qty}>Qty: {item.qty}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.totalCard}>
        <Ionicons name="cash-outline" size={38} color="#5aae36" />
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <FlatList
        data={state.cartItems}
        keyExtractor={(it) => it.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <Text style={styles.paymentTitle}>Choose Payment Method</Text>
      <View style={styles.paymentGrid}>
        <PaymentOption
          id="razorpay"
          label="Razorpay"
          color="#9b59b6"
          icon={<MaterialCommunityIcons name="alpha-r-circle" size={28} color="#fff" />}
        />
        <PaymentOption
          id="cod"
          label="COD"
          color="#2ecc71"
          icon={<MaterialCommunityIcons name="cash" size={28} color="#fff" />}
        />
        <PaymentOption
          id="stripe"
          label="Card (Stripe)"
          color="#3498db"
          icon={<Ionicons name="card-outline" size={28} color="#fff" />}
        />
        <PaymentOption
          id="upi"
          label="UPI"
          color="#f39c12"
          icon={<MaterialCommunityIcons name="bank" size={28} color="#fff" />}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, !selectedMethod && { opacity: 0.6 }]}
        onPress={onPayPress}
        disabled={!selectedMethod || loading}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payBtnText}>Pay</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f3efda", paddingHorizontal: 16 },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  totalAmountContainer: { flex: 1, alignItems: "flex-end" },
  totalLabel: { fontSize: 10, color: "#555", fontWeight: "600" },
  totalValue: { fontSize: 26, fontWeight: "800", color: "#eb5616", marginTop: 4 },

  item: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, padding: 12, alignItems: "center" },
  image: { width: 86, height: 86, borderRadius: 10, resizeMode: "contain", backgroundColor: "#fafafa" },
  details: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: "700", color: "#222" },
  qtyPriceRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  qty: { fontSize: 13, color: "#777" },
  price: { fontSize: 15, color: "#eb5616", fontWeight: "800" },

  paymentTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginTop: 18, marginBottom: 12, textAlign: "center" },
  paymentGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  paymentBox: {
    width: boxSize,
    height: boxSize,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  paymentInner: { width: 50, height: 50, borderRadius: 31, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  paymentText: { fontSize: 14, fontWeight: "700", color: "#222" },

  payButton: {
    backgroundColor: "#eb5616",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 18,
    shadowColor: "#eb5616",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  payBtnText: { color: "#fff", fontSize: 18, fontWeight: "800" },
});



