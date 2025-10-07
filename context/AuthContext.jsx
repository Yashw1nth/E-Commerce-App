import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem("user");
        if (json) setUser(JSON.parse(json));
      } catch (e) {
        console.log("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email) => {
    const u = { email };
    setUser(u);
    await AsyncStorage.setItem("user", JSON.stringify(u));
  };

  const signup = async (email) => {
    // For demo, signup works same as login
    const u = { email };
    setUser(u);
    await AsyncStorage.setItem("user", JSON.stringify(u));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
