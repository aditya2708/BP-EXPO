// src/features/adminCabang/components/akademik/MateriAssignmentModal.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchAvailableMateri, assignMateriToKurikulum } from '../../redux/akademik/kurikulumSlice';
import CascadeSelector from '../masterData/CascadeSelector';

const MateriAssignmentModal = ({
  visible,
  onClose,
  kurikulumId,
  onAssignSuccess
}) => {
  const dispatch = useDispatch();
  const { availableMateri, loading } = useSelector(state => state.kurikulum);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filteredMateri, setFilteredMateri] = useState([]);

  useEffect(() => {
    if (visible && kurikulumId) {
      dispatch(fetchAvailableMateri(kurikulumId));
    }
  }, [visible, kurikulumId, dispatch]);

  useEffect(() => {
    let filtered = availableMateri || [];

    // Filter by cascade selection
    if (filterData.jenjang) {
      filtered = filtered.filter(item => item.jenjang_id === filterData.jenjang);
    }
    if (filterData.mataPelajaran) {
      filtered = filtered.filter(item => item.mata_pelajaran_id === filterData.mataPelajaran);
    }
    if (filterData.kelas) {
      filtered = filtered.filter(item => item.kelas_id === filterData.kelas);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mata_pelajaran?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kelas_nama?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMateri(filtered);
  }, [availableMateri, filterData, searchQuery]);

  const handleItemSelect = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id_materi === item.id_materi);
      if (isSelected) {
        return prev.filter(selected => selected.id_materi !== item.id_materi);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMateri.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...filteredMateri]);
    }
  };

  const handleAssign = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Peringatan', 'Pilih minimal satu materi untuk ditambahkan');
      return;
    }

    try {
      const materiIds = selectedItems.map(item => item.id_materi);
      await dispatch(assignMateriToKurikulum({ 
        kurikulumId, 
        materiIds 
      })).unwrap();
      
      onAssignSuccess && onAssignSuccess(selectedItems);
      handleClose();
      Alert.alert('Berhasil', `${selectedItems.length} materi berhasil ditambahkan`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal menambahkan materi');
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedItems([]);
    setFilterData({});
    onClose();
  };

  const renderMateriItem = ({ item }) => {
    const isSelected = selectedItems.find(selected => selected.id_materi === item.id_materi);
    
    return (
      <TouchableOpacity 
        style={[styles.materiItem, isSelected && styles.materiItemSelected]}
        onPress={() => handleItemSelect(item)}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.nama}</Text>
            <View style={styles.checkboxContainer}>
              <Ionicons 
                name={isSelected ? "checkbox" : "square-outline"} 
                size={24} 
                color={isSelected ? "#007bff" : "#adb5bd"} 
              />
            </View>
          </View>
          
          <View style={styles.itemMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="book" size={14} color="#666" />
              <Text style={styles.metaText}>{item.mata_pelajaran}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="library" size={14} color="#666" />
              <Text style={styles.metaText}>{item.kelas_nama} - {item.tingkat}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Tambah Materi</Text>
          <TouchableOpacity 
            style={styles.assignButton}
            onPress={handleAssign}
            disabled={selectedItems.length === 0}
          >
            <Text style={[
              styles.assignButtonText,
              selectedItems.length === 0 && styles.assignButtonTextDisabled
            ]}>
              Tambah ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari materi..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          
          <CascadeSelector
            value={filterData}
            onChange={setFilterData}
            showMateri={false}
            placeholder={{
              jenjang: "Filter Jenjang",
              mataPelajaran: "Filter Mata Pelajaran", 
              kelas: "Filter Kelas"
            }}
            style={styles.cascadeFilter}
          />
        </View>

        <View style={styles.listHeader}>
          <TouchableOpacity 
            style={styles.selectAllButton}
            onPress={handleSelectAll}
          >
            <Ionicons 
              name={selectedItems.length === filteredMateri.length ? "checkbox" : "square-outline"} 
              size={20} 
              color="#007bff" 
            />
            <Text style={styles.selectAllText}>
              {selectedItems.length === filteredMateri.length ? 'Batalkan Semua' : 'Pilih Semua'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.countText}>
            {filteredMateri.length} materi tersedia
          </Text>
        </View>

        <FlatList
          data={filteredMateri}
          renderItem={renderMateriItem}
          keyExtractor={(item) => item.id_materi.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  assignButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  assignButtonTextDisabled: {
    opacity: 0.5,
  },
  filterSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  cascadeFilter: {
    marginTop: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  materiItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  materiItemSelected: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  checkboxContainer: {
    padding: 4,
  },
  itemMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
});

export default MateriAssignmentModal;