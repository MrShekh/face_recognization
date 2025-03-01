import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import axios from "axios";

const ProfileScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://192.168.248.175:5000/api/students/profile");
        setProfile(response.data); // Set fetched profile data
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile && profile.name ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {profile.name}!</Text>
          <Text style={styles.welcomeText}>profilePicture, {profile.profilePicture}!</Text>
          <Text style={styles.profileText}>Email: {profile.email}</Text>
          <Text style={styles.profileText}>Phone: {profile.phoneNumber}</Text>
          <Text style={styles.profileText}>department: {profile.department}</Text>
          <Text style={styles.profileText}>branch: {profile.branch}</Text>
          <Text style={styles.profileText}>semester: {profile.semester}</Text>
        </>
      ) : (
        <>
          <Text style={styles.welcomeText}>Welcome, Student!</Text>
          <Text style={styles.completeText}>Please complete your profile to proceed.</Text>
          <Button title="Complete Profile" onPress={() => router.push("/CompleteProfile")} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 20, fontWeight: "bold" },
  profileText: { fontSize: 16, marginTop: 10 },
  completeText: { fontSize: 16, marginBottom: 10, color: "red" },
});

export default ProfileScreen;
