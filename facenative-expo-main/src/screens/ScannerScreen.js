import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
    }
  };

  const handleUsePhoto = () => {
    // Handle using the photo
    console.log('Using photo');
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Face Recognition</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.camera} />
        ) : (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.front}
          />
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
        >
          <Text style={styles.captureText}>Capture</Text>
          <MaterialIcons name="camera-alt" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {capturedImage && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.useButton]}
              onPress={handleUsePhoto}
            >
              <MaterialIcons name="check" size={30} color={COLORS.white} />
              <Text style={styles.actionText}>Use this</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={handleRetake}
            >
              <MaterialIcons name="camera-alt" size={30} color={COLORS.white} />
              <Text style={styles.actionText}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <MaterialIcons name="face" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  title: {
    fontSize: SIZES.fontSize.title,
    fontWeight: '600',
  },
  helpText: {
    fontSize: SIZES.fontSize.subtitle,
    color: COLORS.secondary,
  },
  cameraContainer: {
    flex: 1,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  camera: {
    flex: 1,
  },
  controls: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  captureText: {
    color: COLORS.white,
    marginRight: 8,
    fontSize: SIZES.fontSize.button,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: SIZES.radius,
  },
  useButton: {
    backgroundColor: COLORS.success,
  },
  retakeButton: {
    backgroundColor: COLORS.error,
  },
  actionText: {
    color: COLORS.white,
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 30,
    margin: SIZES.padding,
  },
  navItem: {
    padding: 10,
  },
  navItemActive: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
  },
});

export default ScannerScreen;
