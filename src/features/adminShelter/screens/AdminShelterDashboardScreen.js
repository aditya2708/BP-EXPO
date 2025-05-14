import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import Button from '../../../common/components/Button';

// Import API
import { adminShelterApi } from '../api/adminShelterApi';

// Import hooks
import { useAuth } from '../../../common/hooks/useAuth';

const { width } = Dimensions.get('window');

const AdminShelterDashboardScreen = () => {
  const navigation = useNavigation();
  const { user, profile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await adminShelterApi.getDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Navigation handlers
  const navigateToAttendance = () => navigation.navigate('Attendance');
  const navigateToAnakManagement = () => navigation.navigate('Management', { screen: 'AnakManagement' });
  const navigateToDonaturManagement = () => navigation.navigate('DonaturManagement');
  const navigateToProfile = () => navigation.navigate('ProfileTab');
  const navigateToTutorManagement = () => navigation.navigate('Management', { screen: 'TutorManagement' });
  // Show loading indicator
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchDashboardData}
        />
      )}

      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>
              {profile?.nama_lengkap || user?.email || 'Admin Shelter'}
            </Text>
            {dashboardData?.shelter && (
              <Text style={styles.shelterText}>
                {dashboardData.shelter.nama_shelter || 'Shelter'}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={navigateToProfile}
          >
            {profile?.foto ? (
              <Image
                source={{ uri: `https://berbagipendidikan.org/storage/AdminShelter/${profile.id_admin_shelter}/${profile.foto}` }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
     <View style={styles.quickActionsContainer}>
  <TouchableOpacity 
    style={styles.actionButton}
    onPress={navigateToAnakManagement}
  >
    <View style={[styles.actionIcon, { backgroundColor: '#e74c3c' }]}>
      <Ionicons name="people" size={24} color="#ffffff" />
    </View>
    <Text style={styles.actionText}>Manage Children</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.actionButton}
    onPress={navigateToTutorManagement}
  >
    <View style={[styles.actionIcon, { backgroundColor: '#2ecc71' }]}>
      <Ionicons name="school" size={24} color="#ffffff" />
    </View>
    <Text style={styles.actionText}>Manage Tutors</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.actionButton}
    onPress={navigateToDonaturManagement}
  >
    <View style={[styles.actionIcon, { backgroundColor: '#9b59b6' }]}>
      <Ionicons name="heart" size={24} color="#ffffff" />
    </View>
    <Text style={styles.actionText}>Manage Donatur</Text>
  </TouchableOpacity>
</View>

      {/* Shelter Information */}
      {dashboardData?.shelter && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shelter Information</Text>
          <View style={styles.shelterInfoCard}>
            <View style={styles.shelterImageContainer}>
              {dashboardData.shelter.foto ? (
                <Image
                  source={{ uri: `https://berbagipendidikan.org/storage/AdminShelter/Shelter/${dashboardData.shelter.foto}` }}
                  style={styles.shelterImage}
                />
              ) : (
                <View style={styles.shelterImagePlaceholder}>
                  <Ionicons name="home" size={40} color="#ffffff" />
                </View>
              )}
            </View>
            
            <View style={styles.shelterDetails}>
              <Text style={styles.shelterName}>{dashboardData.shelter.nama_shelter}</Text>
              <Text style={styles.shelterAddress}>{dashboardData.shelter.alamat || 'No address'}</Text>
              
              <View style={styles.shelterInfoRow}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.shelterInfoText}>
                  {dashboardData.shelter.no_telp || 'No phone number'}
                </Text>
              </View>
              
              <View style={styles.shelterInfoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.shelterInfoText}>
                  {dashboardData.wilbin?.nama_wilbin || 'No wilayah binaan'}
                </Text>
              </View>
              
              <View style={styles.shelterInfoRow}>
                <Ionicons name="business-outline" size={16} color="#666" />
                <Text style={styles.shelterInfoText}>
                  {dashboardData.kacab?.nama_cabang || 'No cabang'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Today's Attendance */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Attendance</Text>
          <Button
            title="Take Attendance"
            size="small"
            onPress={navigateToAttendance}
          />
        </View>
        
        {dashboardData?.today_attendance?.length > 0 ? (
          <View style={styles.attendanceList}>
            {dashboardData.today_attendance.map((attendance, index) => (
              <View key={index} style={styles.attendanceItem}>
                <View style={styles.attendanceProfile}>
                  {attendance.child.foto ? (
                    <Image
                      source={{ uri: `https://berbagipendidikan.org/storage/Children/${attendance.child.id_anak}/${attendance.child.foto}` }}
                      style={styles.attendanceAvatar}
                    />
                  ) : (
                    <View style={styles.attendanceAvatarPlaceholder}>
                      <Ionicons name="person" size={16} color="#ffffff" />
                    </View>
                  )}
                  <Text style={styles.attendanceName}>{attendance.child.nama_lengkap}</Text>
                </View>
                <View style={[
                  styles.attendanceStatus,
                  { backgroundColor: attendance.status ? '#2ecc71' : '#e74c3c' }
                ]}>
                  <Text style={styles.attendanceStatusText}>
                    {attendance.status ? 'Present' : 'Absent'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No attendance records for today</Text>
        )}
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
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#e74c3c',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  shelterText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c0392b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 80) / 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  shelterInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  shelterImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  shelterImage: {
    width: '100%',
    height: '100%',
  },
  shelterImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shelterDetails: {
    flex: 1,
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
  shelterInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  shelterInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  attendanceList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attendanceProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  attendanceAvatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendanceName: {
    fontSize: 14,
    color: '#333',
  },
  attendanceStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attendanceStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default AdminShelterDashboardScreen;