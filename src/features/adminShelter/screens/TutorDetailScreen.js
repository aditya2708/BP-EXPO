import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import Redux actions and selectors
import {
  fetchTutorDetail,
  deleteTutor,
  selectSelectedTutor,
  selectTutorStatus,
  selectTutorError
} from '../redux/tutorSlice';

const TutorDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  // Extract tutorId from route params
  const { tutorId } = route.params;

  // Selectors
  const tutor = useSelector(selectSelectedTutor);
  const status = useSelector(selectTutorStatus);
  const error = useSelector(selectTutorError);

  // Fetch tutor details on mount
  useEffect(() => {
    dispatch(fetchTutorDetail(tutorId));
  }, [dispatch, tutorId]);

  // Handle edit tutor
  const handleEditTutor = () => {
    navigation.navigate('TutorForm', { tutor });
  };

  // Handle delete tutor
  const handleDeleteTutor = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus tutor ${tutor.nama}?`,
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTutor(tutorId))
              .unwrap()
              .then(() => {
                Alert.alert('Berhasil', 'Tutor berhasil dihapus');
                navigation.goBack();
              })
              .catch((error) => {
                Alert.alert('Gagal', error || 'Gagal menghapus tutor');
              });
          }
        }
      ]
    );
  };

  // Open phone dialer
  const handleCallTutor = () => {
    if (tutor.no_hp) {
      Linking.openURL(`tel:${tutor.no_hp}`);
    }
  };

  // Open email app
  const handleEmailTutor = () => {
    if (tutor.email) {
      Linking.openURL(`mailto:${tutor.email}`);
    }
  };

  // Render loading state
  if (status === 'loading') {
    return <LoadingSpinner fullScreen message="Memuat detail tutor..." />;
  }

  // Render error state
  if (status === 'failed' || !tutor) {
    return (
      <ErrorMessage
        message={error || 'Gagal memuat detail tutor'}
        onRetry={() => dispatch(fetchTutorDetail(tutorId))}
      />
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Tutor Photo */}
      <View style={styles.photoContainer}>
        {tutor.foto_url ? (
          <Image
            source={{ uri: tutor.foto_url }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="person" size={60} color="#ffffff" />
          </View>
        )}
      </View>

      {/* Tutor Name */}
      <Text style={styles.nameText}>{tutor.nama}</Text>

      {/* Contact Actions */}
      <View style={styles.contactActions}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={handleCallTutor}
        >
          <Ionicons name="call" size={24} color="#3498db" />
          <Text style={styles.contactButtonText}>Telepon</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={handleEmailTutor}
        >
          <Ionicons name="mail" size={24} color="#3498db" />
          <Text style={styles.contactButtonText}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* Tutor Details */}
      <View style={styles.detailSection}>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{tutor.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="phone-portrait-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{tutor.no_hp}</Text>
        </View>
        {tutor.pendidikan && (
          <View style={styles.detailRow}>
            <Ionicons name="school-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{tutor.pendidikan}</Text>
          </View>
        )}
        {tutor.maple && (
          <View style={styles.detailRow}>
            <Ionicons name="book-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{tutor.maple}</Text>
          </View>
        )}
        {tutor.alamat && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{tutor.alamat}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Edit"
          onPress={handleEditTutor}
          type="outline"
          style={styles.editButton}
          leftIcon={<Ionicons name="create-outline" size={20} color="#3498db" />}
        />
        <Button
          title="Hapus"
          onPress={handleDeleteTutor}
          type="danger"
          style={styles.deleteButton}
          leftIcon={<Ionicons name="trash-outline" size={20} color="#ffffff" />}
        />
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 5,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  contactButtonText: {
    marginLeft: 8,
    color: '#3498db',
    fontWeight: '500',
  },
  detailSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default TutorDetailScreen;