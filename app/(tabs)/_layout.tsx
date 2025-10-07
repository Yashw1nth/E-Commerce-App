import React from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "../../context/CartContext";

export default function TabsLayout() {
  const { state } = useCart();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#ff6b6b",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff" }, // bottom tab background
        headerStyle: { backgroundColor: "#efae17dc" }, // top header background
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => router.push("/CartScreen")}
            >
              <View style={{ width: 28, height: 28 }}>
                <Ionicons name="cart-outline" size={28} color="#333" />
                {state.cartItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{state.cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={22} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => router.push("/CartScreen")}
            >
              <View style={{ width: 28, height: 28 }}>
                <Ionicons name="cart-outline" size={28} color="#333" />
                {state.cartItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{state.cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={22} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => router.push("/CartScreen")}
            >
              <View style={{ width: 28, height: 28 }}>
                <Ionicons name="cart-outline" size={28} color="#333333ff" />
                {state.cartItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{state.cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => router.push("/CartScreen")}
            >
              <View style={{ width: 28, height: 28 }}>
                <Ionicons name="cart-outline" size={28} color="#333" />
                {state.cartItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{state.cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#ff3b30",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});





