import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Anak List Item Component
 * A reusable component to display a child's basic information in a list
 * 
 * @param {Object} props - Component props
 * @param {Object} props.anak - Anak (child) data object
 * @param {Function} props.onPress - Function to call when the item is pressed
 * @param {Function} props.onToggleStatus - Function to call when toggle status button is pressed
 * @param {Function} props.onDelete - Function to call when delete button is pressed
 */
const AnakListItem = ({ anak, onPress, onToggleStatus, onDelete }) => {
  if (!anak) return null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar / Photo */}
      <View style={styles.imageContainer}>
        {anak.foto_url ? (
          <Image
            source={{ uri: anak.foto_url }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="person" size={36} color="#ffffff" />
          </View>
        )}
      </View>
      
      {/* Basic Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{anak.full_name || anak.nick_name}</Text>
        {anak.nick_name && anak.full_name && (
          <Text style={styles.nickname}>{anak.nick_name}</Text>
        )}
        
        <View style={styles.detailRow}>
          {/* Age/Birth Year */}
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666666" />
            <Text style={styles.detailText}>
              {anak.tanggal_lahir ? new Date(anak.tanggal_lahir).getFullYear() : 'N/A'}
            </Text>
          </View>
          
          {/* Gender */}
          <View style={styles.detailItem}>
            <Ionicons 
              name={anak.jenis_kelamin === 'L' ? "male-outline" : "female-outline"} 
              size={16} 
              color="#666666" 
            />
            <Text style={styles.detailText}>
              {anak.jenis_kelamin === 'L' ? 'Male' : anak.jenis_kelamin === 'P' ? 'Female' : 'Unknown'}
            </Text>
          </View>
        </View>
        
        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: anak.status_validasi === 'aktif' ? '#2ecc71' : '#e74c3c' }
        ]}>
          <Text style={styles.statusText}>
            {anak.status_validasi || 'Unknown'}
          </Text>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {/* Toggle Status Button */}
        {onToggleStatus && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onToggleStatus(anak)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons 
              name={anak.status_validasi === 'aktif' ? "close-circle-outline" : "checkmark-circle-outline"} 
              size={24} 
              color={anak.status_validasi === 'aktif' ? "#e74c3c" : "#2ecc71"} 
            />
          </TouchableOpacity>
        )}
        
        {/* Delete Button */}
        {onDelete && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onDelete(anak)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="trash-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  nickname: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionContainer: {
    justifyContent: 'space-between',
    height: 60,
  },
  actionButton: {
    padding: 6,
  },
});

export default AnakListItem;