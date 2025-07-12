import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DetailHeader = ({
  title,
  subtitle,
  onBackPress,
  onEditPress,
  onDeletePress,
  showBackButton = true,
  showEditButton = true,
  showDeleteButton = true,
  style = {}
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        <View style={styles.actions}>
          {showEditButton && onEditPress && (
            <TouchableOpacity style={styles.actionButton} onPress={onEditPress}>
              <Ionicons name="create" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
          {showDeleteButton && onDeletePress && (
            <TouchableOpacity style={styles.actionButton} onPress={onDeletePress}>
              <Ionicons name="trash" size={20} color="#e74c3c" />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
});

export default DetailHeader;