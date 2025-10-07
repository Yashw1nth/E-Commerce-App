/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function Signup() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSignup = async (values) => {
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(values));
      setModalVisible(true);

      // Automatically redirect after 2 seconds
      setTimeout(() => {
        setModalVisible(false);
        router.push("/(auth)/login");
      }, 2000);
    } catch (err) {
      console.log("Signup error:", err);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [modalVisible]);

  return (
    <View style={styles.container}>
      {/* Lottie Background */}
      <LottieView
        source={{ uri: "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json" }}
        autoPlay
        loop
        style={styles.lottieBackground}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#555"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
              />
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.link}>Already have an account? Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={{ marginBottom: 20 }} />
              <Text style={styles.modalTitle}>Account Created!</Text>
              <Text style={styles.modalMessage}>Redirecting to login...</Text>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lottieBackground: {
    width,
    height: height / 2.5,
    position: "absolute",
    top: 10,
    left: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold",marginTop: 50, marginBottom: 30, textAlign: "center", color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f1ecece6",
    color: "#000",
    width: "100%",
  },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10, width: "100%" },
  buttonText: { color: "#fff",fontSize: 15, fontWeight: "600" },
  error: { color: "red", marginBottom: 8 },
  link: { marginTop: 20, textAlign: "center", color: "#fff" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  modalMessage: { fontSize: 16, color: "#555", textAlign: "center" },
});






