import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import EmptyState from '../../../../common/components/EmptyState';
import ReportFilters from '../../components/ReportFilters';
import RaportSummaryCards from '../../components/RaportSummaryCards';
import RaportCard from '../../components/RaportCard';

import {
  selectRaportLaporanState,
  selectChildren,
  selectSummary,
  selectFilterOptions,
  selectFilters,
  selectLoading,
  selectError,
  selectInitializingPage,
  selectExpandedCards,
  setFilters,
  resetFilters,
  toggleCardExpanded,
  expandAllCards,
  collapseAllCards,
  clearError
} from '../../redux/raportLaporanSlice';

import {
  initializeRaportLaporanPage,
  updateFiltersAndRefresh,
  fetchChildDetailRaport
} from '../../redux/raportLaporanThunks';

const LaporanRaportAnakScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Redux state
  const children = useSelector(selectChildren);
  const summary = useSelector(selectSummary);
  const filterOptions = useSelector(selectFilterOptions);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const initializingPage = useSelector(selectInitializingPage);
  const expandedCards = useSelector(selectExpandedCards);

  useEffect(() => {
    dispatch(initializeRaportLaporanPage());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(updateFiltersAndRefresh(filters)).unwrap();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(updateFiltersAndRefresh(newFilters));
    setShowFilterModal(false);
  };

  const handleSemesterChange = (semester_id) => {
    handleFilterChange({ semester_id });
  };

  const handleTahunAjaranChange = (tahun_ajaran) => {
    handleFilterChange({ tahun_ajaran });
  };

  const handleMataPelajaranChange = (mata_pelajaran) => {
    handleFilterChange({ mata_pelajaran });
  };

  const handleStatusChange = (status) => {
    handleFilterChange({ status });
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    dispatch(updateFiltersAndRefresh({}));
    setShowFilterModal(false);
  };

  const handleCardToggle = (childId) => {
    dispatch(toggleCardExpanded(childId));
  };

  const handleExpandAll = () => {
    dispatch(expandAllCards());
  };

  const handleCollapseAll = () => {
    dispatch(collapseAllCards());
  };

  const handleViewChildDetail = (childId) => {
    navigation.navigate('RaportChildDetail', { 
      childId,
      filters: filters
    });
  };

  const handleRaportDetail = async (childId, raportId) => {
    navigation.navigate('RaportChildDetail', { 
      childId, 
      filters: filters
    });
  };

  const renderChild = ({ item }) => (
    <RaportCard
      child={item}
      expanded={expandedCards.includes(item.id_anak)}
      onToggle={() => handleCardToggle(item.id_anak)}
      onViewDetail={() => handleViewChildDetail(item.id_anak)}
      onRaportDetail={handleRaportDetail}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#9b59b6" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>

        <View style={styles.filterActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExpandAll}
          >
            <Text style={styles.actionButtonText}>Expand All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCollapseAll}
          >
            <Text style={styles.actionButtonText}>Collapse All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Cards */}
      {summary && (
        <RaportSummaryCards summary={summary} />
      )}

      {/* Applied Filters Info */}
      {(filters.semester_id || filters.tahun_ajaran || filters.mata_pelajaran || filters.status) && (
        <View style={styles.appliedFilters}>
          <Text style={styles.appliedFiltersText}>
            Filters applied: {Object.values(filters).filter(Boolean).length}
          </Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Anak Binaan ({children.length})
      </Text>
    </View>
  );

  if (initializingPage) {
    return (
      <LoadingSpinner 
        fullScreen 
        message="Memuat laporan raport..." 
      />
    );
  }

  if (error && !children.length) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(initializeRaportLaporanPage())}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        renderItem={renderChild}
        keyExtractor={(item) => item.id_anak.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Tidak Ada Data Raport"
            message="Belum ada data raport untuk filter yang dipilih"
            onRetry={handleRefresh}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9b59b6']}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Laporan Raport</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ReportFilters
              filters={filters}
              filterOptions={{
                availableYears: filterOptions.tahunAjaran,
                availableActivityTypes: filterOptions.mataPelajaran,
                availableSemesters: filterOptions.semesters,
                availableStatus: filterOptions.statusOptions
              }}
              onSemesterChange={handleSemesterChange}
              onYearChange={handleTahunAjaranChange}
              onActivityTypeChange={handleMataPelajaranChange}
              onStatusChange={handleStatusChange}
              onClearFilter={handleClearFilters}
              showSemesterFilter={true}
              showStatusFilter={true}
            />
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Memuat data..." />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  listContainer: {
    paddingBottom: 20
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9b59b6'
  },
  filterButtonText: {
    color: '#9b59b6',
    fontWeight: '500',
    marginLeft: 8
  },
  filterActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  appliedFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e8f4fd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  appliedFiltersText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500'
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '500'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default LaporanRaportAnakScreen;