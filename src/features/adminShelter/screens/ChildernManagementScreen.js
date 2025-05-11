import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { adminShelterApi } from '../api/adminShelterApi';

const ChildrenManagementScreen = () => {
  const navigation = useNavigation();
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch children data
  const fetchChildren = async () => {
    try {
      setError(null);
      const response = await adminShelterApi.getChildren();
      const data = response.data.data || [];
      setChildren(data);
      setFilteredChildren(data);
    } catch (err) {
      console.error('Error fetching children:', err);
      setError('Failed to load children data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchChildren();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchChildren();
  };

  // Filter children based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChildren(children);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = children.filter(child => 
        child.nama_lengkap.toLowerCase().includes(query)
      );
      setFilteredChildren(filtered);
    }
  }, [searchQuery, children]);

  // Navigate to child detail screen
  const handleViewChild = (childId) => {
    navigation.navigate('ChildDetail', { id: childId });
  };

  // Navigate to add new child screen
  const handleAddChild = () => {
    navigation.navigate('ChildDetail', { isNew: true });
  };

  // Render child item
  const renderChildItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.childCard}
      onPress={() => handleViewChild(item.id_anak)}
    >
      <View style={styles.childImageContainer}>
        {item.foto ? (
          <Image
            source={{ uri: `https://berbagipendidikan.org/storage/Children/${item.id_anak}/${item.foto}` }}
            style={styles.childImage}
          />
        ) : (
          <View style={styles.childImagePlaceholder}>
            <Ionicons name="person" size={36} color="#ffffff" />
          </View>
        )}
      </View>
      
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{item.nama_lengkap}</Text>
        <Text style={styles.childDetails}>
          {item.umur ? `${item.umur} years old` : 'Age unknown'}
        </Text>
        <Text style={styles.childDetails}>
          {item.jenis_kelamin === 'L' ? 'Male' : item.jenis_kelamin === 'P' ? 'Female' : 'Gender unknown'}
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={24} color="#cccccc" />
    </TouchableOpacity>
  );

  // Loading state
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading children data..." />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchChildren}
        />
      )}
      
      {/* Search and Add Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search children..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        
        <Button
          leftIcon={<Ionicons name="add" size={20} color="#ffffff" />}
          type="primary"
          onPress={handleAddChild}
          style={styles.addButton}
        />
      </View>
      
      {/* Children List */}
      {filteredChildren.length > 0 ? (
        <FlatList
          data={filteredChildren}
          renderItem={renderChildItem}
          keyExtractor={(item) => item.id_anak.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          {searchQuery.trim() !== '' ? (
            <>
              <Ionicons name="search" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>No children found with "{searchQuery}"</Text>
              <Button 
                title="Clear Search" 
                onPress={() => setSearchQuery('')} 
                type="outline"
                style={styles.emptyButton}
              />
            </>
          ) : (
            <>
              <Ionicons name="people" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>No children registered yet</Text>
              <Button 
                title="Add First Child" 
                onPress={handleAddChild} 
                type="primary"
                style={styles.emptyButton}
              />
            </>
          )}
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
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childImageContainer: {
    marginRight: 16,
  },
  childImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  childImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 180,
  },
});

export default ChildrenManagementScreen;