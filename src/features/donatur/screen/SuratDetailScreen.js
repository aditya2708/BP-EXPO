import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import Button from '../../../common/components/Button';

// Import API
import { donaturSuratApi } from '../api/donaturSuratApi';

const { width } = Dimensions.get('window');

const SuratDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { childId, suratId, childName, onGoBack } = route.params;

  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({
      title: `Message - ${childName}`,
    });
  }, [navigation, childName]);

  // Fetch surat detail
  const fetchSuratDetail = async () => {
    try {
      setError(null);
      const response = await donaturSuratApi.getSuratDetail(childId, suratId);
      setSurat(response.data.data);
    } catch (err) {
      console.error('Error fetching surat detail:', err);
      setError('Failed to load message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratDetail();
  }, [childId, suratId]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle reply
  const handleReply = () => {
    navigation.navigate('SuratForm', {
      childId,
      childName,
      replyTo: surat,
      onSuccess: () => {
        if (onGoBack) onGoBack();
        navigation.goBack();
      }
    });
  };

  // Handle image view
  const handleViewImage = () => {
    if (surat.foto_url) {
      Alert.alert(
        'View Photo',
        'Photo will be displayed in full screen',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View', 
            onPress: () => {
              // Navigate to image viewer or show modal
              // For now, we'll just show an alert
              Alert.alert('Image Viewer', 'Image viewer not implemented yet');
            }
          }
        ]
      );
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading message..." />;
  }

  if (error || !surat) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error || "Message not found"}
          onRetry={fetchSuratDetail}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Message Header */}
        <View style={styles.messageHeader}>
          <View style={styles.headerInfo}>
            <Text style={styles.senderName}>
              Message from Shelter Admin
            </Text>
            <Text style={styles.messageDate}>
              {formatDate(surat.tanggal)}
            </Text>
          </View>
          
          {surat.foto_url && (
            <TouchableOpacity 
              style={styles.attachmentButton}
              onPress={handleViewImage}
            >
              <Ionicons name="image" size={24} color="#f39c12" />
            </TouchableOpacity>
          )}
        </View>

        {/* Message Content */}
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>
            {surat.pesan}
          </Text>
        </View>

        {/* Attached Photo */}
        {surat.foto_url && (
          <View style={styles.photoContainer}>
            <Text style={styles.photoLabel}>Attached Photo:</Text>
            <TouchableOpacity 
              style={styles.photoWrapper}
              onPress={handleViewImage}
            >
              <Image
                source={{ uri: surat.foto_url }}
                style={styles.attachedPhoto}
                resizeMode="cover"
              />
              <View style={styles.photoOverlay}>
                <Ionicons name="expand" size={24} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Child Info */}
        <View style={styles.childInfo}>
          <Text style={styles.childInfoLabel}>About:</Text>
          <Text style={styles.childInfoText}>
            This message is about {surat.anak?.full_name || childName}
          </Text>
        </View>
      </ScrollView>

      {/* Reply Button */}
      <View style={styles.replyContainer}>
        <Button
          title="Reply"
          onPress={handleReply}
          leftIcon={<Ionicons name="arrow-undo" size={20} color="white" />}
          type="primary"
          style={styles.replyButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  messageDate: {
    fontSize: 14,
    color: '#666666',
  },
  attachmentButton: {
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 20,
  },
  messageContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  photoContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  photoWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachedPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
  },
  childInfo: {
    backgroundColor: '#f0e6f5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  childInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9b59b6',
    marginBottom: 4,
  },
  childInfoText: {
    fontSize: 14,
    color: '#333333',
  },
  replyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  replyButton: {
    borderRadius: 25,
  },
});

export default SuratDetailScreen;