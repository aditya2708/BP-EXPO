import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { adminShelterKelompokApi } from '../api/adminShelterKelompokApi';
import { useAuth } from '../../../common/hooks/useAuth';

const KelompokDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = useAuth();
  
  // Get kelompok ID from route params
  const { id } = route.params || {};
  
  // State
  const [kelompok, setKelompok] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch kelompok details
  const fetchKelompokDetails = async () => {
    try {
      setError(null);
      
      const response = await adminShelterKelompokApi.getKelompokDetail(id);
      
      if (response.data.success) {
        setKelompok(response.data.data);
        // Set screen title based on kelompok name
        navigation.setOptions({ 
          headerTitle: response.data.data.nama_kelompok || 'Group Detail' 
        });
      } else {
        setError(response.data.message || 'Failed to load group details');
      }
    } catch (err) {
      console.error('Error fetching kelompok details:', err);
      setError('Failed to load group details. Please try again.');
    }
  };
  
  // Fetch children in kelompok
  const fetchGroupChildren = async () => {
    try {
      const response = await adminShelterKelompokApi.getGroupChildren(id);
      
      if (response.data.success) {
        setChildren(response.data.data || []);
      } else {
        console.error('Error fetching group children:', response.data.message);
      }
    } catch (err) {
      console.error('Error fetching group children:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    if (id) {
      Promise.all([
        fetchKelompokDetails(),
        fetchGroupChildren()
      ]);
    }
  }, [id]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      fetchKelompokDetails(),
      fetchGroupChildren()
    ]);
  };
  
  // Navigate to edit kelompok
  const handleEditKelompok = () => {
    navigation.navigate('KelompokForm', { kelompok });
  };
  
  // Handle delete kelompok
  const handleDeleteKelompok = () => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete ${kelompok.nama_kelompok}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Check if group has children
              if (children.length > 0) {
                Alert.alert(
                  'Cannot Delete',
                  'This group has children assigned to it. Remove all children first.',
                  [{ text: 'OK' }]
                );
                setLoading(false);
                return;
              }
              
              const response = await adminShelterKelompokApi.deleteKelompok(id);
              
              if (response.data.success) {
                Alert.alert(
                  'Success',
                  'Group has been deleted',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack()
                    }
                  ]
                );
              } else {
                setError(response.data.message || 'Failed to delete group');
                setLoading(false);
              }
            } catch (err) {
              console.error('Error deleting kelompok:', err);
              setError('Failed to delete group. Please try again.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Handle remove child from group
  const handleRemoveChild = (child) => {
    Alert.alert(
      'Remove Child',
      `Are you sure you want to remove ${child.full_name || child.nick_name} from this group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const response = await adminShelterKelompokApi.removeChildFromGroup(
                id,
                child.id_anak
              );
              
              if (response.data.success) {
                // Refresh data
                fetchGroupChildren();
                fetchKelompokDetails();
              } else {
                setError(response.data.message || 'Failed to remove child');
                setLoading(false);
              }
            } catch (err) {
              console.error('Error removing child:', err);
              setError('Failed to remove child. Please try again.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Navigate to add children screen
  const handleAddChildren = () => {
    // Navigate to a screen to add children
    // This would be another screen to implement
    Alert.alert('Coming Soon', 'Add children functionality will be available soon.');
  };
  
  // Render child item
  const renderChildItem = ({ item: child }) => (
    <View style={styles.childItem}>
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{child.full_name || child.nick_name}</Text>
        <Text style={styles.childDetails}>
          {child.jenis_kelamin === 'L' ? 'Male' : 'Female'} 
          {child.tanggal_lahir ? ` • ${calculateAge(child.tanggal_lahir)}` : ''}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveChild(child)}
      >
        <Ionicons name="close-circle" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
  
  // Helper function to calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    
    // Handle different date formats
    let dob;
    try {
      // Check for DD-MM-YYYY format
      if (birthDate.match(/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/)) {
        const parts = birthDate.split(/[-/]/);
        dob = new Date(parts[2], parts[1] - 1, parts[0]);
      } 
      // Handle YYYY-MM-DD format
      else if (birthDate.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/)) {
        dob = new Date(birthDate);
      } 
      // Try direct parsing as fallback
      else {
        dob = new Date(birthDate);
      }
      
      if (isNaN(dob.getTime())) {
        return '';
      }
      
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return `${age} years`;
    } catch (error) {
      return '';
    }
  };
  
  // Loading state
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading group details..." />;
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
          onRetry={handleRefresh}
        />
      )}
      
      {kelompok && (
        <>
          {/* Group Information */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.groupName}>{kelompok.nama_kelompok}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEditKelompok}
                >
                  <Ionicons name="create-outline" size={22} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleDeleteKelompok}
                >
                  <Ionicons name="trash-outline" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Level:</Text>
              <Text style={styles.detailValue}>
                {kelompok.level_anak_binaan?.nama_level_binaan || 'No Level'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Children:</Text>
              <Text style={styles.detailValue}>{kelompok.anak_count || 0}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shelter:</Text>
              <Text style={styles.detailValue}>
                {kelompok.shelter?.nama_shelter || 'Unknown Shelter'}
              </Text>
            </View>
          </View>
          
          {/* Children List */}
          <View style={styles.childrenContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Children in Group</Text>
              <Button
                title="Add Children"
                onPress={handleAddChildren}
                type="primary"
                size="small"
                style={styles.addChildrenButton}
                leftIcon={<Ionicons name="add" size={16} color="#ffffff" />}
              />
            </View>
            
            {children.length > 0 ? (
              <FlatList
                data={children}
                renderItem={renderChildItem}
                keyExtractor={(item) => item.id_anak?.toString()}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyChildren}>
                <Ionicons name="people" size={40} color="#cccccc" />
                <Text style={styles.emptyText}>No children in this group</Text>
                <Button
                  title="Add Children"
                  onPress={handleAddChildren}
                  type="outline"
                  size="small"
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>
        </>
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
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  childrenContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
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
  addChildrenButton: {
    backgroundColor: '#9b59b6',
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  childDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  emptyChildren: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    marginBottom: 16,
  },
  emptyButton: {
    minWidth: 150,
  }
});

export default KelompokDetailScreen;