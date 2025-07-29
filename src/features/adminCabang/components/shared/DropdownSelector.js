import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DropdownSelector = ({
  label,
  value,
  onValueChange, // Main prop
  onSelect, // Alternative prop for backward compatibility
  options = [],
  placeholder = 'Pilih opsi',
  error,
  disabled = false,
  style,
  renderItem: customRenderItem
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle both onValueChange and onSelect for compatibility
  const handleSelect = (selectedValue) => {
    try {
      setIsOpen(false);
      
      if (onValueChange) {
        onValueChange(selectedValue);
      } else if (onSelect) {
        onSelect(selectedValue);
      } else {
        console.warn('DropdownSelector: Neither onValueChange nor onSelect prop provided');
      }
    } catch (err) {
      console.error('DropdownSelector handleSelect error:', err);
    }
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const renderOption = ({ item }) => {
    if (customRenderItem) {
      return customRenderItem({ item, onSelect: handleSelect });
    }

    return (
      <TouchableOpacity
        style={[
          styles.option,
          item.value === value && styles.selectedOption
        ]}
        onPress={() => handleSelect(item.value)}
      >
        <Text style={[
          styles.optionText,
          item.value === value && styles.selectedOptionText
        ]}>
          {item.label}
        </Text>
        {item.description && (
          <Text style={styles.optionDescription}>{item.description}</Text>
        )}
        {item.value === value && (
          <Ionicons name="checkmark" size={20} color="#007bff" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.selectorText,
          !value && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {getDisplayValue()}
        </Text>
        
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={disabled ? "#ccc" : "#666"} 
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{label || 'Pilih Opsi'}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 48
  },
  selectorError: {
    borderColor: '#dc3545'
  },
  selectorDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef'
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
    color: '#ccc'
  },
  errorText: {
    fontSize: 14,
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
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  optionsList: {
    maxHeight: 300
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  selectedOption: {
    backgroundColor: '#f8f9ff'
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: '500'
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0'
  }
});

export default DropdownSelector;