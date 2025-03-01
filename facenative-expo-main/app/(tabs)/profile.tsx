import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, Button
} from "react-native";
import { router } from "expo-router";
import axios from "axios";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://192.168.248.175:5000/api/students/profile");
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile && profile.name ? (
        <View style={styles.profileContainer}>
          <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
          <Text style={styles.welcomeText}>Welcome, {profile.name}!</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.profileText}>Email: {profile.email}</Text>
            <Text style={styles.profileText}>Phone: {profile.phoneNumber}</Text>
            <Text style={styles.profileText}>Department: {profile.department}</Text>
            <Text style={styles.profileText}>Branch: {profile.branch}</Text>
            <Text style={styles.profileText}>Semester: {profile.semester}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.completeContainer}>
          <Text style={styles.welcomeText}>Welcome, Student!</Text>
          <Text style={styles.completeText}>Please complete your profile to proceed.</Text>
          <Button title="Complete Profile" onPress={() => router.push("/CompleteProfile")} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: { justifyContent: "center", alignItems: "center" },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  infoContainer: { alignItems: "center" },
  welcomeText: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  profileText: { fontSize: 16, marginBottom: 5 },
  completeContainer: { justifyContent: "center", alignItems: "center" },
  completeText: { fontSize: 16, marginBottom: 10, color: "red" },
});

export default ProfileScreen;
