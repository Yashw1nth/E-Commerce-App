// app/PaymentResult.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCart } from "../context/CartContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const CONFETTI_COUNT = 28;
const COLORS = ["#ff6b6b", "#ffd166", "#6bf178", "#6bb0ff", "#b276ff", "#ff9ec0"];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function PaymentResult() {
  const { success, amount, txnId } = useLocalSearchParams();
  const router = useRouter();
  const { dispatch } = useCart();
  const isSuccess = success === "true";

  // Confetti animations
  const confettiAnims = useRef(
    new Array(CONFETTI_COUNT).fill(0).map(() => ({
      translateY: new Animated.Value(-20),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Card animation
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Tick mark animation
  const tickScale = useRef(new Animated.Value(0)).current;
  const tickRotate = useRef(new Animated.Value(0)).current;

  // Button pulse
  const btnScale = useRef(new Animated.Value(1)).current;

  // Confetti layout
  const [confettiLayout] = useState(
    new Array(CONFETTI_COUNT).fill(0).map(() => ({
      left: random(16, width - 32),
      delay: random(0, 700),
      duration: random(900, 1700),
      rotateTo: random(180, 720),
      size: Math.round(random(8, 14)),
      color: COLORS[Math.floor(random(0, COLORS.length))],
      tilt: random(-30, 30),
    }))
  );

  useEffect(() => {
    // Card animation
    Animated.parallel([
      Animated.timing(cardScale, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();

    if (isSuccess) {
      setTimeout(() => {
        // Tick mark pop animation
        Animated.sequence([
          Animated.spring(tickScale, { toValue: 1.2, friction: 4, useNativeDriver: true }),
          Animated.spring(tickScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();

        // Tick slight rotation for fun
        Animated.sequence([
          Animated.timing(tickRotate, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(tickRotate, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(tickRotate, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();

        startConfetti();

        // Button pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(btnScale, { toValue: 1.04, duration: 400, useNativeDriver: true }),
            Animated.timing(btnScale, { toValue: 1.0, duration: 400, useNativeDriver: true }),
          ])
        ).start();
      }, 220);
    }
  }, []);

  const startConfetti = () => {
    confettiAnims.forEach((anim, i) => {
      const cfg = confettiLayout[i];
      anim.translateX.setValue(cfg.left);
      anim.translateY.setValue(-20 - random(0, 120));
      anim.rotate.setValue(0);
      anim.opacity.setValue(0);

      Animated.sequence([
        Animated.delay(cfg.delay),
        Animated.parallel([
          Animated.timing(anim.opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
          Animated.timing(anim.translateY, { toValue: height + 40, duration: cfg.duration, useNativeDriver: true }),
          Animated.timing(anim.rotate, { toValue: cfg.rotateTo, duration: cfg.duration, useNativeDriver: true }),
          Animated.timing(anim.translateX, { toValue: cfg.left + random(-80, 80), duration: cfg.duration, useNativeDriver: true }),
        ]),
        Animated.timing(anim.opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleBack = () => {
    dispatch({ type: "CLEAR_CART" });
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        {/* Confetti */}
        {isSuccess &&
          confettiAnims.map((anim, i) => {
            const cfg = confettiLayout[i];
            const rotateInterpolate = anim.rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ["0deg", "360deg"],
            });
            return (
              <Animated.View
                key={`conf-${i}`}
                pointerEvents="none"
                style={[
                  styles.confetti,
                  {
                    left: cfg.left,
                    width: cfg.size,
                    height: cfg.size * 1.6,
                    backgroundColor: cfg.color,
                    borderRadius: 3,
                    transform: [
                      { translateX: Animated.subtract(anim.translateX, cfg.left) },
                      { translateY: anim.translateY },
                      { rotate: rotateInterpolate },
                      { rotateZ: `${cfg.tilt}deg` },
                    ],
                    opacity: anim.opacity,
                  },
                ]}
              />
            );
          })}

        {/* Card */}
        <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          {/* Animated Tick */}
          <Animated.View
            style={{
              transform: [
                { scale: tickScale },
                {
                  rotate: tickRotate.interpolate({
                    inputRange: [-10, 10],
                    outputRange: ["-10deg", "10deg"],
                  }),
                },
              ],
            }}
          >
            {isSuccess ? (
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" style={styles.icon} />
            ) : (
              <Ionicons name="close-circle" size={100} color="#e53935" style={styles.icon} />
            )}
          </Animated.View>

          {isSuccess ? (
            <>
              <Text style={styles.title}>Payment Successful!</Text>
              <Text style={styles.info}>Transaction ID: {txnId}</Text>
              <Text style={styles.info}>Amount Paid: ${parseFloat(amount).toFixed(2)}</Text>
              <Text style={styles.sub}>Your order is confirmed — thank you for shopping with us!</Text>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: "#e53935" }]}>Payment Failed</Text>
              <Text style={styles.info}>Something went wrong. Please try again.</Text>
            </>
          )}

          {/* Back Button */}
          <Animated.View style={{ transform: [{ scale: btnScale }], width: "100%", marginTop: 20 }}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back to Products</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5eee6da" },
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 26,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
  },

  icon: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", color: "#2e7d32", marginBottom: 8, textAlign: "center" },
  info: { fontSize: 16, color: "#555", marginBottom: 4, textAlign: "center" },
  sub: { fontSize: 14, color: "#777", marginTop: 6, textAlign: "center" },

  backButton: {
    backgroundColor: "#eb5616",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  confetti: { position: "absolute", top: -40, zIndex: 1, opacity: 0 },
});














