import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CartScreen() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const total = state.cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <View style={styles.actionsRow}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={() =>
                dispatch({
                  type: "UPDATE_QTY",
                  payload: { id: item.id, qty: Math.max(item.qty - 1, 1) },
                })
              }
              style={[styles.qtyBtnPremium, { backgroundColor: "#ea787aff", shadowColor: "#dc7072ff" }]}
              activeOpacity={0.7}
            >
              <Text style={styles.qtySymbol}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyCount}>{item.qty}</Text>

            <TouchableOpacity
              onPress={() =>
                dispatch({
                  type: "UPDATE_QTY",
                  payload: { id: item.id, qty: item.qty + 1 },
                })
              }
              style={[styles.qtyBtnPremium, { backgroundColor: "#8fdd91ff", shadowColor: "#4CAF50" }]}
              activeOpacity={0.7}
            >
              <Text style={styles.qtySymbol}>＋</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              dispatch({ type: "REMOVE_FROM_CART", payload: item })
            }
            style={styles.removeBtn}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      {state.cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🛍️ Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={state.cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push("/CheckoutScreen")}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5eee6da",
    paddingHorizontal: 15,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "#fafafa",
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#eb5616",
    marginVertical: 6,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  qtyBtnPremium: {
    width: 26,
    height: 26,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 4,
  },
  qtySymbol: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 6,
    color: "#333",
  },
  removeBtn: {
    backgroundColor: "#ff4d4f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#eb5616",
  },
  checkoutBtn: {
    backgroundColor: "#3888c5ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#1f2a2bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
});













