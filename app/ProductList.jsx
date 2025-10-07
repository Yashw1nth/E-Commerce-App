/* eslint-disable react-hooks/exhaustive-deps */
// app/ProductList.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { productsApi } from "../api/api";
import ProductCard from "../components/ProductCard";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";

const { width } = Dimensions.get("window");

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const carouselRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // High-quality, same-aspect-ratio images for better layout
  const carouselImages = [
    "https://m.media-amazon.com/images/G/31/IMG25/Fashion/Jupiter/Event/Top/Hero/AF/Phase2/Unrec/Handbag_1500x460._SX1500_QL85_FMpng_.png",
    "https://assets.tatacliq.com/medias/sys_master/images/67370886463518.jpg",
    "https://m.media-amazon.com/images/G/31/IMG25/Fashion/Jupiter/Event/Top/Hero/AF/Phase2/Unrec/Mens_clothing_1500x460._SX1500_QL85_FMpng_.png",
    "https://m.media-amazon.com/images/G/31/IMG25/Fashion/Jupiter/Event/AF/Unrec/PC-SD-banner._CB800908421_.gif",
    "https://assets.tatacliq.com/medias/sys_master/images/67370886791198.jpg",
  ];

  useEffect(() => {
    let mounted = true;
    productsApi
      .get("/products")
      .then((res) => {
        if (!mounted) return;
        setProducts(res.data);
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#eb5616" />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* 🖼️ Carousel (Aspect ratio 1500x460 ~ 3.26:1) */}
            <View style={styles.carouselWrapper}>
              <Carousel
                ref={carouselRef}
                width={width}
                height={width / 3.26} // keeps original aspect ratio
                autoPlay
                autoPlayInterval={3000}
                data={carouselImages}
                scrollAnimationDuration={800}
                onSnapToItem={(index) => setActiveIndex(index)}
                renderItem={({ item }) => (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item }}
                      style={styles.carouselImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />

              {/* Arrows */}
              <TouchableOpacity
                style={[styles.arrowButton, { left: 5 }]}
                onPress={() => carouselRef.current?.prev()}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.arrowButton, { right: 5 }]}
                onPress={() => carouselRef.current?.next()}
              >
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>

              {/* Dots */}
              <View style={styles.dotsWrapper}>
                <AnimatedDotsCarousel
                  length={carouselImages.length}
                  currentIndex={activeIndex}
                  maxIndicators={3}
                  interpolateOpacityAndColor
                  activeIndicatorConfig={{
                    color: "#eb5616",
                    margin: 3,
                    opacity: 1,
                    size: 7,
                  }}
                  inactiveIndicatorConfig={{
                    color: "#ccc",
                    margin: 3,
                    opacity: 0.5,
                    size: 8,
                  }}
                  decreasingDots={[
                    {
                      config: {
                        color: "#ccc",
                        margin: 3,
                        opacity: 0.5,
                        size: 6,
                      },
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.header}>🛍️ Our Products</Text>
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/ProductDetails",
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5eee6da",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  carouselWrapper: {
    width: width,
  },
  imageContainer: {
    width: width,
    height: width / 3.26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  arrowButton: {
    position: "absolute",
    top: "30%",
    backgroundColor: "rgba(74, 70, 70, 0.3)",
    padding: 5,
    borderRadius: 20,
  },
  dotsWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  header: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
    color: "#be622dff",
  },
});










