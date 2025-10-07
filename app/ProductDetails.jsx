import React, { useEffect, useState } from "react";
import { Text, Image, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { productsApi } from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { dispatch } = useCart();

  useEffect(() => {
    productsApi.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#eb5616" />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.name}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            dispatch({ type: "ADD_TO_CART", payload: product });
            router.push("/CartScreen");
          }}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, backgroundColor: "#f8f8f8" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
  image: { width: "100%", height: 260, resizeMode: "contain", borderRadius: 10, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 8, color: "#333" },
  price: { fontSize: 20, color: "#eb5616", fontWeight: "bold", marginBottom: 12 },
  desc: { fontSize: 16, color: "#555", lineHeight: 22, marginBottom: 25 },
  addButton: { backgroundColor: "#3888c5ff", paddingVertical: 13, borderRadius: 10, alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 17, fontWeight: "600", letterSpacing: 0.4 },
});









