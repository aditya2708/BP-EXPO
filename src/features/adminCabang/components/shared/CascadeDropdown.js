import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CascadeDropdown = ({
  label,
  placeholder = 'Pilih...',
  options = [],
  value,
  onValueChange,
  keyExtractor = 'id',
  labelExtractor = 'label',
  error,
  disabled = false,
  loading = false,
  emptyText = 'Tidak ada data',
  style
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getItemKey = (item) => {
    return typeof keyExtractor === 'function' ? keyExtractor(item) : item[keyExtractor];
  };

  const getItemLabel = (item) => {
    return typeof labelExtractor === 'function' ? labelExtractor(item) : item[labelExtractor];
  };

  const selectedItem = options.find(item => getItemKey(item) == value);
  const displayText = selectedItem ? getItemLabel(selectedItem) : placeholder;

  const handleSelect = (item) => {
    onValueChange(getItemKey(item));
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        getItemKey(item) == value && styles.selectedItem
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[
        styles.modalItemText,
        getItemKey(item) == value && styles.selectedItemText
      ]}>
        {getItemLabel(item)}
      </Text>
      {getItemKey(item) == value && (
        <Ionicons name="checkmark" size={20} color="#007bff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          disabled && styles.dropdownDisabled
        ]}
        onPress={() => !disabled && !loading && setModalVisible(true)}
        disabled={disabled || loading}
      >
        <Text style={[
          styles.dropdownText,
          !selectedItem && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {displayText}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <Ionicons
            name={modalVisible ? "chevron-up" : "chevron-down"}
            size={20}
            color={disabled ? "#ccc" : "#666"}
          />
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Pilih Item'}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {options.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{emptyText}</Text>
              </View>
            ) : (
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={getItemKey}
                style={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  dropdownError: {
    borderColor: '#dc3545'
  },
  dropdownDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef'
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  placeholderText: {
    color: '#999'
  },
  disabledText: {
    color: '#6c757d'
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  modalList: {
    maxHeight: 300
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa'
  },
  selectedItem: {
    backgroundColor: '#e7f3ff'
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  selectedItemText: {
    color: '#007bff',
    fontWeight: '500'
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center'
  }
});

export default CascadeDropdown;