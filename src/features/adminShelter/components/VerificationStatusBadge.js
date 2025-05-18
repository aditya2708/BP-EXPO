import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Verification Status Badge Component
 * Displays the verification status of an attendance record
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isVerified - Whether attendance is verified
 * @param {string} props.status - Verification status (pending, verified, rejected, manual)
 * @param {string} props.method - Verification method (qr_code, manual, face_recognition, dual)
 * @param {boolean} props.showMethod - Whether to show verification method
 * @param {boolean} props.compact - Whether to use compact display
 * @param {Function} props.onPress - Callback when badge is pressed
 */
const VerificationStatusBadge = ({ 
  isVerified = false,
  status = 'pending',
  method = null,
  showMethod = true,
  compact = false,
  onPress = null,
  style
}) => {
  // Determine status colors and icons
  const getStatusColor = () => {
    if (isVerified) {
      return '#2ecc71'; // Green for verified
    } else if (status === 'rejected') {
      return '#e74c3c'; // Red for rejected
    } else {
      return '#f39c12'; // Orange for pending
    }
  };
  
  const getStatusIcon = () => {
    if (isVerified) {
      return 'checkmark-circle';
    } else if (status === 'rejected') {
      return 'close-circle';
    } else {
      return 'time';
    }
  };
  
  const getStatusText = () => {
    if (isVerified) {
      return status === 'manual' ? 'Manually Verified' : 'Verified';
    } else if (status === 'rejected') {
      return 'Rejected';
    } else {
      return 'Pending';
    }
  };
  
  const getMethodText = () => {
    if (!method) return null;
    
    switch (method) {
      case 'qr_code':
        return 'QR Code';
      case 'manual':
        return 'Manual';
      case 'face_recognition':
        return 'Face Recognition';
      case 'dual':
        return 'QR + Face';
      default:
        return method;
    }
  };
  
  const content = (
    <View style={[
      styles.container, 
      { backgroundColor: getStatusColor() },
      compact ? styles.compactContainer : null,
      style
    ]}>
      <Ionicons 
        name={getStatusIcon()} 
        size={compact ? 14 : 16} 
        color="#fff" 
      />
      <Text style={[
        styles.statusText,
        compact ? styles.compactText : null
      ]}>
        {getStatusText()}
      </Text>
      
      {showMethod && method && !compact && (
        <View style={styles.methodContainer}>
          <Text style={styles.methodText}>{getMethodText()}</Text>
        </View>
      )}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f39c12',
  },
  compactContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  compactText: {
    fontSize: 12,
  },
  methodContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  methodText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default VerificationStatusBadge;