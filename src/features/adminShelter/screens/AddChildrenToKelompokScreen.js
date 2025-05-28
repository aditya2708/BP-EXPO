import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API and hooks
import { adminShelterKelompokApi } from '../api/adminShelterKelompokApi';
import { useAuth } from '../../../common/hooks/useAuth';

const AddChildrenToKelompokScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = useAuth();
  
  // Get params
  const { kelompokId, kelompokName, shelterId } = route.params || {};
  
  // State
  const [availableChildren, setAvailableChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch available children
  const fetchAvailableChildren = async () => {
    try {
      setError(null);
      
      const response = await adminShelterKelompokApi.getAvailableChildren(
        shelterId || profile?.shelter?.id_shelter
      );
      
      if (response.data.success) {
        const children = response.data.data || [];
        setAvailableChildren(children);
        setFilteredChildren(children);
      } else {
        setError(response.data.message || 'Failed to load available children');
      }
    } catch (err) {
      console.error('Error fetching available children:', err);
      setError('Failed to load available children. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    
  };
  
  // Initial load
  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Add to ${kelompokName || 'Group'}`
    });
    fetchAvailableChildren();
  }, []);
  
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChildren(availableChildren);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = availableChildren.filter(child => 
        (child.full_name && child.full_name.toLowerCase().includes(query)) ||
        (child.nick_name && child.nick_name.toLowerCase().includes(query)) ||
        (child.nik_anak && child.nik_anak.includes(query))
      );
      setFilteredChildren(filtered);
    }
  }, [searchQuery, availableChildren]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setSelectedChildren([]);
    fetchAvailableChildren();
  };
  
  // Toggle child selection
  const toggleChildSelection = (childId) => {
    setSelectedChildren(prev => {
      if (prev.includes(childId)) {
        return prev.filter(id => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };
  
  // Select all filtered children
  const selectAll = () => {
    const allChildIds = filteredChildren.map(child => child.id_anak);
    setSelectedChildren(allChildIds);
  };
  
  // Deselect all
  const deselectAll = () => {
    setSelectedChildren([]);
  };
  
  // Submit selected children
  const handleSubmit = async () => {
    if (selectedChildren.length === 0) {
      Alert.alert('No Selection', 'Please select at least one child to add.');
      return;
    }
    
    Alert.alert(
      'Confirm',
      `Add ${selectedChildren.length} child${selectedChildren.length > 1 ? 'ren' : ''} to the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: async () => {
            setSubmitting(true);
            
            try {
              // Add children one by one (API limitation)
              const results = [];
              const errors = [];
              
              for (const childId of selectedChildren) {
                try {
                  const response = await adminShelterKelompokApi.addChildToGroup(
                    kelompokId,
                    { id_anak: childId }
                  );
                  results.push(response);
                } catch (err) {
                  errors.push({ childId, error: err });
                  console.error(`Error adding child ${childId}:`, err);
                }
              }
              
              // Show result
              if (errors.length === 0) {
                Alert.alert(
                  'Success',
                  `${results.length} child${results.length > 1 ? 'ren' : ''} added successfully`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        navigation.goBack();
                        // Trigger refresh in parent screen
                        if (route.params?.onRefresh) {
                          route.params.onRefresh();
                        }
                      }
                    }
                  ]
                );
              } else {
                Alert.alert(
                  'Partial Success',
                  `Added ${results.length} child${results.length > 1 ? 'ren' : ''}, but ${errors.length} failed.`,
                  [{ text: 'OK' }]
                );
              }
            } catch (err) {
              console.error('Error submitting children:', err);
              Alert.alert('Error', 'Failed to add children. Please try again.');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };
  
  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    
    let dob;
    try {
      if (birthDate.match(/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/)) {
        const parts = birthDate.split(/[-/]/);
        dob = new Date(parts[2], parts[1] - 1, parts[0]);
      } else if (birthDate.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/)) {
        dob = new Date(birthDate);
      } else {
        dob = new Date(birthDate);
      }
      
      if (isNaN(dob.getTime())) return '';
      
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
  
  // Render child item
  const renderChildItem = ({ item: child }) => {
    const isSelected = selectedChildren.includes(child.id_anak);
    
    return (
      <TouchableOpacity
        style={[styles.childItem, isSelected && styles.childItemSelected]}
        onPress={() => toggleChildSelection(child.id_anak)}
        activeOpacity={0.7}
      >
        {/* Selection checkbox */}
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
        </View>
        
        {/* Child image */}
        <View style={styles.childImageContainer}>
          {child.foto_url ? (
            <Image source={{ uri: child.foto_url }} style={styles.childImage} />
          ) : (
            <View style={styles.childImagePlaceholder}>
              <Ionicons 
                name={child.jenis_kelamin === 'L' ? 'male' : 'female'} 
                size={24} 
                color="#666" 
              />
            </View>
          )}
        </View>
        
        {/* Child info */}
        <View style={styles.childInfo}>
          <Text style={styles.childName} numberOfLines={1}>
            {child.full_name || child.nick_name}
          </Text>
          <Text style={styles.childDetails}>
            {child.jenis_kelamin === 'L' ? 'Male' : 'Female'}
            {child.tanggal_lahir && ` • ${calculateAge(child.tanggal_lahir)}`}
          </Text>
          {child.nik_anak && (
            <Text style={styles.childNik}>NIK: {child.nik_anak}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={48} color="#bdc3c7" />
      <Text style={styles.emptyText}>
        {searchQuery.trim() !== '' 
          ? 'No children found matching your search'
          : 'No available children without group'}
      </Text>
    </View>
  );
  
  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading available children..." />;
  }
  
  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchAvailableChildren}
        />
      )}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or NIK..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Selection Info Bar */}
      {filteredChildren.length > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {selectedChildren.length} of {filteredChildren.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={selectAll}
              disabled={selectedChildren.length === filteredChildren.length}
            >
              <Text style={[
                styles.selectionButtonText,
                selectedChildren.length === filteredChildren.length && styles.disabledText
              ]}>
                Select All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={deselectAll}
              disabled={selectedChildren.length === 0}
            >
              <Text style={[
                styles.selectionButtonText,
                selectedChildren.length === 0 && styles.disabledText
              ]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Children List */}
      <FlatList
        data={filteredChildren}
        renderItem={renderChildItem}
        keyExtractor={(item) => item.id_anak.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9b59b6']}
          />
        }
      />
      
      {/* Submit Button */}
      {selectedChildren.length > 0 && (
        <View style={styles.submitContainer}>
          <Button
            title={`Add ${selectedChildren.length} Child${selectedChildren.length > 1 ? 'ren' : ''}`}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            type="primary"
            size="large"
            fullWidth
            style={styles.submitButton}
          />
        </View>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectionActions: {
    flexDirection: 'row',
  },
  selectionButton: {
    marginLeft: 16,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9b59b6',
  },
  disabledText: {
    color: '#ccc',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childItemSelected: {
    backgroundColor: '#f2e5ff',
    borderWidth: 1,
    borderColor: '#9b59b6',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#9b59b6',
  },
  childImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 12,
  },
  childImage: {
    width: '100%',
    height: '100%',
  },
  childImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 14,
    color: '#666',
  },
  childNik: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  submitButton: {
    backgroundColor: '#9b59b6',
  },
});

export default AddChildrenToKelompokScreen;