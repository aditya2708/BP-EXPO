import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
const { width } = Dimensions.get('window');

const ActivityCard = ({ activity, onPress, onEdit, onDelete }) => {
  // Determine icon based on activity type
  const getActivityIcon = () => {
    if (activity.jenis_kegiatan?.toLowerCase() === 'bimbel') {
      return 'book';
    }
    return 'people';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        {/* Left side: image or icon placeholder */}
        <View style={styles.imageContainer}>
          {activity.foto_1_url ? (
            <Image
              source={{ uri: activity.foto_1_url }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name={getActivityIcon()} size={30} color="#bdc3c7" />
            </View>
          )}
        </View>
        
        {/* Right side: activity details */}
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {activity.jenis_kegiatan || 'Activity'}
          </Text>
          
          <Text style={styles.date}>
            {activity.tanggal 
              ? format(new Date(activity.tanggal), 'EEEE, dd MMMM yyyy', { locale: id })
              : 'No date'
            }
          </Text>
          
          {activity.nama_kelompok && (
            <Text style={styles.group} numberOfLines={1}>
              Group: {activity.nama_kelompok}
            </Text>
          )}
          
          {activity.level && (
            <Text style={styles.level} numberOfLines={1}>
              Level: {activity.level}
            </Text>
          )}
        </View>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(activity)}
        >
          <Ionicons name="create-outline" size={22} color="#3498db" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete(activity.id_aktivitas)}
        >
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.15,
    height: width * 0.15,
    maxWidth: 60,
    maxHeight: 60,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  group: {
    fontSize: 13,
    color: '#34495e',
  },
  level: {
    fontSize: 13,
    color: '#34495e',
  },
  actions: {
    flexDirection: 'row',
    padding: 4,
  },
  actionButton: {
    padding: 6,
    marginLeft: 5,
  }
});

export default ActivityCard;