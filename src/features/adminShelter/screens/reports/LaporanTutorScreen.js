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
import TutorAttendanceCard from '../../components/TutorAttendanceCard';
import { formatPercentage } from '../../utils/reportUtils';
import {
  fetchLaporanTutor,
  initializeTutorLaporanPage,
  updateTutorFiltersAndRefresh
} from '../../redux/tutorLaporanThunks';
import {
  selectTutors,
  selectTutorSummary,
  selectTutorFilterOptions,
  selectTutorFilters,
  selectTutorExpandedCards,
  selectTutorLoading,
  selectTutorError,
  toggleCardExpanded
} from '../../redux/tutorLaporanSlice';

const LaporanTutorScreen = () => {
  const dispatch = useDispatch();
  
  const tutors = useSelector(selectTutors);
  const summary = useSelector(selectTutorSummary);
  const filterOptions = useSelector(selectTutorFilterOptions);
  const filters = useSelector(selectTutorFilters);
  const expandedCards = useSelector(selectTutorExpandedCards);
  const loading = useSelector(selectTutorLoading);
  const error = useSelector(selectTutorError);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(initializeTutorLaporanPage());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchLaporanTutor(filters));
    } finally {
      setRefreshing(false);
    }
  };

  const handleYearChange = (year) => {
    dispatch(updateTutorFiltersAndRefresh({ year }));
  };

  const handleActivityTypeChange = (jenisKegiatan) => {
    dispatch(updateTutorFiltersAndRefresh({ jenisKegiatan }));
  };

  const handleMapelChange = (maple) => {
    dispatch(updateTutorFiltersAndRefresh({ maple }));
  };

  const handleClearFilter = () => {
    dispatch(updateTutorFiltersAndRefresh({ jenisKegiatan: null, maple: null }));
  };

  const handleCardToggle = (tutorId) => {
    dispatch(toggleCardExpanded(tutorId));
  };

  const handleTutorPress = (tutor) => {
    console.log('Tutor pressed:', tutor.nama);
  };

  const renderSummary = () => {
    if (!summary) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Ringkasan</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.total_tutors}</Text>
            <Text style={styles.summaryLabel}>Total Tutor</Text>
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

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat laporan tutor..." />;
  }

  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchLaporanTutor(filters))}
        />
      </View>
    );
  }

  if (!loading && tutors.length === 0 && !error) {
    return (
      <View style={styles.container}>
        <ReportFilters
          filters={filters}
          filterOptions={filterOptions}
          onYearChange={handleYearChange}
          onActivityTypeChange={handleActivityTypeChange}
          onMapelChange={handleMapelChange}
          onClearFilter={handleClearFilter}
          showMapelFilter={true}
        />
        <EmptyState
          icon="school-outline"
          title="Tidak ada data"
          message="Tidak ada data tutor untuk filter yang dipilih"
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
          onMapelChange={handleMapelChange}
          onClearFilter={handleClearFilter}
          showMapelFilter={true}
        />
        
        {renderSummary()}
        
        <View style={styles.tutorsContainer}>
          <Text style={styles.sectionTitle}>Daftar Tutor</Text>
          {tutors.map((tutor) => (
            <TutorAttendanceCard
              key={tutor.id_tutor}
              tutor={tutor}
              isExpanded={expandedCards.includes(tutor.id_tutor)}
              onToggle={() => handleCardToggle(tutor.id_tutor)}
              onTutorPress={handleTutorPress}
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
  tutorsContainer: {
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  }
});

export default LaporanTutorScreen;