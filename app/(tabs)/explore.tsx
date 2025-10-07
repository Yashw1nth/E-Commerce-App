/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import products from "@/data/products";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Carousel Images
const carouselImages = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
];

// Categories
const categories = [
  { key: "all", label: "All", icon: "apps" },
  { key: "men's clothing", label: "Men's", icon: "man" },
  { key: "women's clothing", label: "Women's", icon: "woman" },
  { key: "jewelery", label: "Jewelery", icon: "diamond" },
  { key: "electronics", label: "Electronics", icon: "tv" },
];

export default function Explore() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState(products);
  const [activeCat, setActiveCat] = useState("all");

  // Products animation refs
  const animatedRefs = useRef<boolean[]>([]);

  // Container fade animation
  const fade = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Carousel refs
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const dotsValue = useSharedValue(0);

  const handleNext = () => {
    const next =
      currentIndex.current === carouselImages.length - 1
        ? 0
        : currentIndex.current + 1;
    currentIndex.current = next;
    dotsValue.value = next;
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const handlePrev = () => {
    const prev =
      currentIndex.current === 0
        ? carouselImages.length - 1
        : currentIndex.current - 1;
    currentIndex.current = prev;
    dotsValue.value = prev;
    flatListRef.current?.scrollToIndex({ index: prev, animated: true });
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => handleNext(), 4000);
    return () => clearInterval(timer);
  }, []);

  // Track carousel index
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      currentIndex.current = viewableItems[0].index;
      dotsValue.value = viewableItems[0].index;
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Filter products
  const applyFilter = (query: string, category: string) => {
    const q = query.trim().toLowerCase();
    const results = products.filter((item: any) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory =
        category === "all" || item.category?.toLowerCase() === category;
      return matchTitle && matchCategory;
    });
    setFiltered(results);
    animatedRefs.current = []; // reset animation refs for new filtered products
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilter(text, activeCat);
  };

  const handleCategory = (cat: string) => {
    setActiveCat(cat);
    applyFilter(searchQuery, cat);
  };

  // Animated product card with fade + step-down + spring
  const AnimatedCard = ({ item, index }: any) => {
    const anim = useSharedValue(0);

    useEffect(() => {
      if (!animatedRefs.current[index]) {
        anim.value = withDelay(
          index * 100,
          withTiming(1, { duration: 500 })
        );
        animatedRefs.current[index] = true;
      } else {
        anim.value = 1;
      }
    }, []);

    const style = useAnimatedStyle(() => ({
      opacity: anim.value,
      transform: [
        {
          translateY: anim.value
            ? withSpring(0, { damping: 10, stiffness: 90 })
            : 20,
        },
      ],
    }));

    return (
      <Animated.View style={style}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({ pathname: "/ProductDetails", params: { id: item.id } })
          }
        >
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.description || "No description available"}
            </Text>
            <Text style={styles.cardPrice}>₹{item.price}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Animated dot for carousel
  const Dot = ({ index }: { index: number }) => {
    const style = useAnimatedStyle(() => {
      const active = dotsValue.value === index;
      return {
        width: withSpring(active ? 18 : 6),
        height: 6,
        borderRadius: 5,
        marginHorizontal: 4,
        backgroundColor: active ? "#ff6b6b" : "#fff",
      };
    });
    return <Animated.View style={style} />;
  };

  return (
    <LinearGradient colors={["#f6e9dada", "#a6bfd8ff"]} style={styles.container}>
      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={carouselImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.carouselImage} />
          )}
        />

        {/* Arrows */}
        <TouchableOpacity style={styles.leftArrow} onPress={handlePrev}>
          <Ionicons name="chevron-back" size={23} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightArrow} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={23} color="#fff" />
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {carouselImages.map((_, i) => (
            <Dot key={i} index={i} />
          ))}
        </View>
      </View>

      {/* Search & Categories */}
      <View>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={22}
            color="#888"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#999"
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#888"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((c) => {
            const active = activeCat === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.categoryChip,
                  active && { backgroundColor: "#ff6b6b" },
                ]}
                onPress={() => handleCategory(c.key)}
              >
                <MaterialIcons
                  name={c.icon as any}
                  size={16}
                  color={active ? "#fff" : "#1e293b"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[styles.categoryText, active && { color: "#fff" }]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product List */}
      <Animated.View style={[{ flex: 1 }, containerStyle]}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LottieView
              source={{
                uri: "https://assets7.lottiefiles.com/packages/lf20_HpFqiS.json",
              }}
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
            />
            <Text style={styles.emptyText}>No products found!</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <AnimatedCard item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, paddingHorizontal: 10 },
  carouselContainer: {
    height: 160,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  carouselImage: {
    width: width - 24,
    height: 160,
    borderRadius: 20,
    resizeMode: "cover",
    marginHorizontal: 5,
  },
  leftArrow: {
    position: "absolute",
    left: 8,
    top: "40%",
    backgroundColor: "#8c838366",
    borderRadius: 20,
    padding: 3,
  },
  rightArrow: {
    position: "absolute",
    right: 5,
    top: "40%",
    backgroundColor: "#8c838366",
    borderRadius: 20,
    padding: 3,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  input: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, fontSize: 16, color: "#111" },
  categoryContainer: { marginBottom: 16 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6fafaff",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 0.1,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: { fontSize: 13, fontWeight: "600", color: "#1e293b" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: { width: 90, height: 90, borderRadius: 12, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  cardDesc: { fontSize: 13, color: "#555", marginBottom: 6 },
  cardPrice: { fontSize: 15, fontWeight: "700", color: "#ef4444" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 20, fontSize: 16, fontWeight: "600", color: "#888" },
});












