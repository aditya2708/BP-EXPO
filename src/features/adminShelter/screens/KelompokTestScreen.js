// src/features/adminShelter/screens/KelompokTestScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { adminShelterKelompokApi } from '../api/adminShelterKelompokApi';

const KelompokTestScreen = () => {
  const [kelompokList, setKelompokList] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch kelompok list
        const kelompokResponse = await adminShelterKelompokApi.getAllKelompok();
        setKelompokList(kelompokResponse.data.data || []);
        
        // Fetch levels
        const levelsResponse = await adminShelterKelompokApi.getLevels();
        setLevels(levelsResponse.data.data || []);
        
      } catch (err) {
        console.error('Error fetching kelompok data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Kelompok API Test</Text>
      
      {/* Display Levels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Levels:</Text>
        {levels.length > 0 ? (
          levels.map((level) => (
            <View key={level.id_level_anak_binaan} style={styles.item}>
              <Text>ID: {level.id_level_anak_binaan}</Text>
              <Text>Name: {level.nama_level_binaan}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No levels found</Text>
        )}
      </View>
      
      {/* Display Kelompok */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kelompok List:</Text>
        {kelompokList.length > 0 ? (
          kelompokList.map((kelompok) => (
            <View key={kelompok.id_kelompok} style={styles.item}>
              <Text style={styles.itemTitle}>{kelompok.nama_kelompok}</Text>
              <Text>Level: {kelompok.level_anak_binaan?.nama_level_binaan || 'None'}</Text>
              <Text>Children: {kelompok.anak_count || 0}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No kelompok found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default KelompokTestScreen;