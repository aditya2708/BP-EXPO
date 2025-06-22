import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReportFilters = ({
  filters,
  filterOptions,
  onYearChange,
  onActivityTypeChange,
  onClearFilter
}) => {
  const [showYearModal, setShowYearModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const handleYearChange = (year) => {
    setShowYearModal(false);
    onYearChange(year);
  };

  const handleActivityTypeChange = (jenisKegiatan) => {
    setShowActivityModal(false);
    onActivityTypeChange(jenisKegiatan);
  };

  const renderYearModal = () => (
    <Modal
      visible={showYearModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowYearModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pilih Tahun</Text>
            <TouchableOpacity onPress={() => setShowYearModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filterOptions.availableYears}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filters.year === item && styles.modalItemSelected
                ]}
                onPress={() => handleYearChange(item)}
              >
                <Text style={[
                  styles.modalItemText,
                  filters.year === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
                {filters.year === item && (
                  <Ionicons name="checkmark" size={20} color="#9b59b6" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderActivityModal = () => (
    <Modal
      visible={showActivityModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowActivityModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pilih Jenis Kegiatan</Text>
            <TouchableOpacity onPress={() => setShowActivityModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              !filters.jenisKegiatan && styles.modalItemSelected
            ]}
            onPress={() => handleActivityTypeChange(null)}
          >
            <Text style={[
              styles.modalItemText,
              !filters.jenisKegiatan && styles.modalItemTextSelected
            ]}>
              Semua Kegiatan
            </Text>
            {!filters.jenisKegiatan && (
              <Ionicons name="checkmark" size={20} color="#9b59b6" />
            )}
          </TouchableOpacity>
          
          <FlatList
            data={filterOptions.availableActivityTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filters.jenisKegiatan === item && styles.modalItemSelected
                ]}
                onPress={() => handleActivityTypeChange(item)}
              >
                <Text style={[
                  styles.modalItemText,
                  filters.jenisKegiatan === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
                {filters.jenisKegiatan === item && (
                  <Ionicons name="checkmark" size={20} color="#9b59b6" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Laporan</Text>
      
      <View style={styles.filterRow}>
        {/* Year Filter */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowYearModal(true)}
        >
          <Text style={styles.filterButtonText}>
            Tahun: {filters.year}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>

        {/* Activity Type Filter */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowActivityModal(true)}
        >
          <Text style={styles.filterButtonText}>
            {filters.jenisKegiatan || 'Semua Kegiatan'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Clear filters */}
      {filters.jenisKegiatan && (
        <TouchableOpacity 
          style={styles.clearFilterButton}
          onPress={() => onClearFilter()}
        >
          <Ionicons name="close-circle" size={16} color="#9b59b6" />
          <Text style={styles.clearFilterText}>Hapus Filter</Text>
        </TouchableOpacity>
      )}

      {renderYearModal()}
      {renderActivityModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333'
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f8f4ff'
  },
  clearFilterText: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: '500',
    marginLeft: 4
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalItemSelected: {
    backgroundColor: '#f8f4ff'
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  modalItemTextSelected: {
    color: '#9b59b6',
    fontWeight: '600'
  }
});

export default ReportFilters;