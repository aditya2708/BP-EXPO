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
  const navigateToMyChildren = () => navigation.navigate('MySponsoredChildren');
  const navigateToDonationHistory = () => navigation.navigate('DonationHistory');
  const navigateToProfile = () => navigation.navigate('ProfileTab');
  const navigateToNotifications = () => navigation.navigate('Notifications');
  const viewChildDetails = (childId) => navigation.navigate('ChildDetail', { id: childId });

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
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={navigateToNotifications}
            >
              <Ionicons name="notifications-outline" size={24} color="#9b59b6" />
              {dashboardData?.unread_notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {dashboardData.unread_notifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
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
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={navigateToDonationHistory}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#3498db' }]}>
              <Ionicons name="cash" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Donations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#2ecc71' }]}>
              <Ionicons name="settings" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#e74c3c' }]}>
              <Ionicons name="help-circle" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Help</Text>
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
                onPress={() => viewChildDetails(child.id_anak)}
              >
                <View style={styles.childImageContainer}>
                  {child.foto ? (
                    <Image
                      source={{ uri: `https://berbagipendidikan.org/storage/Children/${child.id_anak}/${child.foto}` }}
                      style={styles.childImage}
                    />
                  ) : (
                    <View style={styles.childImagePlaceholder}>
                      <Ionicons name="person" size={30} color="#ffffff" />
                    </View>
                  )}
                </View>
                <Text style={styles.childName}>{child.nama_lengkap}</Text>
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

      {/* Recent Donations */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          <Button 
            title="View All" 
            type="outline" 
            size="small"
            onPress={navigateToDonationHistory}
          />
        </View>
        
        {dashboardData?.recent_donations?.length > 0 ? (
          <View style={styles.donationsContainer}>
            {dashboardData.recent_donations.map((donation, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.donationItem}
                onPress={() => navigation.navigate('DonationDetail', { id: donation.id })}
              >
                <View style={styles.donationIconContainer}>
                  <Ionicons name="cash-outline" size={24} color="#9b59b6" />
                </View>
                <View style={styles.donationInfo}>
                  <Text style={styles.donationTitle}>
                    {donation.type || 'Donation'} {donation.child?.nama_lengkap ? `for ${donation.child.nama_lengkap}` : ''}
                  </Text>
                  <Text style={styles.donationDate}>{donation.date}</Text>
                </View>
                <Text style={styles.donationAmount}>
                  Rp {donation.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cash" size={40} color="#dddddd" />
            <Text style={styles.emptyText}>No donation history yet</Text>
          </View>
        )}
      </View>

      {/* Upcoming Events */}
      {dashboardData?.upcoming_events?.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.eventsContainer}>
            {dashboardData.upcoming_events.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>{event.day}</Text>
                  <Text style={styles.eventMonth}>{event.month}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventLocation}>
                    <Ionicons name="location-outline" size={14} color="#666666" /> {event.location}
                  </Text>
                  <Text style={styles.eventTime}>
                    <Ionicons name="time-outline" size={14} color="#666666" /> {event.time}
                  </Text>
                </View>
              </View>
            ))}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
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
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionItem: {
    width: (width - 80) / 4,
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
  donationsContainer: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
  },
  donationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  donationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  donationInfo: {
    flex: 1,
  },
  donationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 12,
    color: '#999999',
  },
  eventsContainer: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventDate: {
    width: 60,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  eventMonth: {
    fontSize: 12,
    color: '#ffffff',
  },
  eventInfo: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    color: '#666666',
  },
});

export default DonaturDashboardScreen;