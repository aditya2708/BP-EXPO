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
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { donaturApi } from '../api/donaturApi';

// Import hooks
import { useAuth } from '../../../common/hooks/useAuth';

const { width } = Dimensions.get('window');

const DonaturDashboardScreen = () => {
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
      const response = await donaturApi.getDashboard();
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
  const navigateToMyChildren = () => navigation.navigate('ChildList');
  const navigateToProfile = () => navigation.navigate('ProfileTab');
  const viewChildDetails = (childId, childName) => navigation.navigate('ChildProfile', { childId, childName });

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
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>
              {profile?.nama_lengkap || user?.email || 'Donatur'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            {profile?.foto ? (
              <Image
                source={{ uri: `https://berbagipendidikan.org/storage/Donatur/${profile.id_donatur}/${profile.foto}` }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Donation Summary */}
        <View style={styles.donationSummary}>
          <View style={styles.donationStat}>
            <Text style={styles.donationAmount}>
              {dashboardData?.sponsored_children || 0}
            </Text>
            <Text style={styles.donationLabel}>Sponsored Children</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.donationStat}>
            <Text style={styles.donationAmount}>
              {dashboardData?.total_donations ? `Rp ${dashboardData.total_donations.toLocaleString()}` : 'Rp 0'}
            </Text>
            <Text style={styles.donationLabel}>Total Donation</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={navigateToMyChildren}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#9b59b6' }]}>
              <Ionicons name="people" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>My Children</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Sponsored Children */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Sponsored Children</Text>
          <Button 
            title="View All" 
            type="outline" 
            size="small"
            onPress={navigateToMyChildren}
          />
        </View>
        
        {dashboardData?.sponsored_children_data?.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.childrenContainer}
          >
            {dashboardData.sponsored_children_data.map((child, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.childCard}
                onPress={() => viewChildDetails(child.id_anak, child.full_name)}
              >
                <View style={styles.childImageContainer}>
                  {child.foto_url ? (
                    <Image
                      source={{ uri: child.foto_url }}
                      style={styles.childImage}
                    />
                  ) : (
                    <View style={styles.childImagePlaceholder}>
                      <Ionicons name="person" size={30} color="#ffffff" />
                    </View>
                  )}
                </View>
                <Text style={styles.childName}>{child.full_name}</Text>
                <Text style={styles.childAge}>
                  {child.umur ? `${child.umur} years old` : 'Age not specified'}
                </Text>
                <Text style={styles.childShelter}>{child.shelter?.nama_shelter || 'No shelter'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={40} color="#dddddd" />
            <Text style={styles.emptyText}>You have no sponsored children yet</Text>
            <Button 
              title="Explore Children" 
              type="primary"
              size="small"
              style={styles.exploreButton}
            />
          </View>
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666666',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donationSummary: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  donationStat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
  donationAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 4,
  },
  donationLabel: {
    fontSize: 12,
    color: '#666666',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
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
    color: '#333333',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  actionItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
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
    color: '#333333',
    textAlign: 'center',
  },
  childrenContainer: {
    paddingBottom: 8,
  },
  childCard: {
    width: 140,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  childImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 12,
  },
  childImage: {
    width: '100%',
    height: '100%',
  },
  childImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  childShelter: {
    fontSize: 12,
    color: '#999999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    marginVertical: 12,
  },
  exploreButton: {
    marginTop: 8,
  },
});

export default DonaturDashboardScreen;