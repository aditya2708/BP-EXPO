import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import EmptyState from '../../../../common/components/EmptyState';
import CPBStatusTabs from '../../components/CPBStatusTabs';
import CPBChildCard from '../../components/CPBChildCard';
import {
  fetchCpbReport,
  fetchCpbByStatus,
  initializeCpbLaporanPage,
  fetchCpbTabData,
  exportCpbData
} from '../../redux/cpbLaporanThunks';
import {
  selectCpbSummary,
  selectCpbChildren,
  selectCpbCurrentStatus,
  selectCpbFilters,
  selectCpbActiveTab,
  selectCpbLoading,
  selectCpbChildrenLoading,
  selectCpbError,
  selectCpbChildrenError,
  selectCpbTabCounts,
  selectCpbExportLoading,
  selectCpbExportError,
  setActiveTab,
  setSearch,
  clearAllErrors
} from '../../redux/cpbLaporanSlice';

const CPBReportScreen = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const summary = useSelector(selectCpbSummary);
  const children = useSelector(selectCpbChildren);
  const currentStatus = useSelector(selectCpbCurrentStatus);
  const filters = useSelector(selectCpbFilters);
  const activeTab = useSelector(selectCpbActiveTab);
  const loading = useSelector(selectCpbLoading);
  const childrenLoading = useSelector(selectCpbChildrenLoading);
  const error = useSelector(selectCpbError);
  const childrenError = useSelector(selectCpbChildrenError);
  const tabCounts = useSelector(selectCpbTabCounts);
  const exportLoading = useSelector(selectCpbExportLoading);
  const exportError = useSelector(selectCpbExportError);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Initialize page data
  useEffect(() => {
    dispatch(clearAllErrors());
    dispatch(initializeCpbLaporanPage());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchCpbReport());
      if (currentStatus) {
        await dispatch(fetchCpbByStatus({ 
          status: currentStatus, 
          search: filters.search 
        }));
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Handle tab change
  const handleTabChange = async (status) => {
    dispatch(setActiveTab(status));
    await dispatch(fetchCpbTabData(status));
  };

  // Handle manual search
  const handleSearch = () => {
    if (!searchText.trim()) {
      Alert.alert('Peringatan', 'Masukkan nama anak yang ingin dicari');
      return;
    }
    
    dispatch(setSearch(searchText.trim()));
    if (currentStatus) {
      dispatch(fetchCpbByStatus({ 
        status: currentStatus, 
        search: searchText.trim()
      }));
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    dispatch(setSearch(''));
    if (currentStatus) {
      dispatch(fetchCpbByStatus({ 
        status: currentStatus, 
        search: ''
      }));
    }
  };

  // Handle child press
  const handleChildPress = (child) => {
    console.log('Child pressed:', child.full_name);
  };

  // Handle export
  const handleExport = async () => {
    if (!children.length) {
      Alert.alert('Peringatan', 'Tidak ada data untuk diexport');
      return;
    }

    try {
      await dispatch(exportCpbData({
        status: currentStatus
      })).unwrap();
      Alert.alert('Sukses', 'Data berhasil diexport');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Laporan CPB</Text>
        <TouchableOpacity
          style={[styles.actionButton, exportLoading && styles.actionButtonDisabled]}
          onPress={handleExport}
          disabled={exportLoading || !children.length}
        >
          {exportLoading ? (
            <LoadingSpinner size="small" color="#9b59b6" />
          ) : (
            <Ionicons name="download" size={20} color="#9b59b6" />
          )}
          <Text style={[
            styles.actionButtonText,
            exportLoading && styles.actionButtonTextDisabled
          ]}>
            Export
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Masukkan nama anak..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          editable={!childrenLoading}
        />
        {searchText ? (
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={handleClearSearch}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
        
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!searchText.trim() || childrenLoading) && styles.searchButtonDisabled
          ]}
          onPress={handleSearch}
          disabled={!searchText.trim() || childrenLoading}
        >
          <Text style={[
            styles.searchButtonText,
            (!searchText.trim() || childrenLoading) && styles.searchButtonTextDisabled
          ]}>
            Cari
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clear Search */}
      {filters.search && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={handleClearSearch}
          disabled={childrenLoading}
        >
          <Ionicons name="close-circle" size={16} color="#9b59b6" />
          <Text style={styles.clearFiltersText}>Hapus Pencarian</Text>
        </TouchableOpacity>
      )}

      {/* Export Error */}
      {exportError && (
        <View style={styles.exportErrorContainer}>
          <Text style={styles.exportErrorText}>
            Export gagal: {exportError}
          </Text>
        </View>
      )}
    </View>
  );

  // Loading state
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat laporan CPB..." />;
  }

  // Error state
  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchCpbReport())}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <CPBStatusTabs
        activeTab={activeTab}
        tabCounts={tabCounts}
        onTabChange={handleTabChange}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9b59b6']}
            tintColor="#9b59b6"
          />
        }
      >
        {/* Children Loading */}
        {childrenLoading && (
          <LoadingSpinner message="Memuat data anak..." />
        )}

        {/* Children Error */}
        {childrenError && (
          <ErrorMessage 
            message={childrenError} 
            onRetry={() => dispatch(fetchCpbTabData(activeTab))}
          />
        )}

        {/* Children List */}
        {!childrenLoading && !childrenError && (
          <>
            {children.length === 0 ? (
              <EmptyState
                icon="people-outline"
                title="Tidak ada data"
                message={`Tidak ada anak dengan status ${activeTab}${filters.search ? ' yang sesuai dengan pencarian' : ''}`}
                actionButtonText="Refresh"
                onActionPress={handleRefresh}
              />
            ) : (
              <View style={styles.childrenContainer}>
                <Text style={styles.resultCount}>
                  {children.length} anak ditemukan
                </Text>
                {children.map((child) => (
                  <CPBChildCard
                    key={child.id_anak}
                    child={child}
                    onPress={() => handleChildPress(child)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  actionButtonDisabled: {
    opacity: 0.5
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9b59b6',
    marginLeft: 4
  },
  actionButtonTextDisabled: {
    color: '#999'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef'
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
  clearSearchButton: {
    padding: 4,
    marginRight: 8
  },
  searchButton: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6
  },
  searchButtonDisabled: {
    backgroundColor: '#e9ecef'
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  searchButtonTextDisabled: {
    color: '#999'
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f8f4ff'
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: '500',
    marginLeft: 4
  },
  exportErrorContainer: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 4,
    marginTop: 8
  },
  exportErrorText: {
    fontSize: 12,
    color: '#c62828'
  },
  content: {
    flex: 1
  },
  childrenContainer: {
    padding: 16
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  }
});

export default CPBReportScreen;