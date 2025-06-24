import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CPBFilters = ({
  visible,
  filters,
  filterOptions,
  onClose,
  onApply,
  onClear
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      jenisKelamin: null,
      kelas: null,
      statusOrangTua: null,
      search: ''
    };
    setLocalFilters(clearedFilters);
    onClear();
    onClose();
  };

  const renderFilterSection = (title, options, selectedValue, filterKey) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            !selectedValue && styles.optionSelected
          ]}
          onPress={() => handleFilterChange(filterKey, null)}
        >
          <Text style={[
            styles.optionText,
            !selectedValue && styles.optionTextSelected
          ]}>
            Semua
          </Text>
          {!selectedValue && (
            <Ionicons name="checkmark" size={16} color="#9b59b6" />
          )}
        </TouchableOpacity>
        
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedValue === option && styles.optionSelected
            ]}
            onPress={() => handleFilterChange(filterKey, option)}
          >
            <Text style={[
              styles.optionText,
              selectedValue === option && styles.optionTextSelected
            ]}>
              {option}
            </Text>
            {selectedValue === option && (
              <Ionicons name="checkmark" size={16} color="#9b59b6" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter CPB</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Jenis Kelamin Filter */}
            {renderFilterSection(
              'Jenis Kelamin',
              filterOptions.jenisKelamin || [],
              localFilters.jenisKelamin,
              'jenisKelamin'
            )}

            {/* Kelas Filter */}
            {renderFilterSection(
              'Kelas',
              filterOptions.kelas || [],
              localFilters.kelas,
              'kelas'
            )}

            {/* Status Orang Tua Filter */}
            {renderFilterSection(
              'Status Orang Tua',
              filterOptions.statusOrangTua || [],
              localFilters.statusOrangTua,
              'statusOrangTua'
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Hapus Semua</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  content: {
    flex: 1,
    padding: 16
  },
  filterSection: {
    marginBottom: 24
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  optionsContainer: {
    gap: 8
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  optionSelected: {
    backgroundColor: '#f8f4ff',
    borderColor: '#9b59b6'
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  optionTextSelected: {
    color: '#9b59b6',
    fontWeight: '500'
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9b59b6',
    alignItems: 'center'
  },
  clearButtonText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '500'
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#9b59b6',
    alignItems: 'center'
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  }
});

export default CPBFilters;