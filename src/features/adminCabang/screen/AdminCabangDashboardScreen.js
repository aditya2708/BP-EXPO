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

// Import API
import { adminCabangApi } from '../api/adminCabangApi';

// Import hooks
import { useAuth } from '../../../common/hooks/useAuth';

const { width } = Dimensions.get('window');

const AdminCabangDashboardScreen = () => {
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
      const response = await adminCabangApi.getDashboard();
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
  const navigateToWilbin = () => navigation.navigate('WilbinManagement');
  const navigateToShelter = () => navigation.navigate('ShelterManagement');
  const navigateToAdminShelter = () => navigation.navigate('AdminShelterManagement');
  const navigateToProfile = () => navigation.navigate('ProfileTab');

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

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back,
            </Text>
            <Text style={styles.nameText}>
              {profile?.nama_lengkap || user?.email || 'Admin Cabang'}
            </Text>
            {dashboardData?.kacab && (
              <Text style={styles.cabangText}>
                {dashboardData.kacab.nama_cabang || 'Cabang'}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={navigateToProfile}
          >
            {profile?.foto ? (
              <Image
                source={{ uri: `https://berbagipendidikan.org/storage/AdminCabang/${profile.id_admin_cabang}/${profile.foto}` }}
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

      {/* Stats Overview */}
      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <Ionicons name="map-outline" size={28} color="#2ecc71" />
          <View style={styles.statTextContainer}>
            <Text style={styles.statNumber}>{dashboardData?.wilbin_count || 0}</Text>
            <Text style={styles.statLabel}>Wilayah Binaan</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="home-outline" size={28} color="#e74c3c" />
          <View style={styles.statTextContainer}>
            <Text style={styles.statNumber}>{dashboardData?.shelter_count || 0}</Text>
            <Text style={styles.statLabel}>Shelter</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={28} color="#3498db" />
          <View style={styles.statTextContainer}>
            <Text style={styles.statNumber}>{dashboardData?.admin_shelter_count || 0}</Text>
            <Text style={styles.statLabel}>Admin Shelter</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={navigateToWilbin}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#2ecc71' }]}>
              <Ionicons name="map" size={26} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Manage Wilbin</Text>
            <Text style={styles.actionDescription}>
              Add or manage wilayah binaan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={navigateToShelter}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#e74c3c' }]}>
              <Ionicons name="home" size={26} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Manage Shelter</Text>
            <Text style={styles.actionDescription}>
              Add or manage shelters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={navigateToAdminShelter}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#3498db' }]}>
              <Ionicons name="people" size={26} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Admin Shelter</Text>
            <Text style={styles.actionDescription}>
              Manage shelter admins
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#9b59b6' }]}>
              <Ionicons name="document-text" size={26} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Reports</Text>
            <Text style={styles.actionDescription}>
              View reports and statistics
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cabang Info */}
      {dashboardData?.kacab && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cabang Information</Text>
          <View style={styles.cabangInfoCard}>
            <View style={styles.cabangInfoRow}>
              <Text style={styles.cabangInfoLabel}>Cabang Name:</Text>
              <Text style={styles.cabangInfoValue}>{dashboardData.kacab.nama_cabang || '-'}</Text>
            </View>
            <View style={styles.cabangInfoRow}>
              <Text style={styles.cabangInfoLabel}>Address:</Text>
              <Text style={styles.cabangInfoValue}>{dashboardData.kacab.alamat || '-'}</Text>
            </View>
            <View style={styles.cabangInfoRow}>
              <Text style={styles.cabangInfoLabel}>Phone:</Text>
              <Text style={styles.cabangInfoValue}>{dashboardData.kacab.no_telp || '-'}</Text>
            </View>
            <View style={styles.cabangInfoRow}>
              <Text style={styles.cabangInfoLabel}>Email:</Text>
              <Text style={styles.cabangInfoValue}>{dashboardData.kacab.email || '-'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Recent Activities */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {dashboardData?.recent_activities?.length > 0 ? (
          dashboardData.recent_activities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="time-outline" size={20} color="#2ecc71" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.description}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent activities found</Text>
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
  headerSection: {
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cabangText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statTextContainer: {
    marginLeft: 10,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
  },
  cabangInfoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  cabangInfoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cabangInfoLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  cabangInfoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f8f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});

export default AdminCabangDashboardScreen;