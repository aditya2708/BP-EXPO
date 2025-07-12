
import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DataList = ({
  data,
  renderItem,
  refreshControl,
  onEndReached,
  onEndReachedThreshold = 0.5,
  showActions = true,
  ...props
}) => {
  const renderDataItem = ({ item, index }) => {
    const itemData = typeof renderItem === 'function' ? renderItem({ item, index }) : item;
    
    return (
      <TouchableOpacity 
        style={styles.itemContainer} 
        onPress={itemData.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          {itemData.icon && (
            <View style={[styles.iconContainer, { backgroundColor: itemData.iconColor || '#3498db' }]}>
              <Ionicons name={itemData.icon} size={24} color="#fff" />
            </View>
          )}
          
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {itemData.title}
            </Text>
            {itemData.subtitle && (
              <Text style={styles.itemSubtitle} numberOfLines={1}>
                {itemData.subtitle}
              </Text>
            )}
          </View>
          
          {itemData.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemData.badge}</Text>
            </View>
          )}
          
          {showActions && (
            <View style={styles.actionsContainer}>
              {itemData.onEdit && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]} 
                  onPress={itemData.onEdit}
                >
                  <Ionicons name="create" size={18} color="#3498db" />
                </TouchableOpacity>
              )}
              {itemData.onDelete && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]} 
                  onPress={itemData.onDelete}
                >
                  <Ionicons name="trash" size={18} color="#e74c3c" />
                </TouchableOpacity>
              )}
              <Ionicons name="chevron-forward" size={16} color="#adb5bd" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderDataItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      refreshControl={refreshControl}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.listContainer, data.length === 0 && styles.emptyList]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
});

export default DataList;