// app/StripePayment.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function StripePayment() {
  const router = useRouter();
  const { amount } = useLocalSearchParams(); // passed from CheckoutScreen
  const totalAmount = parseFloat(amount) || 0;

  const [cardNumber, setCardNumber] = useState(""); // formatted with spaces
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  // Format card number into groups of 4 digits
  const handleCardNumberChange = (text) => {
    // allow only digits, then split into groups of 4
    const digits = text.replace(/\D/g, "").slice(0, 16); // max 16 digits
    const groups = digits.match(/.{1,4}/g);
    const formatted = groups ? groups.join(" ") : digits;
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 4); // MMYY
    if (digits.length >= 3) {
      const mm = digits.slice(0, 2);
      const yy = digits.slice(2, 4);
      setExpiry(`${mm}/${yy}`);
    } else if (digits.length >= 1) {
      setExpiry(digits);
    } else {
      setExpiry("");
    }
  };

  // CVV (3 or 4 digits)
  const handleCvvChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
  };

  const simpleValidate = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) return "Enter a valid 16-digit card number";
    if (!cardName || cardName.trim().length < 3) return "Enter card holder name";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY";
    const mm = parseInt(expiry.slice(0, 2), 10);
    if (mm < 1 || mm > 12) return "Enter a valid expiry month (01-12)";
    if (!/^\d{3,4}$/.test(cvv)) return "Enter a valid CVV (3 or 4 digits)";
    return null;
  };

  const handlePay = () => {
    const err = simpleValidate();
    if (err) {
      Alert.alert("Invalid details", err);
      return;
    }

    setLoading(true);

    // Fake processing delay
    setTimeout(() => {
      setLoading(false);
      const txnId = `fake_stripe_${Date.now()}`;
      // Navigate to result screen (your PaymentResult handles clearing the cart on back)
      router.push(`/PaymentResult?success=true&amount=${totalAmount}&txnId=${txnId}`);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.card}>
          <Ionicons name="card" size={48} color="#3498db" style={{ marginBottom: 12 }} />
          <Text style={styles.title}>Enter Card Details</Text>

          <TextInput
            placeholder="Card Number"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            style={styles.input}
            maxLength={19} // 16 digits + 3 spaces
            returnKeyType="next"
          />

          <TextInput
            placeholder="Card Holder Name"
            value={cardName}
            onChangeText={setCardName}
            style={styles.input}
            returnKeyType="next"
          />

          <View style={styles.row}>
            <TextInput
              placeholder="MM/YY"
              value={expiry}
              onChangeText={handleExpiryChange}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              maxLength={5}
              keyboardType="number-pad"
              returnKeyType="next"
            />
            <TextInput
              placeholder="CVV"
              value={cvv}
              onChangeText={handleCvvChange}
              style={[styles.input, { width: 110 }]}
              keyboardType="number-pad"
              secureTextEntry={true}
              maxLength={4}
              returnKeyType="done"
            />
          </View>

          <Text style={styles.amount}>Amount: ${totalAmount.toFixed(2)}</Text>

          <TouchableOpacity
            style={[styles.payButton, loading && { opacity: 0.8 }]}
            onPress={handlePay}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payText}>Pay ${totalAmount.toFixed(2)}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  row: { flexDirection: "row", width: "100%", marginBottom: 8 },
  amount: { marginTop: 6, marginBottom: 12, fontSize: 16, fontWeight: "700", color: "#333" },
  payButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  payText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancel: { paddingVertical: 8 },
  cancelText: { color: "#777" },
});

