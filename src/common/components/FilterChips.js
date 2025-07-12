
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FilterChips = ({
  options = [],
  selected = null,
  onSelect,
  keyExtractor = (item) => item.id || item.value,
  labelExtractor = (item) => item.label || item.name,
  style = {},
}) => {
  const getKey = (item) => {
    if (typeof keyExtractor === 'function') {
      return keyExtractor(item);
    }
    return item?.id || item?.value || item;
  };

  const getLabel = (item) => {
    if (typeof labelExtractor === 'function') {
      return labelExtractor(item);
    }
    return item?.label || item?.name || item;
  };

  const isSelected = (item) => {
    if (!selected) return false;
    return getKey(selected) === getKey(item);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={`${getKey(option)}-${index}`}
          style={[
            styles.chip,
            isSelected(option) && styles.selectedChip
          ]}
          onPress={() => onSelect && onSelect(option)}
        >
          <Text style={[
            styles.chipText,
            isSelected(option) && styles.selectedChipText
          ]}>
            {getLabel(option)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedChip: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#fff',
  },
});

export default FilterChips;