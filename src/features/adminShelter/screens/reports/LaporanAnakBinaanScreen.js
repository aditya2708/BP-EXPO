import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import EmptyState from '../../../../common/components/EmptyState';
import ReportFilters from '../../components/ReportFilters';
import ChildAttendanceCard from '../../components/ChildAttendanceCard';
import { formatPercentage } from '../../utils/reportUtils';
import {
  fetchLaporanAnakBinaan,
  initializeLaporanPage,
  updateFiltersAndRefresh
} from '../../redux/laporanThunks';
import {
  selectChildren,
  selectSummary,
  selectFilterOptions,
  selectFilters,
  selectExpandedCards,
  selectLoading,
  selectError,
  toggleCardExpanded
} from '../../redux/laporanSlice';

const LaporanAnakBinaanScreen = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const children = useSelector(selectChildren);
  const summary = useSelector(selectSummary);
  const filterOptions = useSelector(selectFilterOptions);
  const filters = useSelector(selectFilters);
  const expandedCards = useSelector(selectExpandedCards);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);

  // Initialize page data
  useEffect(() => {
    dispatch(initializeLaporanPage());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchLaporanAnakBinaan(filters));
    } finally {
      setRefreshing(false);
    }
  };

  // Handle filter changes
  const handleYearChange = (year) => {
    dispatch(updateFiltersAndRefresh({ year }));
  };

  const handleActivityTypeChange = (jenisKegiatan) => {
    dispatch(updateFiltersAndRefresh({ jenisKegiatan }));
  };

  const handleClearFilter = () => {
    dispatch(updateFiltersAndRefresh({ jenisKegiatan: null }));
  };

  // Handle card expand/collapse
  const handleCardToggle = (childId) => {
    dispatch(toggleCardExpanded(childId));
  };

  // Handle child press (for future navigation to detail)
  const handleChildPress = (child) => {
    // TODO: Navigate to child detail screen
    console.log('Child pressed:', child.full_name);
  };

  // Render summary stats
  const renderSummary = () => {
    if (!summary) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Ringkasan</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.total_children}</Text>
            <Text style={styles.summaryLabel}>Total Anak</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatPercentage(summary.average_attendance)}%</Text>
            <Text style={styles.summaryLabel}>Rata-rata</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.total_activities}</Text>
            <Text style={styles.summaryLabel}>Aktivitas</Text>
          </View>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat laporan..." />;
  }

  // Error state
  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchLaporanAnakBinaan(filters))}
        />
      </View>
    );
  }

  // Empty state
  if (!loading && children.length === 0 && !error) {
    return (
      <View style={styles.container}>
        <ReportFilters
          filters={filters}
          filterOptions={filterOptions}
          onYearChange={handleYearChange}
          onActivityTypeChange={handleActivityTypeChange}
          onClearFilter={handleClearFilter}
        />
        <EmptyState
          icon="people-outline"
          title="Tidak ada data"
          message="Tidak ada data anak binaan untuk filter yang dipilih"
          actionButtonText="Refresh"
          onActionPress={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9b59b6']}
            tintColor="#9b59b6"
          />
        }
      >
        <ReportFilters
          filters={filters}
          filterOptions={filterOptions}
          onYearChange={handleYearChange}
          onActivityTypeChange={handleActivityTypeChange}
          onClearFilter={handleClearFilter}
        />
        
        {renderSummary()}
        
        {/* Children list */}
        <View style={styles.childrenContainer}>
          <Text style={styles.sectionTitle}>Daftar Anak Binaan</Text>
          {children.map((child) => (
            <ChildAttendanceCard
              key={child.id_anak}
              child={child}
              isExpanded={expandedCards.includes(child.id_anak)}
              onToggle={() => handleCardToggle(child.id_anak)}
              onChildPress={handleChildPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },

  // Summary styles
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9b59b6'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },

  // Children list styles
  childrenContainer: {
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  }
});

export default LaporanAnakBinaanScreen;