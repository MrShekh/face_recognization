import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://192.168.248.175:5000/api/students/login", formData);
      
      if (response.data.token) {
        const { student } = response.data; // Extract student data
        await AsyncStorage.setItem("userId", student._id); // Save userId in AsyncStorage
        await AsyncStorage.setItem("token", response.data.token); // Save token in AsyncStorage

        console.log("User ID saved:", student._id);
        Alert.alert("Login Success", "You have successfully logged in!");
        router.push("/(tabs)"); // Navigate to dashboard
      } else {
        Alert.alert("Login Failed", "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text h3 style={styles.title}>
          Login
        </Text>

        <Input
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} containerStyle={styles.buttonContainer} raised />

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerLink}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  registerLink: {
    textAlign: "center",
    color: "#2089dc",
    marginTop: 10,
  },
});

