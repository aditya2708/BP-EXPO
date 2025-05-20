import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Components
import QrCodeDisplay from '../../components/QrCodeDisplay';
import Button from '../../../../common/components/Button';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';

// API and Redux
import { adminShelterAnakApi } from '../../api/adminShelterAnakApi';
import { adminShelterKelompokApi } from '../../api/adminShelterKelompokApi';
import { 
  generateToken, 
  generateBatchTokens,
  getActiveToken,
  selectQrTokenLoading, 
  selectQrTokenError,
  selectStudentToken
} from '../../redux/qrTokenSlice';

const QrTokenGenerationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get activity data from route params
  const { id_aktivitas, activityName, activityDate } = route.params || {};
  
  // Redux state
  const tokenLoading = useSelector(selectQrTokenLoading);
  const tokenError = useSelector(selectQrTokenError);
  const studentTokens = useSelector(state => state.qrToken.studentTokens);
  
  // Local state
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validDays, setValidDays] = useState(30);
  
  // Kelompok state
  const [kelompokList, setKelompokList] = useState([]);
  const [selectedKelompokId, setSelectedKelompokId] = useState('');
  const [kelompokLoading, setKelompokLoading] = useState(false);
  const [kelompokError, setKelompokError] = useState(null);
  
  // Fetch kelompok list when component mounts
  useEffect(() => {
    fetchKelompokList();
  }, []);
  
  // Fetch students when selected kelompok changes
  useEffect(() => {
    if (selectedKelompokId) {
      fetchStudentsByKelompok(selectedKelompokId);
    } else {
      fetchAllStudents();
    }
  }, [selectedKelompokId]);
  
  // Fetch kelompok list from API
  const fetchKelompokList = async () => {
    try {
      setKelompokLoading(true);
      setKelompokError(null);
      
      const response = await adminShelterKelompokApi.getAllKelompok();
      
      if (response.data && response.data.data) {
        setKelompokList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching kelompok list:', error);
      setKelompokError('Failed to load groups. Please try again.');
    } finally {
      setKelompokLoading(false);
    }
  };
  
  // Fetch all students (when no kelompok is selected)
  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize an empty array for all students
      let allStudents = [];
      let currentPage = 1;
      let lastPage = 1;
      
      // First request to get initial data and pagination info
      const initialResponse = await adminShelterAnakApi.getAllAnak({ page: 1 });
      
      if (initialResponse.data && initialResponse.data.pagination) {
        lastPage = initialResponse.data.pagination.last_page;
        allStudents = [...initialResponse.data.data];
        
        // Fetch remaining pages if any
        if (lastPage > 1) {
          for (let page = 2; page <= lastPage; page++) {
            const pageResponse = await adminShelterAnakApi.getAllAnak({ page });
            if (pageResponse.data && pageResponse.data.data) {
              allStudents = [...allStudents, ...pageResponse.data.data];
            }
          }
        }
        
        // Filter for active students
        const activeStudents = allStudents.filter(
          student => student.status_validasi === 'aktif'
        );
        
        setStudents(activeStudents);
        
        // Check for existing tokens
        activeStudents.forEach(student => {
          dispatch(getActiveToken(student.id_anak));
        });
      }
    } catch (error) {
      console.error('Error fetching all students:', error);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch students by kelompok
const fetchStudentsByKelompok = async (kelompokId) => {
  try {
    setLoading(true);
    setError(null);
    
    console.log(`Fetching students for kelompok ID: ${kelompokId}`);
    const response = await adminShelterKelompokApi.getKelompokDetail(kelompokId);
    
    // Log the response to see what's being returned
    console.log('Kelompok detail response:', response.data);
    
    if (response.data && response.data.data && Array.isArray(response.data.data.anak)) {
      const kelompokStudents = response.data.data.anak;
      console.log(`Found ${kelompokStudents.length} students in kelompok`);
      
      setStudents(kelompokStudents);
      setSelectedStudents([]);
      
      // Check for existing tokens
      kelompokStudents.forEach(student => {
        dispatch(getActiveToken(student.id_anak));
      });
    } else {
      console.error('Invalid response structure:', response.data);
      setError('Students data structure is invalid. Please try a different group.');
    }
  } catch (error) {
    console.error('Error fetching students by kelompok:', error);
    setError(`Failed to load students: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
  
  // Handle kelompok selection change
  const handleKelompokChange = (kelompokId) => {
    setSelectedKelompokId(kelompokId);
  };
  
  // Filter students by search query
  const filteredStudents = students.filter(student => 
    (student.full_name || student.nick_name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  
  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  
  // Select all students
  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      // If all are selected, deselect all
      setSelectedStudents([]);
    } else {
      // Select all filtered students
      setSelectedStudents(filteredStudents.map(student => student.id_anak));
    }
  };
  
  // Generate token for a single student
  const handleGenerateToken = async (studentId) => {
    try {
      await dispatch(generateToken({ id_anak: studentId, validDays })).unwrap();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to generate token');
    }
  };
  
  // Generate tokens for selected students
  const handleGenerateBatchTokens = async () => {
    if (selectedStudents.length === 0) {
      Alert.alert('No Students Selected', 'Please select at least one student.');
      return;
    }
    
    try {
      await dispatch(generateBatchTokens({ 
        studentIds: selectedStudents, 
        validDays 
      })).unwrap();
      
      Alert.alert('Success', `Generated tokens for ${selectedStudents.length} students.`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to generate batch tokens');
    }
  };
  
  // Render a student item
  const renderStudentItem = ({ item }) => {
    const isSelected = selectedStudents.includes(item.id_anak);
    const token = studentTokens[item.id_anak];
    
    return (
      <View style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected
            ]}
            onPress={() => toggleStudentSelection(item.id_anak)}
          >
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
          
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {item.full_name || item.nick_name || 'Unknown'}
            </Text>
            <Text style={styles.studentId}>ID: {item.id_anak}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => handleGenerateToken(item.id_anak)}
            disabled={tokenLoading}
          >
            <Text style={styles.generateButtonText}>
              {token ? 'Regenerate' : 'Generate'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* QR Code Display */}
        {token && (
          <QrCodeDisplay
            token={token.token}
            studentName={item.full_name || item.nick_name}
            studentId={item.id_anak}
            size={180}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Activity Info */}
      {activityName && (
        <View style={styles.activityInfo}>
          <Text style={styles.activityName}>{activityName}</Text>
          {activityDate && (
            <Text style={styles.activityDate}>{activityDate}</Text>
          )}
        </View>
      )}
      
      {/* Error Message */}
      {(error || tokenError || kelompokError) && (
        <ErrorMessage
          message={error || tokenError || kelompokError}
          onRetry={error ? fetchAllStudents : (kelompokError ? fetchKelompokList : null)}
        />
      )}
      
      {/* Kelompok Selector */}
      <View style={styles.kelompokContainer}>
        <Text style={styles.kelompokLabel}>Filter by Group:</Text>
        {kelompokLoading ? (
          <View style={styles.pickerLoadingContainer}>
            <ActivityIndicator size="small" color="#3498db" />
            <Text style={styles.pickerLoadingText}>Loading groups...</Text>
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedKelompokId}
              onValueChange={handleKelompokChange}
              style={styles.picker}
              enabled={!loading && !kelompokLoading}
            >
              <Picker.Item label="All Students" value="" />
              {kelompokList.map(kelompok => (
                <Picker.Item 
                  key={kelompok.id_kelompok} 
                  label={kelompok.nama_kelompok}
                  value={kelompok.id_kelompok} 
                />
              ))}
            </Picker>
          </View>
        )}
      </View>
      
      {/* Search and Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#7f8c8d" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari Anak..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        
        <View style={styles.tokenControls}>
          <Text style={styles.validDaysLabel}>Valid untuk (hari):</Text>
          <TextInput
            style={styles.validDaysInput}
            value={validDays.toString()}
            onChangeText={(value) => setValidDays(parseInt(value) || 30)}
            keyboardType="number-pad"
          />
        </View>
      </View>
      
      {/* Actions Bar */}
      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={selectAllStudents}
        >
          <Text style={styles.selectAllText}>
            {selectedStudents.length === filteredStudents.length
              ? 'batal'
              : 'pilih semua'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.batchGenerateButton,
            selectedStudents.length === 0 && styles.disabledButton
          ]}
          onPress={handleGenerateBatchTokens}
          disabled={selectedStudents.length === 0 || tokenLoading}
        >
          <Ionicons name="qr-code" size={16} color="#fff" />
          <Text style={styles.batchGenerateText}>
            Generate {selectedStudents.length} QR Codes
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Students List */}
      {loading ? (
        <LoadingSpinner message="Loading students..." />
      ) : (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id_anak.toString()}
          contentContainerStyle={styles.studentsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={48} color="#bdc3c7" />
              <Text style={styles.emptyText}>No students found</Text>
              {selectedKelompokId && (
                <Text style={styles.emptySubtext}>Try selecting a different group</Text>
              )}
            </View>
          }
        />
      )}
      
      {/* Loading overlay */}
      {tokenLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Generating QR codes...</Text>
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
  activityInfo: {
    backgroundColor: '#3498db',
    padding: 16,
    alignItems: 'center',
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  activityDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  kelompokContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  kelompokLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  pickerLoadingText: {
    marginLeft: 8,
    color: '#7f8c8d',
  },
  controlsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  tokenControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  validDaysLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 8,
  },
  validDaysInput: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    width: 60,
    textAlign: 'center',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  selectAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  selectAllText: {
    color: '#3498db',
    fontWeight: '500',
  },
  batchGenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  batchGenerateText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  studentsList: {
    padding: 12,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#3498db',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  studentId: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  generateButton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3498db',
  },
});

export default QrTokenGenerationScreen;