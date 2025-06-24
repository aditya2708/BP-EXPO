import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput
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
  selectCpbError,
  selectCpbChildrenError,
  selectCpbHasActiveFilters,
  selectCpbTabCounts,
  selectCpbExportLoading,
  selectCpbExportError,
  selectCpbErrorDetails,
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
  const error = useSelector(selectCpbError);
  const childrenError = useSelector(selectCpbChildrenError);
  const hasActiveFilters = useSelector(selectCpbHasActiveFilters);
  const tabCounts = useSelector(selectCpbTabCounts);
  const exportLoading = useSelector(selectCpbExportLoading);
  const exportError = useSelector(selectCpbExportError);
  const errorDetails = useSelector(selectCpbErrorDetails);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Initialize page data
  useEffect(() => {
    dispatch(clearAllErrors()); // Clear any previous errors
    dispatch(initializeCpbLaporanPage());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchCpbReport(filters));
      if (currentStatus) {
        await dispatch(fetchCpbByStatus({ 
          status: currentStatus, 
          ...filters,
          search: searchText 
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

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    dispatch(updateCpbFiltersAndRefresh(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    dispatch(updateCpbFiltersAndRefresh({}));
  };

  // Handle search
  const handleSearchChange = (text) => {
    setSearchText(text);
    dispatch(setSearch(text));
    
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (currentStatus) {
        dispatch(fetchCpbByStatus({ 
          status: currentStatus, 
          ...filters,
          search: text 
        }));
      }
    }, 500);
  };

  let searchTimeout;

  // Handle child press
  const handleChildPress = (child) => {
    // TODO: Navigate to child detail screen
    console.log('Child pressed:', child.full_name);
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
              <Text style={styles.errorDetail}>
                Child ID: {details.child_id}
              </Text>
            )}
            {details.child_name && (
              <Text style={styles.errorDetail}>
                Child Name: {details.child_name}
              </Text>
            )}
            {details.error_message && (
              <Text style={styles.errorDetail}>
                Error: {details.error_message}
              </Text>
            )}
            {details.file && details.line && (
              <Text style={styles.errorDetail}>
                Location: {details.file}:{details.line}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  // Handle export
  const handleExport = async () => {
    try {
      await dispatch(exportCpbData({
        status: currentStatus,
        ...filters
      })).unwrap();
      // TODO: Show success message or download file
      console.log('Export successful');
    } catch (error) {
      console.error('Export failed:', error);
      // Error is already handled in Redux state
    }
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Laporan CPB</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={hasActiveFilters ? '#9b59b6' : '#666'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exportButton, exportLoading && styles.exportButtonDisabled]}
            onPress={handleExport}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <Ionicons name="hourglass" size={20} color="#9b59b6" />
            ) : (
              <Ionicons name="download" size={20} color="#9b59b6" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama anak..."
          value={searchText}
          onChangeText={handleSearchChange}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => handleSearchChange('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={handleClearFilters}
        >
          <Ionicons name="close-circle" size={16} color="#9b59b6" />
          <Text style={styles.clearFiltersText}>Hapus Filter</Text>
        </TouchableOpacity>
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
                    onExport={() => console.log('Export child:', child.id_anak)}
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
    gap: 12
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa'
  },
  exportButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa'
  },
  exportButtonDisabled: {
    opacity: 0.5
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8
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