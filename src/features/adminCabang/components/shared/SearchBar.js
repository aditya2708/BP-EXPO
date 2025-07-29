import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Cari...',
  showSuggestions = false,
  suggestions = [],
  onSuggestionPress,
  debounceMs = 300,
  style,
  inputStyle
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    setLocalValue(value || '');
    setShowClear(Boolean(value));
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== value) {
        onChangeText?.(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localValue, debounceMs, onChangeText, value]);

  const handleChangeText = (text) => {
    setLocalValue(text);
    setShowClear(Boolean(text));
  };

  const handleClear = () => {
    setLocalValue('');
    setShowClear(false);
    onChangeText?.('');
  };

  const handleSubmit = () => {
    onSubmit?.(localValue);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        
        <TextInput
          style={[styles.input, inputStyle]}
          value={localValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          clearButtonMode="never"
        />
        
        {showClear && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => onSuggestionPress?.(suggestion)}
            >
              <Ionicons name="search" size={16} color="#666" />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  searchIcon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4
  },
  clearButton: {
    marginLeft: 8
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8
  }
});

export default SearchBar;