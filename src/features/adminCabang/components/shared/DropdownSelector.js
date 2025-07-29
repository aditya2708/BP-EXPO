import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DropdownSelector = ({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = 'Pilih opsi',
  error,
  disabled = false,
  searchable = false,
  showBadges = true,
  style,
  containerStyle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = searchable && searchText
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchText.toLowerCase()) ||
        (option.subtitle && option.subtitle.toLowerCase().includes(searchText.toLowerCase()))
      )
    : options;

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setIsOpen(false);
    setSearchText('');
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        item.value === value && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <View style={styles.optionContent}>
        <Text style={[
          styles.optionLabel,
          item.value === value && styles.selectedLabel
        ]}>
          {item.label}
        </Text>
        
        {item.subtitle && (
          <Text style={[
            styles.optionSubtitle,
            item.value === value && styles.selectedSubtitle
          ]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      
      {showBadges && item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      
      {item.value === value && (
        <Ionicons name="checkmark" size={20} color="#007bff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled,
          style
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View style={styles.selectorContent}>
          {selectedOption ? (
            <View style={styles.selectedContent}>
              <Text style={styles.selectedText}>{selectedOption.label}</Text>
              {selectedOption.subtitle && (
                <Text style={styles.selectedSubtext}>{selectedOption.subtitle}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
        
        {showBadges && selectedOption?.badge && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>{selectedOption.badge}</Text>
          </View>
        )}
        
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={disabled ? "#ccc" : "#666"} 
        />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Pilih Opsi'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari..."
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                />
                {searchText && (
                  <TouchableOpacity
                    style={styles.clearSearch}
                    onPress={() => setSearchText('')}
                  >
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.value?.toString()}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchText ? 'Tidak ada hasil yang ditemukan' : 'Tidak ada opsi tersedia'}
                  </Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    minHeight: 56
  },
  selectorError: {
    borderColor: '#dc3545'
  },
  selectorDisabled: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6
  },
  selectorContent: {
    flex: 1
  },
  selectedContent: {
    flex: 1
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  selectedSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  placeholder: {
    fontSize: 16,
    color: '#999'
  },
  selectedBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8
  },
  selectedBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600'
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12
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
  clearSearch: {
    padding: 4
  },
  optionsList: {
    maxHeight: 300
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  selectedOption: {
    backgroundColor: '#e7f3ff'
  },
  optionContent: {
    flex: 1
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  selectedLabel: {
    color: '#007bff'
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  selectedSubtitle: {
    color: '#007bff'
  },
  badge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8
  },
  badgeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600'
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
});

export default DropdownSelector;