// components/EntityList.js
// Universal list component for all entities

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEntityCRUD, useEntitySearch, useErrorHandler } from '../logic/entityHooks';

const { width } = Dimensions.get('window');

// =============================================================================
// CARD COMPONENTS
// =============================================================================

const EntityCard = ({ item, config, onEdit, onDelete, onDetail }) => {
  const nameField = config.api.nameField;
  const primaryText = item[nameField] || 'Unnamed';
  
  const getSecondaryText = () => {
    switch (config.ui.title) {
      case 'Jenjang':
        return item.deskripsi || 'Tidak ada deskripsi';
      case 'Mata Pelajaran':
        return `${item.kategori || 'Tanpa kategori'}`;
      case 'Kelas':
        return `Tingkat ${item.tingkat} • ${item.jenjang?.nama || 'Jenjang tidak diketahui'}`;
      case 'Materi':
        return `${item.mata_pelajaran?.nama || 'Mata pelajaran tidak diketahui'} • ${item.tingkat_kesulitan || 'Tidak ada tingkat'}`;
      case 'Kurikulum':
        return `Tahun ${item.tahun_berlaku} • ${item.is_active ? 'Aktif' : 'Tidak Aktif'}`;
      default:
        return '';
    }
  };

  const getStatusBadge = () => {
    if (config.ui.title === 'Kurikulum') {
      return (
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.is_active ? '#28A745' : '#6C757D' }
        ]}>
          <Text style={styles.statusText}>
            {item.is_active ? 'AKTIF' : 'NONAKTIF'}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onDetail(item)}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: config.ui.color }]}>
          <Ionicons name={config.ui.icon} size={20} color="white" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {primaryText}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {getSecondaryText()}
          </Text>
        </View>
        {getStatusBadge()}
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(item)}
        >
          <Ionicons name="pencil" size={16} color="#007AFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="trash" size={16} color="#DC3545" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = ({ config, onAdd }) => (
  <View style={styles.emptyContainer}>
    <View style={[styles.emptyIcon, { backgroundColor: config.ui.color }]}>
      <Ionicons name={config.ui.icon} size={40} color="white" />
    </View>
    <Text style={styles.emptyTitle}>
      {config.ui.listEmptyText}
    </Text>
    <Text style={styles.emptySubtitle}>
      {config.ui.listEmptySubtext}
    </Text>
    <TouchableOpacity style={styles.emptyButton} onPress={onAdd}>
      <Ionicons name="add" size={20} color="white" />
      <Text style={styles.emptyButtonText}>
        Tambah {config.ui.title}
      </Text>
    </TouchableOpacity>
  </View>
);

const LoadingShimmer = () => (
  <View style={styles.shimmerContainer}>
    {[1, 2, 3].map(i => (
      <View key={i} style={styles.shimmerCard}>
        <View style={styles.shimmerHeader}>
          <View style={styles.shimmerIcon} />
          <View style={styles.shimmerContent}>
            <View style={styles.shimmerTitle} />
            <View style={styles.shimmerSubtitle} />
          </View>
        </View>
        <View style={styles.shimmerActions}>
          <View style={styles.shimmerButton} />
          <View style={styles.shimmerButton} />
        </View>
      </View>
    ))}
  </View>
);

const ErrorState = ({ error, onRetry, config }) => (
  <View style={styles.errorContainer}>
    <Ionicons name="alert-circle" size={48} color="#DC3545" />
    <Text style={styles.errorTitle}>
      Gagal memuat {config.ui.title}
    </Text>
    <Text style={styles.errorMessage}>
      {error?.message || 'Terjadi kesalahan saat memuat data'}
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Ionicons name="refresh" size={20} color="white" />
      <Text style={styles.retryButtonText}>Coba Lagi</Text>
    </TouchableOpacity>
  </View>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const EntityList = ({ 
  entityType, 
  searchQuery = '', 
  filters = {},
  onItemPress,
  onEditPress,
  onAddPress,
  refreshing = false,
  onRefresh
}) => {
  const { items, loading, error, fetchItems, deleteItem, config } = useEntityCRUD(entityType);
  const { filteredItems } = useEntitySearch(entityType, items);
  const { showDeleteConfirmation } = useErrorHandler();
  
  const [localRefreshing, setLocalRefreshing] = useState(false);

  // Apply search and filters
  const displayItems = useMemo(() => {
    let result = filteredItems;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        config.search.fields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => item[key] === value);
      }
    });

    return result;
  }, [filteredItems, searchQuery, filters, config.search.fields]);

  const handleRefresh = useCallback(async () => {
    setLocalRefreshing(true);
    try {
      await fetchItems();
      if (onRefresh) onRefresh();
    } finally {
      setLocalRefreshing(false);
    }
  }, [fetchItems, onRefresh]);

  const handleEdit = useCallback((item) => {
    if (onEditPress) onEditPress(item);
  }, [onEditPress]);

  const handleDetail = useCallback((item) => {
    if (onItemPress) onItemPress(item);
  }, [onItemPress]);

  const handleDelete = useCallback((item) => {
    const itemName = item[config.api.nameField] || 'item ini';
    showDeleteConfirmation(itemName, async () => {
      const result = await deleteItem(item.id);
      if (result.success) {
        await fetchItems(); // Refresh list
      }
    });
  }, [deleteItem, fetchItems, config.api.nameField, showDeleteConfirmation]);

  const renderItem = useCallback(({ item, index }) => (
    <EntityCard
      item={item}
      config={config}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDetail={handleDetail}
      style={[
        styles.listItem,
        index === displayItems.length - 1 && styles.lastItem
      ]}
    />
  ), [config, handleEdit, handleDelete, handleDetail, displayItems.length]);

  const keyExtractor = useCallback((item) => 
    String(item.id || item[config.api.idField] || Math.random())
  , [config.api.idField]);

  // Loading state
  if (loading && !localRefreshing && !refreshing && displayItems.length === 0) {
    return <LoadingShimmer />;
  }

  // Error state
  if (error && displayItems.length === 0 && !loading) {
    return (
      <ErrorState 
        error={error} 
        onRetry={() => fetchItems()} 
        config={config}
      />
    );
  }

  // Empty state
  if (displayItems.length === 0 && !loading && !error) {
    return <EmptyState config={config} onAdd={onAddPress} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || localRefreshing}
            onRefresh={handleRefresh}
            colors={[config.ui.color]}
            tintColor={config.ui.color}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          displayItems.length === 0 && styles.emptyListContainer
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => 
          loading && displayItems.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={config.ui.color} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32
  },
  emptyListContainer: {
    flexGrow: 1
  },
  
  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 18
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white'
  },
  
  // Card Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4
  },
  editButton: {
    backgroundColor: '#E7F3FF'
  },
  deleteButton: {
    backgroundColor: '#FFEBEE'
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF'
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC3545'
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white'
  },
  
  // Loading Shimmer
  shimmerContainer: {
    padding: 16
  },
  shimmerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  shimmerHeader: {
    flexDirection: 'row',
    marginBottom: 12
  },
  shimmerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    marginRight: 12
  },
  shimmerContent: {
    flex: 1
  },
  shimmerTitle: {
    height: 16,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%'
  },
  shimmerSubtitle: {
    height: 14,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    width: '90%'
  },
  shimmerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  shimmerButton: {
    width: 60,
    height: 28,
    backgroundColor: '#E9ECEF',
    borderRadius: 6
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8
  },
  errorMessage: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white'
  },
  
  // Misc
  separator: {
    height: 1,
    backgroundColor: 'transparent'
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  lastItem: {
    marginBottom: 0
  }
});

export default EntityList;