import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Import components
import TextInput from '../../../common/components/TextInput';
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';

// Import API
import { donaturSuratApi } from '../api/donaturSuratApi';

const SuratFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { childId, childName, replyTo, onSuccess } = route.params;

  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({
      title: replyTo ? `Reply - ${childName}` : `New Message - ${childName}`,
    });
  }, [navigation, childName, replyTo]);

 // Initialize reply message   
useEffect(() => {     
  if (replyTo) {       
    const replyPrefix = `Replying to: "${replyTo.pesan.substring(0, 50)}${replyTo.pesan.length > 50 ? '...' : ''}"\n\n`;       
    setMessage(replyPrefix);     
  }   
}, [replyTo]);

  // Handle image selection
  const handleSelectImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera roll permission is required to attach photos',
          [{ text: 'OK' }]
        );
        return;
      }

      // Show image picker options
      Alert.alert(
        'Select Photo',
        'Choose a photo to attach to your message',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Camera Roll', onPress: () => openImagePicker() },
          { text: 'Camera', onPress: () => openCamera() },
        ]
      );
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  // Open image picker
  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Open camera
  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove the attached photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setSelectedImage(null) },
      ]
    );
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Message Required', 'Please enter a message');
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert('Message Too Short', 'Please enter at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('pesan', message.trim());

      // Add image if selected
      if (selectedImage) {
        const filename = selectedImage.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('foto', {
          uri: selectedImage.uri,
          name: filename,
          type,
        });
      }

      await donaturSuratApi.createSurat(childId, formData);

      Alert.alert(
        'Success',
        'Your message has been sent successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) onSuccess();
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        'Failed to send message. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (message.trim() || selectedImage) {
      Alert.alert(
        'Discard Message',
        'Are you sure you want to discard this message?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.recipientLabel}>To:</Text>
          <Text style={styles.recipientText}>Shelter Admin</Text>
          <Text style={styles.subjectLabel}>About:</Text>
          <Text style={styles.subjectText}>{childName}</Text>
        </View>

        {/* Reply Context */}
        {replyTo && (
          <View style={styles.replyContext}>
            <Text style={styles.replyLabel}>Replying to:</Text>
            <Text style={styles.replyText} numberOfLines={3}>
              {replyTo.pesan}
            </Text>
          </View>
        )}

        {/* Message Input */}
        <View style={styles.messageContainer}>
          <Text style={styles.inputLabel}>Message *</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message here..."
            multiline
            inputProps={{
              numberOfLines: 8,
              textAlignVertical: 'top',
              style: styles.messageInput,
            }}
            style={styles.messageInputContainer}
          />
          <Text style={styles.characterCount}>
            {message.length}/1000 characters
          </Text>
        </View>

        {/* Photo Attachment */}
        <View style={styles.attachmentContainer}>
          <Text style={styles.attachmentLabel}>Photo Attachment (Optional)</Text>
          
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.selectedImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <Ionicons name="close-circle" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.selectImageButton}
              onPress={handleSelectImage}
            >
              <Ionicons name="camera" size={24} color="#9b59b6" />
              <Text style={styles.selectImageText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Guidelines */}
        <View style={styles.guidelines}>
          <Text style={styles.guidelinesTitle}>Message Guidelines:</Text>
          <Text style={styles.guidelineItem}>• Be respectful and polite</Text>
          <Text style={styles.guidelineItem}>• Keep messages relevant to your sponsored child</Text>
          <Text style={styles.guidelineItem}>• Avoid sharing personal contact information</Text>
          <Text style={styles.guidelineItem}>• Response time may vary (1-3 business days)</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          type="outline"
          style={styles.cancelButton}
          disabled={loading}
        />
        <Button
          title="Send Message"
          onPress={handleSendMessage}
          type="primary"
          style={styles.sendButton}
          loading={loading}
          disabled={loading || !message.trim()}
          leftIcon={<Ionicons name="send" size={20} color="white" />}
        />
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Sending message..." />
        </View>
      )}
    </KeyboardAvoidingView>
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
  headerInfo: {
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
  recipientLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  recipientText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  subjectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  subjectText: {
    fontSize: 16,
    color: '#333333',
  },
  replyContext: {
    backgroundColor: '#f0e6f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9b59b6',
    marginBottom: 8,
  },
  replyText: {
    fontSize: 14,
    color: '#333333',
    fontStyle: 'italic',
  },
  messageContainer: {
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  messageInputContainer: {
    marginBottom: 8,
  },
  messageInput: {
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  attachmentContainer: {
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
  attachmentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  selectImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#9b59b6',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  selectImageText: {
    fontSize: 16,
    color: '#9b59b6',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  guidelines: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f39c12',
    marginBottom: 8,
  },
  guidelineItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    flex: 2,
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default SuratFormScreen;