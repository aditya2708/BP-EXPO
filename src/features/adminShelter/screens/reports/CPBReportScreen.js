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
import CPBFilters from '../../components/CPBFilters';
import {
  fetchCpbReport,
  fetchCpbByStatus,
  initializeCpbLaporanPage,
  updateCpbFiltersAndRefresh,
  fetchCpbTabData,
  fetchCpbFilterOptions,
  exportCpbData
} from '../../redux/cpbLaporanThunks';
import {
  selectCpbSummary,
  selectCpbChildren,
  selectCpbCurrentStatus,
  selectCpbFilterOptions,
  selectCpbFilters,
  selectCpbActiveTab,
  selectCpbLoading,
  selectCpbChildrenLoading,
  selectCpbFilterOptionsLoading,
  selectCpbError,
  selectCpbChildrenError,
  selectCpbFilterOptionsError,
  selectCpbHasActiveFilters,
  selectCpbTabCounts,
  selectCpbExportLoading,
  selectCpbExportError,
  selectCpbErrorDetails,
  selectCpbFilterOptionsDebug,
  setActiveTab,
  setSearch,
  resetFilters,
  clearAllErrors
} from '../../redux/cpbLaporanSlice';

const CPBReportScreen = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const summary = useSelector(selectCpbSummary);
  const children = useSelector(selectCpbChildren);
  const currentStatus = useSelector(selectCpbCurrentStatus);
  const filterOptions = useSelector(selectCpbFilterOptions);
  const filters = useSelector(selectCpbFilters);
  const activeTab = useSelector(selectCpbActiveTab);
  const loading = useSelector(selectCpbLoading);
  const childrenLoading = useSelector(selectCpbChildrenLoading);
  const filterOptionsLoading = useSelector(selectCpbFilterOptionsLoading);
  const error = useSelector(selectCpbError);
  const childrenError = useSelector(selectCpbChildrenError);
  const filterOptionsError = useSelector(selectCpbFilterOptionsError);
  const hasActiveFilters = useSelector(selectCpbHasActiveFilters);
  const tabCounts = useSelector(selectCpbTabCounts);
  const exportLoading = useSelector(selectCpbExportLoading);
  const exportError = useSelector(selectCpbExportError);
  const errorDetails = useSelector(selectCpbErrorDetails);
  const filterOptionsDebug = useSelector(selectCpbFilterOptionsDebug);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Initialize page data
  useEffect(() => {
    dispatch(clearAllErrors());
    dispatch(initializeCpbLaporanPage());
  }, [dispatch]);

  // Debug log for filter options
  useEffect(() => {
    if (__DEV__) {
      console.log('CPB Filter Options Debug:', filterOptionsDebug);
    }
  }, [filterOptionsDebug]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchCpbReport(filters));
      if (currentStatus) {
        await dispatch(fetchCpbByStatus({ 
          status: currentStatus, 
          ...filters,
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

  // Handle filter modal open
  const handleOpenFilters = async () => {
    // Ensure filter options are loaded before showing modal
    if (!filterOptionsLoading && !filterOptionsError && 
        (!filterOptions.jenisKelamin?.length && 
         !filterOptions.kelas?.length && 
         !filterOptions.statusOrangTua?.length)) {
      // Try to fetch filter options if they seem empty
      await dispatch(fetchCpbFilterOptions());
    }
    setShowFilters(true);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    dispatch(updateCpbFiltersAndRefresh(newFilters));
  };

  const handleClearFilters = () => {
    setSearchText('');
    dispatch(resetFilters());
    dispatch(updateCpbFiltersAndRefresh({}));
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
        ...filters,
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
        ...filters,
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
        status: currentStatus,
        ...filters
      })).unwrap();
      Alert.alert('Sukses', 'Data berhasil diexport');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Render detailed error message
  const renderDetailedError = (error, details = null) => {
    if (!error) return null;

    return (
      <View style={styles.detailedErrorContainer}>
        <Text style={styles.errorTitle}>Error Details:</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        
        {details && (
          <View style={styles.errorDetailsContainer}>
            {details.child_id && (
              <Text style={styles.errorDetail}>Child ID: {details.child_id}</Text>
            )}
            {details.child_name && (
              <Text style={styles.errorDetail}>Child Name: {details.child_name}</Text>
            )}
            {details.error_message && (
              <Text style={styles.errorDetail}>Error: {details.error_message}</Text>
            )}
            {details.file && details.line && (
              <Text style={styles.errorDetail}>Location: {details.file}:{details.line}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Laporan CPB</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionButton, hasActiveFilters && styles.actionButtonActive]}
            onPress={handleOpenFilters}
            disabled={childrenLoading}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={hasActiveFilters ? '#fff' : '#9b59b6'} 
            />
            <Text style={[
              styles.actionButtonText,
              hasActiveFilters && styles.actionButtonTextActive
            ]}>
              Filter
            </Text>
          </TouchableOpacity>

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

      {/* Clear Filters */}
      {(hasActiveFilters || filters.search) && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={handleClearFilters}
          disabled={childrenLoading}
        >
          <Ionicons name="close-circle" size={16} color="#9b59b6" />
          <Text style={styles.clearFiltersText}>
            {filters.search ? 'Hapus Pencarian & Filter' : 'Hapus Filter'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Debug Filter Options - Remove in production */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Filter Debug: Loading={filterOptionsLoading ? 'Y' : 'N'}, 
            Error={filterOptionsError ? 'Y' : 'N'}, 
            Data={filterOptionsDebug.hasJenisKelamin || filterOptionsDebug.hasKelas || filterOptionsDebug.hasStatusOrangTua ? 'Y' : 'N'}
          </Text>
        </View>
      )}

      {/* Export Error */}
      {exportError && (
        <View style={styles.exportErrorContainer}>
          <Text style={styles.exportErrorText}>
            Export gagal: {exportError}
          </Text>
          {errorDetails && (
            <TouchableOpacity 
              style={styles.errorDetailsToggle}
              onPress={() => setShowErrorDetails(!showErrorDetails)}
            >
              <Text style={styles.errorDetailsToggleText}>
                {showErrorDetails ? 'Sembunyikan' : 'Lihat'} Detail Error
              </Text>
            </TouchableOpacity>
          )}
          {showErrorDetails && renderDetailedError(exportError, errorDetails)}
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
          onRetry={() => dispatch(fetchCpbReport(filters))}
        />
        {errorDetails && (
          <View style={styles.errorDetailsContainer}>
            {renderDetailedError(error, errorDetails)}
          </View>
        )}
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
                message={`Tidak ada anak dengan status ${activeTab} untuk filter yang dipilih`}
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

      <CPBFilters
        visible={showFilters}
        filters={filters}
        filterOptions={filterOptions}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterChange}
        onClear={handleClearFilters}
      />
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
  headerActions: {
    flexDirection: 'row',
    gap: 8
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
  actionButtonActive: {
    backgroundColor: '#9b59b6',
    borderColor: '#9b59b6'
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
  actionButtonTextActive: {
    color: '#fff'
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
  debugContainer: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7'
  },
  debugText: {
    fontSize: 12,
    color: '#856404'
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
  errorDetailsToggle: {
    marginTop: 4,
    padding: 4
  },
  errorDetailsToggleText: {
    fontSize: 11,
    color: '#1976d2',
    textDecorationLine: 'underline'
  },
  detailedErrorContainer: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800'
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 8
  },
  errorMessage: {
    fontSize: 12,
    color: '#bf360c',
    marginBottom: 8
  },
  errorDetailsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4
  },
  errorDetail: {
    fontSize: 11,
    color: '#424242',
    marginBottom: 4,
    fontFamily: 'monospace'
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