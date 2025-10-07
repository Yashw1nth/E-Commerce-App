import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

export default function Favourites() {
  const { state, dispatch } = useCart();
  const favourites = state.favourites || [];

  const removeFavourite = (item: any) => {
    dispatch({ type: "REMOVE_FROM_FAV", payload: item });
  };

  // Online Lottie URL (example)
  const emptyAnimationUrl =
    "https://assets7.lottiefiles.com/packages/lf20_puciaact.json"; // replace with a valid URL

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={{ uri: emptyAnimationUrl }}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.emptyText}>No favourites yet</Text>
        <Text style={styles.subText}>
          Tap the ❤️ icon on a product to add it here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favourites}
      keyExtractor={(item, idx) =>
        item?.id ? String(item.id) : `fav-${idx}`
      }
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.price !== undefined && (
              <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeFavourite(item)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: "#f5eee6da",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 12,
    backgroundColor: "#f6f6f6",
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#eb5616",
  },
  removeBtn: {
    alignSelf: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  removeText: {
    color: "#eb5616",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5eee6da",
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
