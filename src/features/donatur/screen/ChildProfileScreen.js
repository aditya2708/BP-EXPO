import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { donaturAnakApi } from '../api/donaturAnakApi';

const { width } = Dimensions.get('window');

const ChildProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { childId } = route.params;

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch child data
  const fetchChildData = async () => {
    try {
      setError(null);
      const response = await donaturAnakApi.getChildDetails(childId);
      setChild(response.data.data);
    } catch (err) {
      console.error('Error fetching child data:', err);
      setError('Failed to load child profile. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChildData();
  }, [childId]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchChildData();
  };

  // Navigation handlers
  const navigateToSurat = () => {
    navigation.navigate('SuratList', { childId, childName: child.full_name });
  };

  const navigateToPrestasi = () => {
    navigation.navigate('ChildPrestasiList', { childId, childName: child.full_name });
  };

  const navigateToRaport = () => {
    navigation.navigate('ChildRaportList', { childId, childName: child.full_name });
  };

  const navigateToAktivitas = () => {
    navigation.navigate('ChildAktivitasList', { childId, childName: child.full_name });
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading child profile..." />;
  }

  if (!child) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error || "Child profile not found"}
          onRetry={fetchChildData}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header Profile */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {child.foto_url ? (
            <Image
              source={{ uri: child.foto_url }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={60} color="#ffffff" />
            </View>
          )}
        </View>
        
        <Text style={styles.childName}>{child.full_name}</Text>
        <Text style={styles.childNickname}>"{child.nick_name}"</Text>
        
        <View style={styles.basicInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{child.umur || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {child.jenis_kelamin === 'Laki-laki' ? 'Male' : child.jenis_kelamin === 'Perempuan' ? 'Female' : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: '#2ecc71' }]}>{child.status_cpb}</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={navigateToSurat}>
          <View style={[styles.menuIcon, { backgroundColor: '#9b59b6' }]}>
            <Ionicons name="mail" size={24} color="#ffffff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Messages</Text>
            <Text style={styles.menuSubtitle}>Exchange messages with shelter admin</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#cccccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToPrestasi}>
          <View style={[styles.menuIcon, { backgroundColor: '#f39c12' }]}>
            <Ionicons name="trophy" size={24} color="#ffffff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Achievements</Text>
            <Text style={styles.menuSubtitle}>View child's accomplishments</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#cccccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToRaport}>
          <View style={[styles.menuIcon, { backgroundColor: '#3498db' }]}>
            <Ionicons name="document-text" size={24} color="#ffffff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Report Cards</Text>
            <Text style={styles.menuSubtitle}>Academic progress reports</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#cccccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToAktivitas}>
          <View style={[styles.menuIcon, { backgroundColor: '#2ecc71' }]}>
            <Ionicons name="calendar" size={24} color="#ffffff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Activities</Text>
            <Text style={styles.menuSubtitle}>Learning activities and attendance</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#cccccc" />
        </TouchableOpacity>
      </View>

      {/* Detailed Information */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Place of Birth</Text>
            <Text style={styles.detailValue}>{child.tempat_lahir || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>{child.tanggal_lahir || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Religion</Text>
            <Text style={styles.detailValue}>{child.agama || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Child Number</Text>
            <Text style={styles.detailValue}>
              {child.anak_ke && child.dari_bersaudara ? 
                `${child.anak_ke} of ${child.dari_bersaudara}` : '-'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Lives With</Text>
            <Text style={styles.detailValue}>{child.tinggal_bersama || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distance to Shelter</Text>
            <Text style={styles.detailValue}>{child.jarak_rumah || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Educational Information */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Educational Information</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Favorite Subject</Text>
            <Text style={styles.detailValue}>{child.pelajaran_favorit || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Memorization</Text>
            <Text style={styles.detailValue}>{child.hafalan || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hobbies</Text>
            <Text style={styles.detailValue}>{child.hobi || '-'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Achievements</Text>
            <Text style={styles.detailValue}>{child.prestasi || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Shelter Information */}
      {child.shelter && (
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Shelter Information</Text>
          
          <View style={styles.shelterInfo}>
            <Text style={styles.shelterName}>{child.shelter.nama_shelter}</Text>
            <Text style={styles.shelterAddress}>{child.shelter.alamat}</Text>
            {child.kelompok && (
              <Text style={styles.kelompokInfo}>
                Group: {child.kelompok.nama_kelompok} (Level {child.kelompok.level})
              </Text>
            )}
          </View>
        </View>
      )}
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
  profileHeader: {
    backgroundColor: '#9b59b6',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8e44ad',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  childNickname: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 16,
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
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  shelterInfo: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  shelterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  shelterAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  kelompokInfo: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: '500',
  },
});

export default ChildProfileScreen;