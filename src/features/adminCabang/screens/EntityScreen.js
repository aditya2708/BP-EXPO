// screens/EntityScreen.js
// Universal screen for all entity CRUD operations

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useEntityCRUD, useEntityNavigation, useErrorHandler } from '../logic/entityHooks';
import EntityList from '../components/EntityList';
import EntityForm from '../components/EntityForm';

const MODES = {
  LIST: 'list',
  FORM: 'form',
  DETAIL: 'detail',
  ASSIGN: 'assign'
};

// =============================================================================
// HEADER COMPONENT
// =============================================================================

const EntityHeader = ({ 
  mode, 
  config, 
  onBack, 
  onAdd, 
  onSearch, 
  searchQuery,
  isEdit = false,
  currentItem = null
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const getTitle = () => {
    switch (mode) {
      case MODES.LIST:
        return config.ui.title;
      case MODES.FORM:
        return isEdit ? `Edit ${config.ui.title}` : `Tambah ${config.ui.title}`;
      case MODES.DETAIL:
        const itemName = currentItem?.[config.api.nameField] || 'Detail';
        return itemName;
      case MODES.ASSIGN:
        return `Assign Materi - ${currentItem?.[config.api.nameField] || ''}`;
      default:
        return config.ui.title;
    }
  };

  const getRightActions = () => {
    if (mode === MODES.LIST) {
      return (
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onAdd}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.header, { backgroundColor: config.ui.color }]}>
      <StatusBar backgroundColor={config.ui.color} barStyle="light-content" />
      
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {getTitle()}
        </Text>
        
        {getRightActions()}
      </View>

      {showSearch && mode === MODES.LIST && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6C757D" />
            <TextInput
              style={styles.searchInput}
              placeholder={config.search.placeholder}
              value={searchQuery}
              onChangeText={onSearch}
              placeholderTextColor="#6C757D"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearch('')}>
                <Ionicons name="close-circle" size={20} color="#6C757D" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// =============================================================================
// DETAIL VIEW COMPONENT
// =============================================================================

const EntityDetailView = ({ entityType, item, config, onEdit }) => {
  if (!item) {
    return (
      <View style={styles.detailLoading}>
        <ActivityIndicator size="large" color={config.ui.color} />
        <Text style={styles.loadingText}>Memuat detail...</Text>
      </View>
    );
  }

  const renderDetailField = (field) => {
    const value = item[field.key];
    
    if (!value && value !== 0 && value !== false) return null;

    const getDisplayValue = () => {
      switch (field.type) {
        case 'switch':
          return value ? 'Ya' : 'Tidak';
        case 'picker':
          if (field.key === 'jenjang_id') return item.jenjang?.nama || value;
          if (field.key === 'mata_pelajaran_id') return item.mata_pelajaran?.nama || value;
          return value;
        case 'file':
          return value.name || 'File terlampir';
        default:
          return String(value);
      }
    };

    return (
      <View key={field.key} style={styles.detailField}>
        <Text style={styles.detailLabel}>{field.label}</Text>
        <Text style={styles.detailValue}>{getDisplayValue()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <View style={[styles.detailIcon, { backgroundColor: config.ui.color }]}>
            <Ionicons name={config.ui.icon} size={24} color="white" />
          </View>
          <View style={styles.detailHeaderText}>
            <Text style={styles.detailTitle}>
              {item[config.api.nameField]}
            </Text>
            <Text style={styles.detailSubtitle}>
              {config.ui.title}
            </Text>
          </View>
        </View>

        <View style={styles.detailContent}>
          {config.fields.map(renderDetailField)}
        </View>

        <View style={styles.detailActions}>
          <TouchableOpacity
            style={[styles.detailButton, { backgroundColor: config.ui.color }]}
            onPress={() => onEdit(item)}
          >
            <Ionicons name="pencil" size={20} color="white" />
            <Text style={styles.detailButtonText}>Edit {config.ui.title}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// =============================================================================
// ASSIGN VIEW COMPONENT (for Kurikulum)
// =============================================================================

const AssignView = ({ kurikulumId, onBack }) => {
  return (
    <View style={styles.assignContainer}>
      <Text style={styles.assignTitle}>Assign Materi ke Kurikulum</Text>
      <Text style={styles.assignSubtitle}>
        Fitur ini akan diimplementasi menggunakan AssignMateriScreen yang sudah ada
      </Text>
      <TouchableOpacity style={styles.assignBackButton} onPress={onBack}>
        <Text style={styles.assignBackText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const EntityScreen = ({ route, navigation }) => {
  const { entityType, mode = MODES.LIST, itemId, isEdit = false } = route.params;
  
  // 🐛 DEBUG: Log screen initialization
  console.log('🚀 EntityScreen mounted with params:', {
    entityType,
    mode,
    itemId,
    isEdit,
    routeParams: route.params
  });
  
  const { 
    items, 
    currentItem, 
    loading, 
    fetchItems, 
    fetchItemById, 
    clearCurrentItem,
    config 
  } = useEntityCRUD(entityType);
  
  // 🐛 DEBUG: Log hook results
  console.log('🔍 useEntityCRUD results:', {
    entityType,
    configExists: !!config,
    itemsLength: items?.length || 0,
    fetchItemsExists: !!fetchItems,
    fetchItemByIdExists: !!fetchItemById,
    loading,
    currentItem: !!currentItem
  });
  
  const { goBack } = useEntityNavigation();
  const { handleError } = useErrorHandler();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load data based on mode
  useEffect(() => {
    const loadData = async () => {
      // 🐛 DEBUG: Log data loading attempt
      console.log('📡 Attempting to load data:', {
        mode,
        entityType,
        itemId,
        shouldFetchList: mode === MODES.LIST,
        shouldFetchItem: (mode === MODES.DETAIL || mode === MODES.FORM) && itemId,
        fetchItemsAvailable: !!fetchItems,
        fetchItemByIdAvailable: !!fetchItemById
      });

      try {
        if (mode === MODES.LIST) {
          console.log('📋 Calling fetchItems for list mode...');
          const result = await fetchItems();
          console.log('📋 fetchItems result:', result);
        } else if ((mode === MODES.DETAIL || mode === MODES.FORM) && itemId) {
          console.log('📄 Calling fetchItemById for detail/form mode...');
          const result = await fetchItemById(itemId);
          console.log('📄 fetchItemById result:', result);
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        handleError(error, `Loading ${entityType} data`);
      }
    };

    loadData();
  }, [mode, itemId, entityType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mode !== MODES.LIST) {
        clearCurrentItem();
      }
    };
  }, [mode, clearCurrentItem]);

  // Handle back button (Fixed deprecated API)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      // ✅ NEW API: BackHandler.addEventListener returns subscription
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove(); // ✅ Use subscription.remove() instead of removeEventListener
    }, [handleBack])
  );

  // Navigation handlers
  const handleBack = useCallback(() => {
    if (mode === MODES.LIST) {
      goBack(navigation);
    } else {
      navigation.setParams({ mode: MODES.LIST, itemId: null, isEdit: false });
    }
  }, [mode, navigation, goBack]);

  const handleAdd = useCallback(() => {
    navigation.setParams({ mode: MODES.FORM, itemId: null, isEdit: false });
  }, [navigation]);

  const handleEdit = useCallback((item) => {
    navigation.setParams({ mode: MODES.FORM, itemId: item.id, isEdit: true });
  }, [navigation]);

  const handleDetail = useCallback((item) => {
    navigation.setParams({ mode: MODES.DETAIL, itemId: item.id });
  }, [navigation]);

  const handleFormSubmit = useCallback((data) => {
    navigation.setParams({ mode: MODES.LIST, itemId: null, isEdit: false });
  }, [navigation]);

  const handleFormCancel = useCallback(() => {
    navigation.setParams({ mode: MODES.LIST, itemId: null, isEdit: false });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchItems();
    } finally {
      setRefreshing(false);
    }
  }, [fetchItems]);

  // Render content based on mode
  const renderContent = () => {
    switch (mode) {
      case MODES.LIST:
        return (
          <EntityList
            entityType={entityType}
            searchQuery={searchQuery}
            onItemPress={handleDetail}
            onEditPress={handleEdit}
            onAddPress={handleAdd}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        );

      case MODES.FORM:
        const initialData = isEdit && currentItem ? currentItem : {};
        return (
          <EntityForm
            entityType={entityType}
            initialData={initialData}
            isEdit={isEdit}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
          />
        );

      case MODES.DETAIL:
        return (
          <EntityDetailView
            entityType={entityType}
            item={currentItem}
            config={config}
            onEdit={handleEdit}
          />
        );

      case MODES.ASSIGN:
        return (
          <AssignView
            kurikulumId={itemId}
            onBack={handleBack}
          />
        );

      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Mode tidak dikenali: {mode}</Text>
          </View>
        );
    }
  };

  if (!config) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Konfigurasi entity tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EntityHeader
        mode={mode}
        config={config}
        onBack={handleBack}
        onAdd={handleAdd}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        isEdit={isEdit}
        currentItem={currentItem}
      />
      
      <View style={styles.content}>
        {renderContent()}
      </View>
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
  content: {
    flex: 1
  },

  // Header
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  backButton: {
    marginRight: 12,
    padding: 4
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white'
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  headerButton: {
    padding: 4
  },

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#212529'
  },

  // Detail View
  detailContainer: {
    flex: 1,
    padding: 16
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4'
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  detailHeaderText: {
    flex: 1
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4
  },
  detailSubtitle: {
    fontSize: 14,
    color: '#6C757D'
  },
  detailContent: {
    padding: 20
  },
  detailField: {
    marginBottom: 16
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6C757D',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 22
  },
  detailActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4'
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  detailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },

  // Detail Loading
  detailLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D'
  },

  // Assign View
  assignContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  assignTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8
  },
  assignSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20
  },
  assignBackButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  assignBackText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  errorText: {
    fontSize: 16,
    color: '#DC3545',
    textAlign: 'center'
  }
});

export default EntityScreen;