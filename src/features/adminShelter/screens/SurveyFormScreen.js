import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Import components
import Button from '../../../common/components/Button';
import TextInput from '../../../common/components/TextInput';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { adminShelterSurveyApi } from '../api/adminShelterSurveyApi';

const SurveyFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get data from route params
  const { id_keluarga, surveyData, keluarga } = route.params || {};
  const isEditMode = !!surveyData;
  
  // State for stepped form
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    pendidikan_kepala_keluarga: '',
    jumlah_tanggungan: '',
    pekerjaan_kepala_keluarga: '',
    penghasilan: '',
    
    // Financial
    kepemilikan_tabungan: '',
    jumlah_makan: '',
    biaya_pendidikan_perbulan: '',
    bantuan_lembaga_formal_lain: '',
    bantuan_lembaga_formal_lain_sebesar: '',
    
    // Assets
    kepemilikan_tanah: '',
    kepemilikan_rumah: '',
    kondisi_rumah_dinding: '',
    kondisi_rumah_lantai: '',
    kepemilikan_kendaraan: '',
    kepemilikan_elektronik: '',
    
    // Health & Sanitation
    sumber_air_bersih: '',
    jamban_limbah: '',
    tempat_sampah: '',
    perokok: '',
    konsumen_miras: '',
    persediaan_p3k: '',
    makan_buah_sayur: '',
    
    // Religious & Social
    solat_lima_waktu: '',
    membaca_alquran: '',
    majelis_taklim: '',
    membaca_koran: '',
    pengurus_organisasi: '',
    pengurus_organisasi_sebagai: '',
    
    // Result & Notes
    status_anak: '',
    kondisi_penerima_manfaat: '',
    petugas_survey: '',
    hasil_survey: '',
    keterangan_hasil: ''
  });
  
  const [loading, setLoading] = useState(isEditMode); // Load if in edit mode
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form steps
  const steps = [
    { id: 'basic', title: 'Basic Information' },
    { id: 'financial', title: 'Financial' },
    { id: 'assets', title: 'Assets & Home' },
    { id: 'health', title: 'Health & Sanitation' },
    { id: 'religious', title: 'Religious & Social' },
    { id: 'result', title: 'Result & Notes' }
  ];
  
  // Load existing survey data
  useEffect(() => {
    if (isEditMode && surveyData) {
      setFormData({
        ...formData,
        ...surveyData
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [surveyData]);
  
  // Set screen title
  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditMode ? 'Edit Survey' : 'Create Survey'
    });
  }, [navigation, isEditMode]);
  
  // Handle form data change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If toggling organization membership, reset position if "No"
    if (field === 'pengurus_organisasi' && value === 'Tidak') {
      setFormData(prev => ({ ...prev, pengurus_organisasi_sebagai: '' }));
    }
    
    // If toggling other support, reset amount if "No"
    if (field === 'bantuan_lembaga_formal_lain' && value === 'Tidak') {
      setFormData(prev => ({ ...prev, bantuan_lembaga_formal_lain_sebesar: '' }));
    }
  };
  
  // Go to next step
  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
    } else {
      // Last step, submit the form
      handleSubmit();
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Client-side validation 
      if (!formData.pendidikan_kepala_keluarga || 
          !formData.jumlah_tanggungan || 
          !formData.pekerjaan_kepala_keluarga || 
          !formData.penghasilan ||
          !formData.status_anak) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        setSubmitting(false);
        return;
      }
      
      const response = await adminShelterSurveyApi.saveSurvey(id_keluarga, formData);
      
      if (response.data.success) {
        Alert.alert(
          'Success',
          isEditMode ? 'Survey has been updated' : 'Survey has been saved',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        setError(response.data.message || 'Failed to save survey');
      }
    } catch (err) {
      console.error('Error submitting survey:', err);
      
      // Handle validation errors from the server
      if (err.response?.status === 422) {
        const validationErrors = err.response.data?.errors || {};
        const errorMessage = Object.values(validationErrors)
          .flat()
          .join('\n');
        
        setError(`Validation Error:\n${errorMessage || err.response.data?.message}`);
      } else {
        setError(err.response?.data?.message || 'Failed to save survey');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Cancel and go back
  const handleCancel = () => {
    Alert.alert(
      'Confirm Cancel',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() }
      ]
    );
  };
  
  // Render form step
  const renderFormStep = () => {
    const currentStepId = steps[currentStep]?.id;
    
    switch (currentStepId) {
      case 'basic':
        return (
          <View style={styles.stepContainer}>
            {/* Family Info Summary */}
            <View style={styles.familyInfoCard}>
              <Text style={styles.familyName}>{keluarga?.kepala_keluarga || 'Family'}</Text>
              <Text style={styles.familyDetail}>KK: {keluarga?.no_kk || '-'}</Text>
              <Text style={styles.familyDetail}>Status: {keluarga?.status_ortu || '-'}</Text>
            </View>
            
            {/* Head's Education */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Head of Family Education Level *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.pendidikan_kepala_keluarga}
                  onValueChange={(value) => handleChange('pendidikan_kepala_keluarga', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Education Level --" value="" />
                  <Picker.Item label="Tidak Sekolah" value="Tidak Sekolah" />
                  <Picker.Item label="Sekolah Dasar" value="Sekolah Dasar" />
                  <Picker.Item label="SMP/MTS/SEDERAJAT" value="SMP/MTS/SEDERAJAT" />
                  <Picker.Item label="SMK/SMA/MA/SEDERAJAT" value="SMK/SMA/MA/SEDERAJAT" />
                  <Picker.Item label="DIPLOMA I" value="DIPLOMA I" />
                  <Picker.Item label="DIPLOMA II" value="DIPLOMA II" />
                  <Picker.Item label="DIPLOMA III" value="DIPLOMA III" />
                  <Picker.Item label="STRATA-1" value="STRATA-1" />
                  <Picker.Item label="STRATA-2" value="STRATA-2" />
                  <Picker.Item label="STRATA-3" value="STRATA-3" />
                  <Picker.Item label="LAINNYA" value="LAINNYA" />
                </Picker>
              </View>
            </View>
            
            {/* Number of Dependents */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Number of Dependents *</Text>
              <TextInput
                value={formData.jumlah_tanggungan?.toString()}
                onChangeText={(value) => handleChange('jumlah_tanggungan', value)}
                placeholder="Number of dependents"
                keyboardType="numeric"
              />
            </View>
            
            {/* Occupation */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Head of Family Occupation *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.pekerjaan_kepala_keluarga}
                  onValueChange={(value) => handleChange('pekerjaan_kepala_keluarga', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Occupation --" value="" />
                  <Picker.Item label="Petani" value="Petani" />
                  <Picker.Item label="Nelayan" value="Nelayan" />
                  <Picker.Item label="Peternak" value="Peternak" />
                  <Picker.Item label="PNS NON Dosen/Guru" value="PNS NON Dosen/Guru" />
                  <Picker.Item label="Guru PNS" value="Guru PNS" />
                  <Picker.Item label="Guru Non PNS" value="Guru Non PNS" />
                  <Picker.Item label="Karyawan Swasta" value="Karyawan Swasta" />
                  <Picker.Item label="Buruh" value="Buruh" />
                  <Picker.Item label="Wiraswasta" value="Wiraswasta" />
                  <Picker.Item label="Wirausaha" value="Wirausaha" />
                  <Picker.Item label="Pedagang Kecil" value="Pedagang Kecil" />
                  <Picker.Item label="Pedagang Besar" value="Pedagang Besar" />
                  <Picker.Item label="Pensiunan" value="Pensiunan" />
                  <Picker.Item label="Tidak Bekerja" value="Tidak Bekerja" />
                  <Picker.Item label="Sudah Meninggal" value="Sudah Meninggal" />
                  <Picker.Item label="Lainnya" value="Lainnya" />
                </Picker>
              </View>
            </View>
            
            {/* Income */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Monthly Income *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.penghasilan}
                  onValueChange={(value) => handleChange('penghasilan', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Income Range --" value="" />
                  <Picker.Item label="Below Rp 500,000" value="dibawah_500k" />
                  <Picker.Item label="Rp 500,000 - Rp 1,500,000" value="500k_1500k" />
                  <Picker.Item label="Rp 1,500,000 - Rp 2,500,000" value="1500k_2500k" />
                  <Picker.Item label="Rp 2,500,000 - Rp 3,500,000" value="2500k_3500k" />
                  <Picker.Item label="Rp 3,500,000 - Rp 5,000,000" value="3500k_5000k" />
                  <Picker.Item label="Rp 5,000,000 - Rp 7,000,000" value="5000k_7000k" />
                  <Picker.Item label="Rp 7,000,000 - Rp 10,000,000" value="7000k_10000k" />
                  <Picker.Item label="Above Rp 10,000,000" value="diatas_10000k" />
                </Picker>
              </View>
            </View>
            
            {/* Child Status */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Child Status *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.status_anak}
                  onValueChange={(value) => handleChange('status_anak', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Status --" value="" />
                  <Picker.Item label="Yatim" value="Yatim" />
                  <Picker.Item label="Dhuafa" value="Dhuafa" />
                  <Picker.Item label="Non Dhuafa" value="Non Dhuafa" />
                </Picker>
              </View>
            </View>
          </View>
        );
      
      case 'financial':
        return (
          <View style={styles.stepContainer}>
            {/* Savings */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Does the family have savings? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.kepemilikan_tabungan === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('kepemilikan_tabungan', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.kepemilikan_tabungan === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.kepemilikan_tabungan === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('kepemilikan_tabungan', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.kepemilikan_tabungan === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Three Meals a Day */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Does the family eat three meals a day? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.jumlah_makan === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('jumlah_makan', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.jumlah_makan === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.jumlah_makan === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('jumlah_makan', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.jumlah_makan === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Education Cost */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Monthly Education Cost *</Text>
              <TextInput
                value={formData.biaya_pendidikan_perbulan}
                onChangeText={(value) => handleChange('biaya_pendidikan_perbulan', value)}
                placeholder="Enter monthly education cost"
              />
            </View>
            
            {/* Other Support */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Does the family receive support from other institutions? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.bantuan_lembaga_formal_lain === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('bantuan_lembaga_formal_lain', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.bantuan_lembaga_formal_lain === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.bantuan_lembaga_formal_lain === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('bantuan_lembaga_formal_lain', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.bantuan_lembaga_formal_lain === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Support Amount (conditional) */}
            {formData.bantuan_lembaga_formal_lain === 'Ya' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Amount of Support *</Text>
                <TextInput
                  value={formData.bantuan_lembaga_formal_lain_sebesar}
                  onChangeText={(value) => handleChange('bantuan_lembaga_formal_lain_sebesar', value)}
                  placeholder="Enter amount of support"
                />
              </View>
            )}
          </View>
        );
      
      case 'assets':
        return (
          <View style={styles.stepContainer}>
            {/* Land Ownership */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Does the family own land? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.kepemilikan_tanah === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('kepemilikan_tanah', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.kepemilikan_tanah === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.kepemilikan_tanah === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('kepemilikan_tanah', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.kepemilikan_tanah === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* House Ownership */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>House Ownership Status *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.kepemilikan_rumah}
                  onValueChange={(value) => handleChange('kepemilikan_rumah', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Status --" value="" />
                  <Picker.Item label="Hak Milik" value="Hak Milik" />
                  <Picker.Item label="Sewa" value="Sewa" />
                  <Picker.Item label="Orang Tua" value="Orang Tua" />
                  <Picker.Item label="Saudara" value="Saudara" />
                  <Picker.Item label="Kerabat" value="Kerabat" />
                </Picker>
              </View>
            </View>
            
            {/* Wall Material */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>House Wall Material *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.kondisi_rumah_dinding}
                  onValueChange={(value) => handleChange('kondisi_rumah_dinding', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Material --" value="" />
                  <Picker.Item label="Tembok" value="Tembok" />
                  <Picker.Item label="Kayu" value="Kayu" />
                  <Picker.Item label="Papan" value="Papan" />
                  <Picker.Item label="Geribik" value="Geribik" />
                  <Picker.Item label="Lainnya" value="Lainnya" />
                </Picker>
              </View>
            </View>
            
            {/* Floor Material */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>House Floor Material *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.kondisi_rumah_lantai}
                  onValueChange={(value) => handleChange('kondisi_rumah_lantai', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Material --" value="" />
                  <Picker.Item label="Keramik" value="Keramik" />
                  <Picker.Item label="Ubin" value="Ubin" />
                  <Picker.Item label="Marmer" value="Marmer" />
                  <Picker.Item label="Kayu" value="Kayu" />
                  <Picker.Item label="Tanah" value="Tanah" />
                  <Picker.Item label="Lainnya" value="Lainnya" />
                </Picker>
              </View>
            </View>
            
            {/* Vehicle */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle Ownership *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.kepemilikan_kendaraan}
                  onValueChange={(value) => handleChange('kepemilikan_kendaraan', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Vehicle --" value="" />
                  <Picker.Item label="Sepeda" value="Sepeda" />
                  <Picker.Item label="Motor" value="Motor" />
                  <Picker.Item label="Mobil" value="Mobil" />
                </Picker>
              </View>
            </View>
            
            {/* Electronics */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Electronics Ownership *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.kepemilikan_elektronik}
                  onValueChange={(value) => handleChange('kepemilikan_elektronik', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Electronics --" value="" />
                  <Picker.Item label="Radio" value="Radio" />
                  <Picker.Item label="Televisi" value="Televisi" />
                  <Picker.Item label="Handphone" value="Handphone" />
                  <Picker.Item label="Kulkas" value="Kulkas" />
                </Picker>
              </View>
            </View>
          </View>
        );
      
      case 'health':
        return (
          <View style={styles.stepContainer}>
            {/* Water Source */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Clean Water Source *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.sumber_air_bersih}
                  onValueChange={(value) => handleChange('sumber_air_bersih', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Source --" value="" />
                  <Picker.Item label="Sumur" value="Sumur" />
                  <Picker.Item label="Sungai" value="Sungai" />
                  <Picker.Item label="PDAM" value="PDAM" />
                  <Picker.Item label="Lainnya" value="Lainnya" />
                </Picker>
              </View>
            </View>
            
            {/* Toilet/Waste System */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Toilet/Waste System *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.jamban_limbah}
                  onValueChange={(value) => handleChange('jamban_limbah', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select System --" value="" />
                  <Picker.Item label="Sungai" value="Sungai" />
                  <Picker.Item label="Sepitank" value="Sepitank" />
                  <Picker.Item label="Lainnya" value="Lainnya" />
                </Picker>
              </View>
            </View>
            
            {/* Garbage Disposal */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Garbage Disposal *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.tempat_sampah}
                  onValueChange={(value) => handleChange('tempat_sampah', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Method --" value="" />
                  <Picker.Item label="TPS" value="TPS" />
                  <Picker.Item label="Sungai" value="Sungai" />
                  <Picker.Item label="Pekarangan" value="Pekarangan" />
                </Picker>
              </View>
            </View>
            
            {/* Smoker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Is anyone in the family a smoker? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.perokok === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('perokok', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.perokok === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.perokok === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('perokok', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.perokok === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Alcohol Consumer */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Is anyone in the family an alcohol consumer? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.konsumen_miras === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('konsumen_miras', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.konsumen_miras === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.konsumen_miras === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('konsumen_miras', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.konsumen_miras === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* First Aid Kit */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Does the family have a first aid kit? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.persediaan_p3k === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('persediaan_p3k', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.persediaan_p3k === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.persediaan_p3k === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('persediaan_p3k', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.persediaan_p3k === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Fruits & Vegetables */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Does the family regularly eat fruits and vegetables? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.makan_buah_sayur === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('makan_buah_sayur', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.makan_buah_sayur === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.makan_buah_sayur === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('makan_buah_sayur', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.makan_buah_sayur === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 'religious':
        return (
          <View style={styles.stepContainer}>
            {/* Daily Prayers */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Daily Prayer Consistency *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.solat_lima_waktu}
                  onValueChange={(value) => handleChange('solat_lima_waktu', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Option --" value="" />
                  <Picker.Item label="Lengkap" value="Lengkap" />
                  <Picker.Item label="Kadang-kadang" value="Kadang-kadang" />
                  <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
                </Picker>
              </View>
            </View>
            
            {/* Quran Reading */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quran Reading Ability *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.membaca_alquran}
                  onValueChange={(value) => handleChange('membaca_alquran', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Ability --" value="" />
                  <Picker.Item label="Lancar" value="Lancar" />
                  <Picker.Item label="Terbata-bata" value="Terbata-bata" />
                  <Picker.Item label="Tidak Bisa" value="Tidak Bisa" />
                </Picker>
              </View>
            </View>
            
            {/* Religious Study */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Attendance at Religious Study *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.majelis_taklim}
                  onValueChange={(value) => handleChange('majelis_taklim', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Frequency --" value="" />
                  <Picker.Item label="Rutin" value="Rutin" />
                  <Picker.Item label="Jarang" value="Jarang" />
                  <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
                </Picker>
              </View>
            </View>
            
            {/* News Reading */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Newspaper/News Reading Habit *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.membaca_koran}
                  onValueChange={(value) => handleChange('membaca_koran', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Frequency --" value="" />
                  <Picker.Item label="Selalu" value="Selalu" />
                  <Picker.Item label="Jarang" value="Jarang" />
                  <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
                </Picker>
              </View>
            </View>
            
            {/* Organization Membership */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Is a member of any organization? *</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.pengurus_organisasi === 'Ya' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('pengurus_organisasi', 'Ya')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.pengurus_organisasi === 'Ya' && styles.radioButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.pengurus_organisasi === 'Tidak' && styles.radioButtonActive
                  ]}
                  onPress={() => handleChange('pengurus_organisasi', 'Tidak')}
                >
                  <Text style={[
                    styles.radioButtonText,
                    formData.pengurus_organisasi === 'Tidak' && styles.radioButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Organization Position (conditional) */}
            {formData.pengurus_organisasi === 'Ya' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Position in Organization *</Text>
                <TextInput
                  value={formData.pengurus_organisasi_sebagai}
                  onChangeText={(value) => handleChange('pengurus_organisasi_sebagai', value)}
                  placeholder="Enter position"
                />
              </View>
            )}
          </View>
        );
      
      case 'result':
        return (
          <View style={styles.stepContainer}>
            {/* Beneficiary Condition */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Beneficiary Condition</Text>
              <TextInput
                value={formData.kondisi_penerima_manfaat}
                onChangeText={(value) => handleChange('kondisi_penerima_manfaat', value)}
                placeholder="Enter additional notes about the beneficiary's condition"
                multiline
                inputProps={{ numberOfLines: 4 }}
                style={styles.textArea}
              />
            </View>
            
            {/* Survey Officer */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Survey Officer</Text>
              <TextInput
                value={formData.petugas_survey}
                onChangeText={(value) => handleChange('petugas_survey', value)}
                placeholder="Enter survey officer's name"
              />
            </View>
            
            {/* Survey Result */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Survey Result</Text>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.resultButton,
                    formData.hasil_survey === 'Layak' && styles.resultButtonLayak
                  ]}
                  onPress={() => handleChange('hasil_survey', 'Layak')}
                >
                  <Ionicons 
                    name={formData.hasil_survey === 'Layak' ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                    size={20} 
                    color={formData.hasil_survey === 'Layak' ? '#fff' : '#2ecc71'} 
                    style={styles.resultIcon}
                  />
                  <Text style={[
                    styles.resultButtonText,
                    formData.hasil_survey === 'Layak' && styles.resultButtonTextActive
                  ]}>Eligible</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.resultButton,
                    formData.hasil_survey === 'Tidak Layak' && styles.resultButtonTidakLayak
                  ]}
                  onPress={() => handleChange('hasil_survey', 'Tidak Layak')}
                >
                  <Ionicons 
                    name={formData.hasil_survey === 'Tidak Layak' ? 'close-circle' : 'close-circle-outline'} 
                    size={20} 
                    color={formData.hasil_survey === 'Tidak Layak' ? '#fff' : '#e74c3c'} 
                    style={styles.resultIcon}
                  />
                  <Text style={[
                    styles.resultButtonText,
                    formData.hasil_survey === 'Tidak Layak' && styles.resultButtonTextActive
                  ]}>Not Eligible</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Result Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes on Survey Result</Text>
              <TextInput
                value={formData.keterangan_hasil}
                onChangeText={(value) => handleChange('keterangan_hasil', value)}
                placeholder="Enter notes about the result"
                multiline
                inputProps={{ numberOfLines: 3 }}
                style={styles.textArea}
              />
            </View>
            
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle" size={20} color="#3498db" style={styles.noteIcon} />
              <Text style={styles.noteText}>
                Note: Eligible status will automatically update the child's status to CPB (Calon Penerima Beasiswa).
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading form..." />;
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setError(null)}
          />
        )}
        
        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepIndicator,
                currentStep === index && styles.currentStepIndicator,
                currentStep > index && styles.completedStepIndicator
              ]}
              onPress={() => currentStep > index && setCurrentStep(index)}
              disabled={currentStep <= index}
            >
              {currentStep > index ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text style={[
                  styles.stepIndicatorText,
                  currentStep === index && styles.currentStepIndicatorText
                ]}>{index + 1}</Text>
              )}
            </TouchableOpacity>
          ))}
          <View style={styles.stepConnector} />
        </View>
        
        {/* Step Title */}
        <Text style={styles.stepTitle}>{steps[currentStep]?.title}</Text>
        
        {/* Current Step Form */}
        {renderFormStep()}
        
        {/* Form Actions */}
        <View style={styles.actionContainer}>
          <View style={styles.actionButtons}>
            {/* Back/Cancel Button */}
            <Button
              title={currentStep === 0 ? "Cancel" : "Back"}
              onPress={currentStep === 0 ? handleCancel : goToPreviousStep}
              type="outline"
              style={styles.actionButton}
              disabled={submitting}
            />
            
            {/* Next/Submit Button */}
            <Button
              title={currentStep === steps.length - 1 ? "Submit" : "Next"}
              onPress={goToNextStep}
              type="primary"
              style={styles.actionButton}
              loading={submitting}
              disabled={submitting}
            />
          </View>
          
          {/* Steps Progress */}
          <Text style={styles.stepsProgress}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 24,
    marginTop: 8,
  },
  stepConnector: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: 2,
    backgroundColor: '#dddddd',
    zIndex: -1,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dddddd',
    zIndex: 1,
  },
  currentStepIndicator: {
    backgroundColor: '#ffffff',
    borderColor: '#e74c3c',
  },
  completedStepIndicator: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  stepIndicatorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777777',
  },
  currentStepIndicatorText: {
    color: '#e74c3c',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  familyInfoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  familyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  familyDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  radioButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  radioButtonTextActive: {
    color: '#ffffff',
  },
  textArea: {
    minHeight: 100,
  },
  resultButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 4,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
  },
  resultButtonLayak: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  resultButtonTidakLayak: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  resultButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  resultButtonTextActive: {
    color: '#ffffff',
  },
  resultIcon: {
    marginRight: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  actionContainer: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  stepsProgress: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
  },
});

export default SurveyFormScreen;