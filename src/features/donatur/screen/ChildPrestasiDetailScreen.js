import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import { donaturPrestasiApi } from '../api/donaturPrestasiApi';

const { width } = Dimensions.get('window');

const ChildPrestasiDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { childId, prestasiId, childName, onGoBack } = route.params;

  const [prestasi, setPrestasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: `Achievement - ${childName}`,
    });
  }, [navigation, childName]);

  const fetchPrestasiDetail = async () => {
    try {
      setError(null);
      const response = await donaturPrestasiApi.getPrestasiDetail(childId, prestasiId);
      setPrestasi(response.data.data);
    } catch (err) {
      console.error('Error fetching prestasi detail:', err);
      setError('Failed to load achievement details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestasiDetail();
  }, [childId, prestasiId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPrestasiIcon = (jenisPrestasi) => {
    switch (jenisPrestasi?.toLowerCase()) {
      case 'akademik':
        return 'school';
      case 'olahraga':
        return 'fitness';
      case 'seni':
        return 'color-palette';
      case 'karakter':
        return 'heart';
      default:
        return 'trophy';
    }
  };

  const getPrestasiColor = (levelPrestasi) => {
    switch (levelPrestasi?.toLowerCase()) {
      case 'internasional':
        return '#e74c3c';
      case 'nasional':
        return '#f39c12';
      case 'provinsi':
        return '#3498db';
      case 'kota':
        return '#2ecc71';
      case 'sekolah':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading achievement..." />;
  }

  if (error || !prestasi) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error || "Achievement not found"}
          onRetry={fetchPrestasiDetail}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: getPrestasiColor(prestasi.level_prestasi) }
        ]}>
          <Ionicons 
            name={getPrestasiIcon(prestasi.jenis_prestasi)} 
            size={40} 
            color="#ffffff" 
          />
        </View>
        
        <Text style={styles.prestasiTitle}>{prestasi.nama_prestasi}</Text>
        
        <View style={styles.badgeContainer}>
          <View style={[
            styles.typeBadge,
            { backgroundColor: getPrestasiColor(prestasi.level_prestasi) }
          ]}>
            <Text style={styles.badgeText}>{prestasi.jenis_prestasi}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{prestasi.level_prestasi}</Text>
          </View>
        </View>
        
        <Text style={styles.dateText}>
          Achieved on {formatDate(prestasi.tgl_upload)}
        </Text>
      </View>

      {/* Photo */}
      {prestasi.foto_url && (
        <View style={styles.photoContainer}>
          <Text style={styles.sectionTitle}>Achievement Photo</Text>
          <TouchableOpacity style={styles.photoWrapper}>
            <Image
              source={{ uri: prestasi.foto_url }}
              style={styles.prestasiPhoto}
              resizeMode="cover"
            />
            <View style={styles.photoOverlay}>
              <Ionicons name="expand" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Achievement Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Achievement Details</Text>
        
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{prestasi.jenis_prestasi}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Level</Text>
            <Text style={[
              styles.detailValue, 
              { color: getPrestasiColor(prestasi.level_prestasi) }
            ]}>
              {prestasi.level_prestasi}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Achievement Name</Text>
            <Text style={styles.detailValue}>{prestasi.nama_prestasi}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date Recorded</Text>
            <Text style={styles.detailValue}>{formatDate(prestasi.tgl_upload)}</Text>
          </View>
        </View>
      </View>

      {/* Child Info */}
      <View style={styles.childInfoContainer}>
        <Text style={styles.sectionTitle}>Achieved By</Text>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>
            {prestasi.anak?.full_name || childName}
          </Text>
          <Text style={styles.childNote}>
            We are proud of this achievement! 🎉
          </Text>
        </View>
      </View>

      {/* Congratulations Message */}
      <View style={styles.congratsContainer}>
        <Ionicons name="star" size={24} color="#f39c12" />
        <Text style={styles.congratsText}>
          Congratulations to {prestasi.anak?.full_name || childName} for this wonderful achievement!
        </Text>
        <Ionicons name="star" size={24} color="#f39c12" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  prestasiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  levelText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  photoContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  photoWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  prestasiPhoto: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  childInfoContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childInfo: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  childNote: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  congratsContainer: {
    backgroundColor: '#fff3e0',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  congratsText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginHorizontal: 12,
    lineHeight: 22,
  },
});

export default ChildPrestasiDetailScreen;