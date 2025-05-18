import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const ActivityCard = ({ activity, onPress, onEdit, onDelete }) => {
  // Format date
  const formattedDate = activity.tanggal ? 
    format(new Date(activity.tanggal), 'dd MMM yyyy') : 'No date';

  // Get appropriate icon based on activity type
  const getActivityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'bimbel':
        return 'book';
      case 'kegiatan':
        return 'people';
      default:
        return 'calendar';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Activity Image */}
      <View style={styles.imageContainer}>
        {activity.foto_1_url ? (
          <Image 
            source={{ uri: activity.foto_1_url }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons 
              name={getActivityIcon(activity.jenis_kegiatan)} 
              size={40} 
              color="#bdc3c7" 
            />
          </View>
        )}
      </View>
      
      {/* Activity Details */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {activity.jenis_kegiatan || 'Unnamed Activity'}
        </Text>
        
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>
        
        {activity.nama_kelompok && (
          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={16} color="#7f8c8d" />
            <Text style={styles.metaText}>{activity.nama_kelompok}</Text>
          </View>
        )}
        
        {activity.materi && (
          <View style={styles.metaRow}>
            <Ionicons name="book-outline" size={16} color="#7f8c8d" />
            <Text style={styles.metaText} numberOfLines={1}>
              {activity.materi}
            </Text>
          </View>
        )}
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onEdit}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="create-outline" size={22} color="#3498db" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  actions: {
    padding: 8,
    justifyContent: 'space-around',
    borderLeftWidth: 1,
    borderLeftColor: '#ecf0f1',
  },
  actionButton: {
    padding: 4,
  },
});

export default ActivityCard;