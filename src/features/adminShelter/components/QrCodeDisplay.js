import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

/**
 * QR Code Display Component
 * Displays a QR code with a token and provides sharing options
 * 
 * @param {Object} props - Component props
 * @param {string} props.token - The token to encode in the QR code
 * @param {string} props.studentName - Student name for display
 * @param {number} props.size - QR code size (default: 200)
 * @param {Function} props.onShare - Optional callback when share is pressed
 */
const QrCodeDisplay = ({ 
  token, 
  studentName, 
  studentId,
  size = 200, 
  onShare
}) => {
  // Create the QR code data
  const qrData = JSON.stringify({
    token,
    type: 'attendance',
    timestamp: new Date().toISOString()
  });
  
  // Handle share button press
  const handleShare = async () => {
    try {
      // Share the QR code data directly
      await Share.share({
        message: `QR Code token for ${studentName}: ${qrData}`
      });
      
      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Student info header */}
      {studentName && (
        <Text style={styles.studentName}>{studentName}</Text>
      )}
      {studentId && (
        <Text style={styles.studentId}>ID: {studentId}</Text>
      )}
      
      {/* QR Code */}
      <View style={styles.qrContainer}>
        {token ? (
          <QRCode
            value={qrData}
            size={size}
            color="#000"
            backgroundColor="#fff"
            logoBackgroundColor="#fff"
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size }]}>
            <Ionicons name="qr-code" size={size / 2} color="#bdc3c7" />
          </View>
        )}
      </View>
      
      {/* Token display */}
      {token && (
        <Text style={styles.tokenText}>{token.substring(0, 16)}...</Text>
      )}
      
      {/* Share button */}
      <TouchableOpacity 
        style={styles.shareButton}
        onPress={handleShare}
        disabled={!token}
      >
        <Ionicons name="share-outline" size={20} color="#fff" />
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  studentId: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginBottom: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  tokenText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  shareButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '500',
  },
});

export default QrCodeDisplay;