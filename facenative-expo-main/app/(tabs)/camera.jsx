import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function captureImage() {
    if (!cameraRef.current) return;

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);

      // ✅ Resize Image
      const resizedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("✅ Resized Image URI:", resizedImage.uri);

       // ✅ Upload to Cloudinary
       const cloudinaryUrl = await uploadToCloudinary(resizedImage.uri);
       if (cloudinaryUrl) {
         // ✅ Retrieve Student ID from AsyncStorage
         const studentId = await AsyncStorage.getItem("userId");
 
         if (studentId) {
           await sendImageToBackend(studentId, cloudinaryUrl);
         } else {
           console.error("❌ Error: Student ID not found in AsyncStorage");
         }
       }
 
     } catch (error) {
       console.error("❌ Error capturing image:", error);
     }
     setLoading(false);
   }

  async function uploadToCloudinary(imageUri) {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    data.append("upload_preset", "abcdef"); // Replace with your Cloudinary preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dqxkvpcdk/image/upload', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });

      const result = await response.json();
      if (result.secure_url) {
        console.log("✅ Cloudinary Upload Success:", result.secure_url);
        return result.secure_url;
      } else {
        throw new Error("Upload failed: No URL received");
      }
    } catch (error) {
      console.error("❌ Cloudinary Upload Failed:", error);
      return null;
    }
  }

  async function sendImageToBackend(studentId, imageUrl) {
    try {
      const response = await fetch('http://192.168.248.175:5000/api/students/mark-attendance', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          capturedImage: imageUrl,  
        }),
      });
  
      const responseText = await response.text();
      console.log("Raw response:", responseText);
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
  
      const result = JSON.parse(responseText);
      console.log('✅ Attendance Marked:', result);
      
  
      // ✅ Reset UI whether matched or not
    setCapturedImage(null);
  
    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      alert('Failed to mark attendance');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlayContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.camera} />
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />
        )}
        <View style={styles.oval} />
      </View>
      {/* Capture Button */}
      <TouchableOpacity style={styles.captureButton} onPress={captureImage} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  overlayContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oval: {
    width: 320,
    height: 400,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 160,
    position: 'absolute',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'gray',
  },
});
