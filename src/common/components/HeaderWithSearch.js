
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderWithSearch = ({
  title,
  subtitle,
  onSearch,
  placeholder = 'Cari...',
  error,
  onErrorDismiss,
  searchValue = '',
  onSearchValueChange,
  showBackButton = false,
  onBackPress,
  rightComponent = null,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (text) => {
    if (onSearchValueChange) {
      onSearchValueChange(text);
    } else {
      setLocalSearchValue(text);
    }
    
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleClearSearch = () => {
    const emptyValue = '';
    if (onSearchValueChange) {
      onSearchValueChange(emptyValue);
    } else {
      setLocalSearchValue(emptyValue);
    }
    
    if (onSearch) {
      onSearch(emptyValue);
    }
  };

  const currentValue = onSearchValueChange ? searchValue : localSearchValue;

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: onErrorDismiss }
      ]);
    }
  }, [error, onErrorDismiss]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          
          {rightComponent}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            value={currentValue}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {currentValue.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default HeaderWithSearch;