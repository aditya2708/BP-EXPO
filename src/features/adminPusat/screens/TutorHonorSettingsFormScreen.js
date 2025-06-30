import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import Button from '../../../common/components/Button';

import {
  createSetting,
  updateSetting,
  calculatePreview,
  resetActionStatus,
  clearPreview,
  selectActionStatus,
  selectActionError,
  selectPreview
} from '../redux/tutorHonorSettingsSlice';

const TutorHonorSettingsFormScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const { setting, isEdit = false, isNew = false } = route.params || {};

  const createStatus = useSelector(state => selectActionStatus(state, 'create'));
  const updateStatus = useSelector(state => selectActionStatus(state, 'update'));
  const createError = useSelector(state => selectActionError(state, 'create'));
  const updateError = useSelector(state => selectActionError(state, 'update'));
  const preview = useSelector(selectPreview);

  const [formData, setFormData] = useState({
    cpb_rate: '',
    pb_rate: '',
    npb_rate: '',
    is_active: true
  });

  const [previewData, setPreviewData] = useState({
    cpb_count: 5,
    pb_count: 3,
    npb_count: 2
  });

  useEffect(() => {
    if (setting && isEdit) {
      setFormData({
        cpb_rate: setting.cpb_rate?.toString() || '',
        pb_rate: setting.pb_rate?.toString() || '',
        npb_rate: setting.npb_rate?.toString() || '',
        is_active: setting.is_active || false
      });
    }
  }, [setting, isEdit]);

  useEffect(() => {
    if (formData.cpb_rate && formData.pb_rate && formData.npb_rate) {
      const delayedPreview = setTimeout(() => {
        dispatch(calculatePreview({
          cpb_count: previewData.cpb_count,
          pb_count: previewData.pb_count,
          npb_count: previewData.npb_count,
          setting_id: setting?.id_setting
        }));
      }, 500);
      
      return () => clearTimeout(delayedPreview);
    }
  }, [formData.cpb_rate, formData.pb_rate, formData.npb_rate, previewData]);

  const handleInputChange = (field, value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handlePreviewChange = (field, value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setPreviewData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.cpb_rate || parseFloat(formData.cpb_rate) <= 0) {
      errors.push('Rate CPB harus diisi dan lebih dari 0');
    }
    if (!formData.pb_rate || parseFloat(formData.pb_rate) <= 0) {
      errors.push('Rate PB harus diisi dan lebih dari 0');
    }
    if (!formData.npb_rate || parseFloat(formData.npb_rate) <= 0) {
      errors.push('Rate NPB harus diisi dan lebih dari 0');
    }

    if (errors.length > 0) {
      Alert.alert('Error Validasi', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = {
      cpb_rate: parseFloat(formData.cpb_rate),
      pb_rate: parseFloat(formData.pb_rate),
      npb_rate: parseFloat(formData.npb_rate),
      is_active: formData.is_active
    };

    const action = isEdit 
      ? updateSetting({ id: setting.id_setting, data: submitData })
      : createSetting(submitData);

    dispatch(action)
      .unwrap()
      .then(() => {
        Alert.alert(
          'Berhasil',
          `Setting honor ${isEdit ? 'diperbarui' : 'dibuat'} dengan sukses`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      })
      .catch((error) => {
        Alert.alert('Gagal', error || `Gagal ${isEdit ? 'memperbarui' : 'membuat'} setting`);
      });
  };

  const isLoading = createStatus === 'loading' || updateStatus === 'loading';
  const currentError = createError || updateError;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {isEdit ? 'Edit Setting Honor' : 'Buat Setting Honor Baru'}
        </Text>

        {/* CPB Rate */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Rate CPB (Calon Penerima Beasiswa)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.textInput}
              value={formData.cpb_rate}
              onChangeText={(value) => handleInputChange('cpb_rate', value)}
              placeholder="10000"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* PB Rate */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Rate PB (Penerima Beasiswa)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.textInput}
              value={formData.pb_rate}
              onChangeText={(value) => handleInputChange('pb_rate', value)}
              placeholder="15000"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* NPB Rate */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Rate NPB (Non Penerima Beasiswa)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.textInput}
              value={formData.npb_rate}
              onChangeText={(value) => handleInputChange('npb_rate', value)}
              placeholder="8000"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Active Switch */}
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Aktifkan setting ini</Text>
          <Switch
            value={formData.is_active}
            onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value }))}
            trackColor={{ false: '#ddd', true: '#3498db' }}
            thumbColor={formData.is_active ? '#fff' : '#f4f3f4'}
          />
        </View>

        {formData.is_active && (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={16} color="#f39c12" />
            <Text style={styles.warningText}>
              Setting ini akan menjadi aktif dan menggantikan setting aktif saat ini
            </Text>
          </View>
        )}
      </View>

      {/* Preview Calculator */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Preview Kalkulasi Honor</Text>
        
        <View style={styles.previewInputs}>
          <View style={styles.previewInputGroup}>
            <Text style={styles.previewInputLabel}>Siswa CPB</Text>
            <TextInput
              style={styles.previewInput}
              value={previewData.cpb_count.toString()}
              onChangeText={(value) => handlePreviewChange('cpb_count', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.previewInputGroup}>
            <Text style={styles.previewInputLabel}>Siswa PB</Text>
            <TextInput
              style={styles.previewInput}
              value={previewData.pb_count.toString()}
              onChangeText={(value) => handlePreviewChange('pb_count', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.previewInputGroup}>
            <Text style={styles.previewInputLabel}>Siswa NPB</Text>
            <TextInput
              style={styles.previewInput}
              value={previewData.npb_count.toString()}
              onChangeText={(value) => handlePreviewChange('npb_count', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {preview && (
          <View style={styles.previewResult}>
            <Text style={styles.previewResultTitle}>Hasil Kalkulasi:</Text>
            <View style={styles.previewBreakdown}>
              <View style={styles.previewBreakdownItem}>
                <Text style={styles.previewBreakdownLabel}>CPB ({previewData.cpb_count} × Rp {formData.cpb_rate})</Text>
                <Text style={styles.previewBreakdownValue}>
                  Rp {preview.calculation?.cpb_amount?.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.previewBreakdownItem}>
                <Text style={styles.previewBreakdownLabel}>PB ({previewData.pb_count} × Rp {formData.pb_rate})</Text>
                <Text style={styles.previewBreakdownValue}>
                  Rp {preview.calculation?.pb_amount?.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.previewBreakdownItem}>
                <Text style={styles.previewBreakdownLabel}>NPB ({previewData.npb_count} × Rp {formData.npb_rate})</Text>
                <Text style={styles.previewBreakdownValue}>
                  Rp {preview.calculation?.npb_amount?.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={[styles.previewBreakdownItem, styles.previewTotal]}>
                <Text style={styles.previewTotalLabel}>Total Honor:</Text>
                <Text style={styles.previewTotalValue}>
                  {preview.formatted_total}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {currentError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{currentError}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Batal"
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.cancelButton}
        />
        <Button
          title={isEdit ? 'Perbarui' : 'Simpan'}
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    padding: 16
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  currencyPrefix: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    fontSize: 14,
    color: '#666'
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333'
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12'
  },
  warningText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#856404',
    flex: 1
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  previewInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  previewInputGroup: {
    flex: 1,
    marginHorizontal: 4
  },
  previewInputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center'
  },
  previewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
    fontSize: 14
  },
  previewResult: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8
  },
  previewResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  previewBreakdown: {
    gap: 8
  },
  previewBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  previewBreakdownLabel: {
    fontSize: 12,
    color: '#666'
  },
  previewBreakdownValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  previewTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    marginTop: 8
  },
  previewTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  previewTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71'
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c'
  },
  errorText: {
    color: '#721c24',
    fontSize: 14
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  },
  cancelButton: {
    flex: 1
  },
  submitButton: {
    flex: 1
  }
});

export default TutorHonorSettingsFormScreen;