import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnakBinaanFilterSection = ({
  visible,
  filters,
  filterOptions,
  onClose,
  onApply,
  onClear
}) => {
  const [tempFilters, setTempFilters] = useState({
    year: null,
    jenisKegiatan: null
  });
  const [showYearModal, setShowYearModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    if (visible) {
      setTempFilters({
        year: filters.year,
        jenisKegiatan: filters.jenisKegiatan
      });
    }
  }, [visible, filters]);

  const handleYearChange = (year) => {
    setShowYearModal(false);
    setTempFilters(prev => ({
      ...prev,
      year
    }));
  };

  const handleActivityChange = (jenisKegiatan) => {
    setShowActivityModal(false);
    setTempFilters(prev => ({
      ...prev,
      jenisKegiatan: prev.jenisKegiatan === jenisKegiatan ? null : jenisKegiatan
    }));
  };

  const handleApply = () => {
    onApply(tempFilters);
  };

  const handleClear = () => {
    setTempFilters({
      year: new Date().getFullYear(),
      jenisKegiatan: null
    });
    onClear();
  };

  const hasActiveFilters = tempFilters.jenisKegiatan;

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
                  tempFilters.year === item && styles.modalItemSelected
                ]}
                onPress={() => handleYearChange(item)}
              >
                <Text style={[
                  styles.modalItemText,
                  tempFilters.year === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
                {tempFilters.year === item && (
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
              !tempFilters.jenisKegiatan && styles.modalItemSelected
            ]}
            onPress={() => handleActivityChange(null)}
          >
            <Text style={[
              styles.modalItemText,
              !tempFilters.jenisKegiatan && styles.modalItemTextSelected
            ]}>
              Semua Kegiatan
            </Text>
            {!tempFilters.jenisKegiatan && (
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
                  tempFilters.jenisKegiatan === item && styles.modalItemSelected
                ]}
                onPress={() => handleActivityChange(item)}
              >
                <Text style={[
                  styles.modalItemText,
                  tempFilters.jenisKegiatan === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
                {tempFilters.jenisKegiatan === item && (
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Laporan Anak Binaan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Year Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tahun</Text>
              
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowYearModal(true)}
              >
                <View style={styles.filterButtonContent}>
                  <Text style={styles.filterLabel}>Tahun</Text>
                  <Text style={styles.filterValue}>
                    {tempFilters.year || 'Pilih tahun'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9b59b6" />
              </TouchableOpacity>
            </View>

            {/* Activity Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Jenis Kegiatan</Text>
              
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowActivityModal(true)}
              >
                <View style={styles.filterButtonContent}>
                  <Text style={styles.filterLabel}>Jenis Kegiatan</Text>
                  <Text style={[
                    styles.filterValue,
                    !tempFilters.jenisKegiatan && styles.filterValuePlaceholder
                  ]}>
                    {tempFilters.jenisKegiatan || 'Semua Kegiatan'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9b59b6" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {hasActiveFilters && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <Text style={styles.clearButtonText}>Hapus Filter</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Terapkan Filter</Text>
            </TouchableOpacity>
          </View>

          {renderYearModal()}
          {renderActivityModal()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  content: {
    paddingHorizontal: 20
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  filterButtonContent: {
    flex: 1
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  filterValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  filterValuePlaceholder: {
    color: '#999'
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9b59b6'
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9b59b6'
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#9b59b6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center'
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
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

export default AnakBinaanFilterSection;