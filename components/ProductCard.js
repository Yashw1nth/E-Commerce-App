import React, { useRef } from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../context/CartContext";

export default function ProductCard({ item, onPress }) {
  const { dispatch, state } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isFavourite = state.favourites?.some(f => f.id === item.id);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch({ type: "REMOVE_FROM_FAV", payload: item });
    } else {
      dispatch({ type: "ADD_TO_FAV", payload: item });
    }
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={["#fdfbfb", "#ebedee"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Image source={{ uri: item.image }} style={styles.image} />

          {/* ✅ Heart icon top-right */}
          <TouchableOpacity style={styles.heartBtn} onPress={toggleFavourite}>
            <Ionicons
              name={isFavourite ? "heart" : "heart-outline"}
              size={17}
              color={isFavourite ? "red" : "#555"}
            />
          </TouchableOpacity>

          <Text style={styles.name} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    overflow: "hidden",
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f5ededff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  image: {
    width: "80%",
    height: 130,
    resizeMode: "contain",
    marginVertical: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#eb5616",
    marginBottom: 10,
  },
});


