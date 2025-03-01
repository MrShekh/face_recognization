import { Feather } from "@expo/vector-icons";
import { Button, Input } from '@rneui/themed';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompleteProfile() {
  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    uid: "",
    branch: "",
    department: "",
    semester: "",
    phoneNumber: "",
    profilePicture: null,
  });
  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found!");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required to upload a picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profileData.name || !profileData.email || !profileData.phoneNumber || !profileData.uid || !profileData.department || !profileData.branch || !profileData.semester) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('studentId', userId);
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('phoneNumber', profileData.phoneNumber);
      formData.append('uid', profileData.uid);
      formData.append('department', profileData.department);
      formData.append('branch', profileData.branch);
      formData.append('semester', profileData.semester);

      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        formData.append('profilePicture', {
          uri: imageUri,
          type: blob.type,
          name: 'profile.jpg'
        } as any);
      }

      await axios.post(
        'http://192.168.248.175:5000/api/students/complete-profile',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      Alert.alert("Success", "Profile completed successfully.");
      router.push("/profile");
    } catch (error: any) {
      console.error("Error saving profile:", error.response?.data || error.message);
      Alert.alert("Error", `Failed to save profile: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Profile</Text>
      </LinearGradient>
      <ScrollView style={styles.content}>
        <View style={styles.pictureSection}>
          <TouchableOpacity onPress={pickImage} style={styles.pictureContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profilePicture} />
            ) : (
              <View style={styles.picturePlaceholder}>
                <Feather name="camera" size={40} color="#666" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.formSection}>
          <Input label="Full Name" value={profileData.name} onChangeText={(text) => setProfileData({ ...profileData, name: text })} />
          <Input label="Email" value={profileData.email} onChangeText={(text) => setProfileData({ ...profileData, email: text })} keyboardType="email-address" />
          <Input label="Phone" value={profileData.phoneNumber} onChangeText={(text) => setProfileData({ ...profileData, phoneNumber: text })} keyboardType="phone-pad" />
          <Input label="Student UID" value={profileData.uid} onChangeText={(text) => setProfileData({ ...profileData, uid: text })} />
          <Input label="Department" value={profileData.department} onChangeText={(text) => setProfileData({ ...profileData, department: text })} />
          <Input label="Branch" value={profileData.branch} onChangeText={(text) => setProfileData({ ...profileData, branch: text })} />
          <Input label="Semester" value={profileData.semester} onChangeText={(text) => setProfileData({ ...profileData, semester: text })} keyboardType="numeric" />
        </View>
        <Button title="Complete Profile" onPress={handleSave} containerStyle={styles.saveButton} buttonStyle={styles.saveButtonStyle} raised disabled={saving} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },
  pictureSection: { alignItems: 'center', marginTop: 20 },
  profilePicture: { width: 120, height: 120, borderRadius: 60 },
  pictureContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e1e1e1' },
  picturePlaceholder: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e1e1e1' },
  saveButton: { marginHorizontal: 16, marginVertical: 20 },
  saveButtonStyle: { backgroundColor: '#4c669f', borderRadius: 25, paddingVertical: 12 },
  formSection: { marginHorizontal: 16, marginTop: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
