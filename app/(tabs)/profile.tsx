/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../context/CartContext";

export default function Profile() {
  const router = useRouter();
  const { state } = useCart();

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);

  // modal states
  const [ordersModal, setOrdersModal] = useState(false);
  const [wishlistModal, setWishlistModal] = useState(false);
  const [couponModal, setCouponModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  // Load saved profile image
  useEffect(() => {
    const loadProfileImage = async () => {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) setProfileImage(savedImage);
    };
    loadProfileImage();
  }, []);

  const handleWishlistPress = () => {
    if (!state.favourites || state.favourites.length === 0) {
      setWishlistModal(true);
    } else {
      router.push("/(tabs)/favourites");
    }
  };

  // Ask for permissions and launch camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  // Ask for permissions and launch gallery
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Gallery access is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  // ActionSheet to choose Camera or Gallery
  const handleChangeProfile = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Camera", "Gallery"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      Alert.alert(
        "Choose Option",
        "Select where to pick the image",
        [
          { text: "Camera", onPress: openCamera },
          { text: "Gallery", onPress: openGallery },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Personal Information */}
      <View style={styles.personalInfo}>
        <TouchableOpacity onPress={handleChangeProfile}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholder]}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          )}
          <Ionicons
            name="camera"
            size={22}
            color="#fff"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#ff6b6b",
              borderRadius: 12,
              padding: 4,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.name}>Yashwanth</Text>
        <Text style={styles.infoText}>Phone: +91 8686841581</Text>
        <Text style={styles.infoText}>Email: yash@example.com</Text>
        <Text style={styles.infoText}>Address: 123, MG Road, Hyderabad</Text>
      </View>

      {/* 2x2 Containers */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.box} onPress={() => setOrdersModal(true)}>
          <Ionicons name="cart-outline" size={28} color="#ff6b6b" />
          <Text style={styles.boxText}>Your Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={handleWishlistPress}>
          <Ionicons name="heart-outline" size={28} color="#ff6b6b" />
          <Text style={styles.boxText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => setCouponModal(true)}>
          <MaterialIcons name="local-offer" size={28} color="#ff6b6b" />
          <Text style={styles.boxText}>Coupons</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => setHelpModal(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#ff6b6b" />
          <Text style={styles.boxText}>Help Center</Text>
        </TouchableOpacity>
      </View>

      {/* Orders Modal */}
      <Modal transparent visible={ordersModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Your Orders</Text>
            <Text style={styles.modalText}>You haven’t placed any orders yet.</Text>
            <LottieView
              source={{
                uri: "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
              }}
              autoPlay
              loop
              style={{ width: 160, height: 160 }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOrdersModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wishlist Modal */}
      <Modal transparent visible={wishlistModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="heart" size={22} color="#ff6b6b" style={{ marginRight: 6 }} />
              <Text style={styles.modalTitle}>Wishlist</Text>
            </View>
            <Text style={styles.modalText}>Your wishlist is empty.</Text>
            <LottieView
              source={{
                uri: "https://assets4.lottiefiles.com/packages/lf20_t24tpvcu.json",
              }}
              autoPlay
              loop
              style={{ width: 160, height: 160 }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setWishlistModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Coupons Modal */}
      <Modal transparent visible={couponModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>No Coupons Available</Text>
            <LottieView
              source={{
                uri: "https://assets1.lottiefiles.com/packages/lf20_HpFqiS.json",
              }}
              autoPlay
              loop
              style={{ width: 180, height: 180 }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCouponModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Center Modal */}
      <Modal transparent visible={helpModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Customer Care</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="call" size={20} color="red" style={{ marginRight: 6 }} />
              <Text style={styles.modalText}>+91 1800-123-456</Text>
            </View>
            <LottieView
              source={{
                uri: "https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json",
              }}
              autoPlay
              loop
              style={{ width: 140, height: 140 }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setHelpModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5eee6da", padding: 16 },
  personalInfo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  placeholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 20, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  infoText: { fontSize: 14, color: "#777", marginBottom: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  box: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  boxText: { marginTop: 10, fontSize: 14, fontWeight: "600", color: "#1e293b" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10, color: "#333" },
  modalText: { fontSize: 16, color: "#444", marginBottom: 10 },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeText: { color: "#fff", fontWeight: "600" },
});


