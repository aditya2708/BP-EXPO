import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Import components
import Button from '../../../common/components/Button';
import TextInput from '../../../common/components/TextInput';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import hooks and API
import { useAuth } from '../../../common/hooks/useAuth';
import { donaturApi } from '../api/donaturApi';

const DonaturProfileScreen = () => {
  const navigation = useNavigation();
  const { user, profile, refreshUser, logout } = useAuth();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    nama_lengkap: '',
    alamat: '',
    no_hp: '',
    email: '',
    bank: null,
    no_rekening: '',
    diperuntukan: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize profile data from Redux state
  useEffect(() => {
    // if (profile) {
    //   setProfileData({
    //     nama_lengkap: profile.nama_lengkap || '',
    //     alamat: profile.alamat || '',
    //     no_hp: profile.no_hp || '',
    //     email: user?.email || '',
    //     bank: profile.bank || null,
    //     no_rekening: profile.no_rekening || '',
    //     diperuntukan: profile.diperuntukan || '',
    //   });

    //   if (profile.foto) {
    //     setProfileImage(`https://berbagipendidikan.org/storage/Donatur/${profile.id_donatur}/${profile.foto}`);
    //   }
    // }
  }, [profile, user]);

  // Handle profile image selection
  const handleSelectImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access camera roll is required');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      
      // Add profile data
      formData.append('nama_lengkap', profileData.nama_lengkap);
      formData.append('alamat', profileData.alamat);
      formData.append('no_hp', profileData.no_hp);
      formData.append('no_rekening', profileData.no_rekening);
      formData.append('diperuntukan', profileData.diperuntukan);

      // Add profile image if selected
      if (profileImage && !profileImage.startsWith('http')) {
        const filename = profileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('foto', {
          uri: profileImage,
          name: filename,
          type,
        });
      }

      // Update profile
      await donaturApi.updateProfile(formData);
      
      // Refresh user data
      await refreshUser();
      
      // Exit edit mode
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={50} color="#ffffff" />
            </View>
          )}
          
          {isEditing && (
            <TouchableOpacity 
              style={styles.editImageButton}
              onPress={handleSelectImage}
            >
              <Ionicons name="camera" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.profileName}>
          {profileData.nama_lengkap || 'Donatur'}
        </Text>
        <Text style={styles.profileRole}>Donatur</Text>
      </View>

      {/* Profile Content */}
      <View style={styles.profileContent}>
        {/* Edit/Save Button */}
        <View style={styles.editButtonContainer}>
          {!isEditing ? (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              leftIcon={<Ionicons name="create-outline" size={20} color="white" />}
              type="primary"
            />
          ) : (
            <View style={styles.editButtonsRow}>
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                type="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Save"
                onPress={handleUpdateProfile}
                loading={loading}
                disabled={loading}
                type="primary"
                style={styles.saveButton}
              />
            </View>
          )}
        </View>

        {/* Profile Fields */}
        <View style={styles.profileFields}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                value={profileData.nama_lengkap}
                onChangeText={(value) => handleChange('nama_lengkap', value)}
                placeholder="Enter your full name"
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.nama_lengkap || '-'}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>
              {profileData.email || '-'}
            </Text>
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                value={profileData.no_hp}
                onChangeText={(value) => handleChange('no_hp', value)}
                placeholder="Enter your phone number"
                inputProps={{
                  keyboardType: 'phone-pad',
                }}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.no_hp || '-'}
              </Text>
            )}
          </View>

          {/* Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Address</Text>
            {isEditing ? (
              <TextInput
                value={profileData.alamat}
                onChangeText={(value) => handleChange('alamat', value)}
                placeholder="Enter your address"
                multiline
                inputProps={{
                  numberOfLines: 3,
                }}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.alamat || '-'}
              </Text>
            )}
          </View>

          {/* Donation Information */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Donation Information</Text>
          
          {/* Bank */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Bank</Text>
            <Text style={styles.fieldValue}>
              {profileData.bank?.nama_bank || '-'}
            </Text>
          </View>

          {/* Account Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Account Number</Text>
            {isEditing ? (
              <TextInput
                value={profileData.no_rekening}
                onChangeText={(value) => handleChange('no_rekening', value)}
                placeholder="Enter your account number"
                inputProps={{
                  keyboardType: 'number-pad',
                }}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.no_rekening || '-'}
              </Text>
            )}
          </View>

          {/* Donation Purpose */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Donation Purpose</Text>
            {isEditing ? (
              <TextInput
                value={profileData.diperuntukan}
                onChangeText={(value) => handleChange('diperuntukan', value)}
                placeholder="Enter donation purpose"
                multiline
                inputProps={{
                  numberOfLines: 3,
                }}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.diperuntukan || '-'}
              </Text>
            )}
          </View>
        </View>

        {/* Sponsored Children */}
        {profile?.anak && profile.anak.length > 0 && (
          <View style={styles.sponsoredChildrenContainer}>
            <Text style={styles.sectionTitle}>Sponsored Children</Text>
            <View style={styles.childrenList}>
              {profile.anak.map((child, index) => (
                <View key={index} style={styles.childItem}>
                  {child.foto ? (
                    <Image
                      source={{ uri: `https://berbagipendidikan.org/storage/Children/${child.id_anak}/${child.foto}` }}
                      style={styles.childImage}
                    />
                  ) : (
                    <View style={styles.childImagePlaceholder}>
                      <Ionicons name="person" size={20} color="#ffffff" />
                    </View>
                  )}
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.nama_lengkap}</Text>
                    <Text style={styles.childDetails}>
                      {child.umur ? `${child.umur} years old` : 'Age unknown'}
                    </Text>
                  </View>
                </View>
              ))}
              <Button
                title="View All Children"
                type="outline"
                onPress={() => navigation.navigate('MySponsoredChildren')}
                style={styles.viewAllButton}
              />
            </View>
          </View>
        )}

        {/* Settings and Logout */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#9b59b6" />
            <Text style={styles.settingsText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('DonationHistory')}
          >
            <Ionicons name="cash-outline" size={24} color="#9b59b6" />
            <Text style={styles.settingsText}>Donation History</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
            <Text style={[styles.settingsText, { color: '#e74c3c' }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Updating profile..." />
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
  profileHeader: {
    backgroundColor: '#9b59b6',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 80,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8e44ad',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8e44ad',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileRole: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  profileContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  editButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  editButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 10,
  },
  saveButton: {
    minWidth: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  profileFields: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sponsoredChildrenContainer: {
    marginBottom: 20,
  },
  childrenList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  childImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  childImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  },
  viewAllButton: {
    marginTop: 8,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default DonaturProfileScreen;