// components/EntityForm.js
// Universal form component for all entities

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { 
  useEntityCRUD, 
  useEntityValidation, 
  useEntityForm,
  useErrorHandler 
} from '../logic/entityHooks';
import { FIELD_TYPES } from '../configs/entityConfigs';

// =============================================================================
// FIELD COMPONENTS
// =============================================================================

const TextField = ({ field, value, onChangeText, error, editable = true }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>
      {field.label}
      {field.required && <Text style={styles.required}> *</Text>}
    </Text>
    <TextInput
      style={[styles.textInput, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={field.placeholder}
      editable={editable}
      multiline={field.type === FIELD_TYPES.TEXTAREA}
      numberOfLines={field.rows || 1}
      keyboardType={
        field.type === FIELD_TYPES.NUMBER ? 'numeric' :
        field.type === FIELD_TYPES.EMAIL ? 'email-address' :
        field.type === FIELD_TYPES.PHONE ? 'phone-pad' : 'default'
      }
      autoCapitalize={field.type === FIELD_TYPES.EMAIL ? 'none' : 'sentences'}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const PickerField = ({ field, value, onValueChange, error, options = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || field.placeholder;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.pickerButton, error && styles.inputError]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.pickerText,
          !selectedOption && styles.placeholderText
        ]}>
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6C757D" />
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={styles.pickerCancel}>Batal</Text>
            </TouchableOpacity>
            <Text style={styles.pickerTitle}>{field.label}</Text>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={styles.pickerDone}>Selesai</Text>
            </TouchableOpacity>
          </View>
          
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => {
              onValueChange(itemValue);
              setIsVisible(false);
            }}
            style={styles.picker}
          >
            <Picker.Item label={field.placeholder} value="" />
            {options.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const SwitchField = ({ field, value, onValueChange, error }) => (
  <View style={styles.fieldContainer}>
    <View style={styles.switchContainer}>
      <View style={styles.switchLabelContainer}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        {field.required && <Text style={styles.required}> *</Text>}
      </View>
      <TouchableOpacity
        style={[styles.switch, value && styles.switchActive]}
        onPress={() => onValueChange(!value)}
      >
        <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
      </TouchableOpacity>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const FileField = ({ field, value, onFileSelect, error }) => {
  const [uploading, setUploading] = useState(false);

  const handleFilePick = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: field.accept || '*/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets?.[0]) {
        onFileSelect(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal memilih file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.fileButton, error && styles.inputError]}
        onPress={handleFilePick}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Ionicons name="document-attach" size={20} color="#007AFF" />
        )}
        <Text style={[styles.fileButtonText, !value && styles.placeholderText]}>
          {value ? value.name : field.placeholder}
        </Text>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// =============================================================================
// FORM SECTION COMPONENT
// =============================================================================

const FormSection = ({ 
  section, 
  config, 
  formData, 
  errors, 
  onFieldChange, 
  onFieldBlur,
  optionsData = {}
}) => {
  const sectionFields = section.fields
    .map(fieldKey => config.fields.find(f => f.key === fieldKey))
    .filter(Boolean);

  const renderField = (field) => {
    const value = formData[field.key] || '';
    const error = errors[field.key];
    
    const commonProps = {
      key: field.key,
      field,
      error,
      value
    };

    switch (field.type) {
      case FIELD_TYPES.TEXT:
      case FIELD_TYPES.TEXTAREA:
      case FIELD_TYPES.NUMBER:
      case FIELD_TYPES.EMAIL:
      case FIELD_TYPES.PHONE:
        return (
          <TextField
            {...commonProps}
            onChangeText={(text) => onFieldChange(field.key, text)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );

      case FIELD_TYPES.PICKER:
        const options = getPickerOptions(field, optionsData);
        return (
          <PickerField
            {...commonProps}
            options={options}
            onValueChange={(val) => onFieldChange(field.key, val)}
          />
        );

      case FIELD_TYPES.SWITCH:
        return (
          <SwitchField
            {...commonProps}
            value={Boolean(value)}
            onValueChange={(val) => onFieldChange(field.key, val)}
          />
        );

      case FIELD_TYPES.FILE:
        return (
          <FileField
            {...commonProps}
            onFileSelect={(file) => onFieldChange(field.key, file)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {sectionFields.map(renderField)}
    </View>
  );
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getPickerOptions = (field, optionsData) => {
  // Static options from config
  if (field.options && field.options.length > 0) {
    return field.options;
  }

  // Dynamic options from API
  switch (field.key) {
    case 'jenjang_id':
      return (optionsData.jenjang || []).map(item => ({
        label: item.nama,
        value: item.id
      }));
    
    case 'mata_pelajaran_id':
      return (optionsData.mataPelajaran || []).map(item => ({
        label: item.nama,
        value: item.id
      }));
    
    case 'kategori':
      return (optionsData.kategori || []).map(item => ({
        label: item.nama || item,
        value: item.value || item
      }));
    
    default:
      return [];
  }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const EntityForm = ({
  entityType,
  initialData = {},
  isEdit = false,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { config, createItem, updateItem } = useEntityCRUD(entityType);
  const { errors, validateForm, validateSingleField, clearFieldError } = useEntityValidation(entityType);
  const { formData, updateField, resetForm, isDirty } = useEntityForm(entityType, initialData);
  const { showConfirmation } = useErrorHandler();
  
  const [optionsData, setOptionsData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load options data
  useEffect(() => {
    const loadOptions = async () => {
      const pickerFields = config.fields.filter(f => f.type === FIELD_TYPES.PICKER);
      const newOptionsData = {};
      
      for (const field of pickerFields) {
        if (field.key === 'jenjang_id') {
          // Load jenjang options
          newOptionsData.jenjang = []; // Will be loaded from redux
        } else if (field.key === 'mata_pelajaran_id') {
          // Load mata pelajaran options
          newOptionsData.mataPelajaran = []; // Will be loaded from redux
        }
      }
      
      setOptionsData(newOptionsData);
    };
    
    loadOptions();
  }, [config.fields]);

  const handleFieldChange = useCallback((fieldKey, value) => {
    updateField(fieldKey, value);
    clearFieldError(fieldKey);
    
    // Validate field on change
    setTimeout(() => {
      validateSingleField(fieldKey, value);
    }, 300);
  }, [updateField, clearFieldError, validateSingleField]);

  const handleFieldBlur = useCallback((fieldKey) => {
    const value = formData[fieldKey];
    validateSingleField(fieldKey, value);
  }, [formData, validateSingleField]);

  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      Alert.alert('Validasi Gagal', 'Mohon perbaiki kesalahan pada form');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (isEdit) {
        result = await updateItem(initialData.id, formData);
      } else {
        result = await createItem(formData);
      }

      if (result.success) {
        if (onSubmit) onSubmit(result.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      showConfirmation(
        'Batalkan Perubahan?',
        'Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?',
        () => {
          resetForm();
          if (onCancel) onCancel();
        }
      );
    } else {
      if (onCancel) onCancel();
    }
  };

  const handleReset = () => {
    showConfirmation(
      'Reset Form?',
      'Semua perubahan akan dikembalikan ke nilai awal. Yakin ingin reset?',
      () => resetForm()
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {config.form.sections.map((section, index) => (
            <FormSection
              key={index}
              section={section}
              config={config}
              formData={formData}
              errors={errors}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
              optionsData={optionsData}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>

          {isDirty && (
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
              disabled={submitting}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={submitting || loading}
          >
            {submitting || loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {config.form.submitText || 'Simpan'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  scrollView: {
    flex: 1
  },
  form: {
    padding: 16,
    paddingBottom: 100
  },

  // Section
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16
  },

  // Field Container
  fieldContainer: {
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8
  },
  required: {
    color: '#DC3545'
  },

  // Text Input
  textInput: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top'
  },
  inputError: {
    borderColor: '#DC3545'
  },

  // Picker
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white'
  },
  pickerText: {
    fontSize: 16,
    color: '#212529'
  },
  placeholderText: {
    color: '#6C757D'
  },
  pickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6'
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529'
  },
  pickerCancel: {
    fontSize: 16,
    color: '#6C757D'
  },
  pickerDone: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600'
  },
  picker: {
    flex: 1
  },

  // Switch
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DEE2E6',
    justifyContent: 'center',
    paddingHorizontal: 2
  },
  switchActive: {
    backgroundColor: '#007AFF'
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    alignSelf: 'flex-start'
  },
  switchThumbActive: {
    alignSelf: 'flex-end'
  },

  // File
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    gap: 8
  },
  fileButtonText: {
    fontSize: 16,
    color: '#212529',
    flex: 1
  },

  // Error
  errorText: {
    fontSize: 12,
    color: '#DC3545',
    marginTop: 4
  },

  // Footer
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6'
  },
  resetButton: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFEAA7'
  },
  submitButton: {
    backgroundColor: '#007AFF'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D'
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404'
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});

export default EntityForm;