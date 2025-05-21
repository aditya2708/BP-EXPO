import React, { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";

const TestExpoCameraScreen = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Check permissions every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkPermission = async () => {
        const cameraPermission = await requestPermission();
        console.log("Camera permission status:", cameraPermission);
      };
      
      checkPermission();
    }, [requestPermission])
  );

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = ({ data, type }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("Scanned QR Code", `Data: ${data}\nType: ${type}`);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      {/* Camera View without children */}
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"]
        }}
        onBarcodeScanned={handleScan}
      />
      
      {/* UI elements positioned absolutely over the camera */}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    padding: 20
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 2
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TestExpoCameraScreen;