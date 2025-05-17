import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Vibration
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import QrTokenHandler from '../utils/qrTokenHandler';

/**
 * QR Code Scanner Component for attendance
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onScan - Callback when QR code is successfully scanned
 * @param {Function} props.onClose - Callback when scanner is closed
 * @param {boolean} props.isLoading - Whether processing is in progress
 * @param {boolean} props.enableTorch - Whether torch is enabled
 */
const QrScanner = ({ 
  onScan, 
  onClose, 
  isLoading = false,
  enableTorch = false
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(enableTorch);
  const [cameraRef, setCameraRef] = useState(null);

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to use the QR scanner',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    })();
  }, [onClose]);

  // Handle QR code scan
  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned || isLoading) return;
    
    // Set scanned to true to prevent multiple scans
    setScanned(true);
    
    // Vibrate to indicate scan
    Vibration.vibrate(100);
    
    try {
      // Parse QR data
      const qrData = QrTokenHandler.parseQrContent(data);
      
      if (qrData.valid) {
        // Pass token data to parent
        onScan(qrData);
      } else {
        // Invalid QR code
        Alert.alert(
          'Invalid QR Code',
          qrData.message || 'The scanned QR code is not a valid attendance token',
          [
            { 
              text: 'Try Again', 
              onPress: () => setScanned(false) 
            }
          ]
        );
      }
    } catch (error) {
      // Error parsing QR code
      Alert.alert(
        'Error Reading QR Code',
        'There was an error reading the QR code. Please try again.',
        [
          { 
            text: 'Try Again', 
            onPress: () => setScanned(false) 
          }
        ]
      );
    }
  };

  // Toggle torch/flashlight
  const toggleTorch = () => {
    setTorch(!torch);
  };

  // If permission not granted, show message
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={50} color="#e74c3c" />
        <Text style={styles.permissionText}>Camera access denied</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close Scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Camera
  ref={(ref) => setCameraRef(ref)}
  style={styles.camera}
  type={Camera.Constants.Type.back}
  flashMode={torch ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
  barCodeScannerSettings={{
    barCodeTypes: [Camera.Constants.BarCodeType.qr],
  }}
  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
>
        <View style={styles.overlay}>
          {/* Top bar with close button */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
              <Ionicons 
                name={torch ? "flash" : "flash-off"} 
                size={25} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Scanning area */}
          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          
          {/* Scan instructions */}
          <View style={styles.instructions}>
            <Text style={styles.scanText}>
              {isLoading 
                ? 'Processing QR code...' 
                : scanned 
                  ? 'QR code scanned!' 
                  : 'Position QR code within frame'
              }
            </Text>
            
            {isLoading && (
              <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
            )}
            
            {scanned && !isLoading && (
              <TouchableOpacity 
                style={styles.scanAgainButton} 
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  closeButton: {
    padding: 8,
  },
  torchButton: {
    padding: 8,
  },
  scanArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#3498db',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#3498db',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#3498db',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#3498db',
  },
  instructions: {
    padding: 20,
    marginBottom: 50,
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
  scanAgainButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QrScanner;