import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DropdownSelector = ({
  label,
  value,
  onSelect,
  options = [],
  placeholder = 'Pilih...',
  loading = false,
  disabled = false,
  error = null,
  required = false,
  style,
  renderOption,
  searchable = false,
  onSearch,
  emptyText = 'Tidak ada data'
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (option) => {
    onSelect(option.value, option);
    setModalVisible(false);
    setSearchText('');
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const filteredOptions = searchable && searchText && !onSearch
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const renderDropdownItem = ({ item }) => {
    if (renderOption) {
      return renderOption(item, () => handleSelect(item));
    }

    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          item.value === value && styles.selectedOption
        ]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.optionContent}>
          <Text style={[
            styles.optionLabel,
            item.value === value && styles.selectedOptionText
          ]}>
            {item.label}
          </Text>
          {item.subtitle && (
            <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        {item.value === value && (
          <Ionicons name="checkmark" size={20} color="#007bff" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.selector,
          disabled && styles.selectorDisabled,
          error && styles.selectorError
        ]}
        onPress={() => !disabled && !loading && setModalVisible(true)}
        disabled={disabled || loading}
      >
        <Text style={[
          styles.selectorText,
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {displayText}
        </Text>
        
        <View style={styles.selectorRight}>
          {loading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={disabled ? "#ccc" : "#666"} 
            />
          )}
        </View>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Pilih Option'}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={handleSearch}
                  placeholder="Cari..."
                  autoFocus
                />
              </View>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Memuat data...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredOptions}
                renderItem={renderDropdownItem}
                keyExtractor={(item) => item.value?.toString() || item.label}
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="folder-open-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>{emptyText}</Text>
                  </View>
                }
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
    marginVertical: 8
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  required: {
    color: '#dc3545'
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 48
  },
  selectorDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef'
  },
  selectorError: {
    borderColor: '#dc3545'
  },
  selectorText: {
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
  selectorRight: {
    marginLeft: 8
  },
  errorText: {
    fontSize: 14,
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
    maxHeight: '80%',
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333'
  },
  optionsList: {
    maxHeight: 300
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  selectedOption: {
    backgroundColor: '#e7f3ff'
  },
  optionContent: {
    flex: 1
  },
  optionLabel: {
    fontSize: 16,
    color: '#333'
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: '500'
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center'
  }
});

export default DropdownSelector;