import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView
} from 'react-native';

const CampaignTestScreen = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching campaigns from API...');
      const response = await fetch('https://berbagibahagia.org/api/getcampung', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      setCampaigns(result.data || []);
      
      Alert.alert(
        'Success!', 
        `Berhasil load ${result.data?.length || 0} campaign dari API`
      );
      
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message);
      Alert.alert('Error', `Gagal fetch data: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCampaigns();
  };

  const renderCampaignItem = (campaign) => (
    <View key={campaign.id_konten} style={styles.campaignItem}>
      <Image 
        source={{ uri: campaign.url_image }} 
        style={styles.campaignImage}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
      <View style={styles.campaignInfo}>
        <Text style={styles.campaignTitle} numberOfLines={2}>
          {campaign.title}
        </Text>
        <Text style={styles.campaignCategory}>
          {campaign.kategori} - {campaign.nama_kota}
        </Text>
        <Text style={styles.campaignEndDate}>
          Berakhir: {campaign.end_date}
        </Text>
        <Text style={styles.campaignUrl} numberOfLines={1}>
          Link: {campaign.url_link}
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Campaign API</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={fetchCampaigns}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Loading...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && campaigns.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e74c3c" />
            <Text style={styles.loadingText}>Loading campaigns...</Text>
          </View>
        ) : (
          <View style={styles.campaignsList}>
            <Text style={styles.statsText}>
              Total: {campaigns.length} campaigns
            </Text>
            {campaigns.map(renderCampaignItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  campaignsList: {
    padding: 16,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  campaignItem: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  campaignImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  campaignInfo: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  campaignCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  campaignEndDate: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 4,
  },
  campaignUrl: {
    fontSize: 12,
    color: '#0066cc',
    fontStyle: 'italic',
  },
});

export default CampaignTestScreen;