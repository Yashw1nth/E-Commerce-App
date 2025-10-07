import { Stack } from "expo-router";
import React from "react";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        {/* Auth flow */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Main app tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Other screens */}
        <Stack.Screen name="ProductDetails" options={{ title: "Product Details" }} />
        <Stack.Screen name="CheckoutScreen" options={{ title: "Checkout" }} />
        <Stack.Screen name="PaymentResult" options={{ title: "Payment Result" }} />
        <Stack.Screen name="StripePayment" options={{ title: "Stripe Payment" }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </CartProvider>
  );
}
















