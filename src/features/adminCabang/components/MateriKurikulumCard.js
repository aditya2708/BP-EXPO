import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MateriKurikulumCard = ({ kurikulumMateri, onEdit, onDelete, onMoveUp, onMoveDown }) => {
  // Safe access with fallbacks
  const materiItem = kurikulumMateri || {};
  const materi = materiItem.materi || {};
  const mataPelajaran = materiItem.mataPelajaran || materiItem.mata_pelajaran || {};
  const kelas = materi.kelas || {};
  const jenjang = mataPelajaran.jenjang || {};

  const getKategoriColor = (kategori) => {
    switch (kategori) {
      case 'wajib': return '#e74c3c';
      case 'pilihan': return '#3498db';
      case 'muatan_lokal': return '#f39c12';
      case 'ekstrakurikuler': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getKategoriText = (kategori) => {
    switch (kategori) {
      case 'wajib': return 'Wajib';
      case 'pilihan': return 'Pilihan';
      case 'muatan_lokal': return 'Muatan Lokal';
      case 'ekstrakurikuler': return 'Ekstrakurikuler';
      default: return kategori || 'Umum';
    }
  };

  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getKelasDisplayName = () => {
    if (!kelas) return 'N/A';
    
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas || 'N/A';
  };

  const getHierarchyPath = () => {
    const jenjangName = jenjang.nama_jenjang || 'N/A';
    const mataPelajaranName = mataPelajaran.nama_mata_pelajaran || 'N/A';
    const kelasName = getKelasDisplayName();
    
    return `${jenjangName} > ${mataPelajaranName} > ${kelasName}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.materiInfo}>
          <Text style={styles.materiTitle} numberOfLines={2}>
            {materi.nama_materi || 'Materi Tidak Dikenal'}
          </Text>
          <Text style={styles.hierarchyPath} numberOfLines={1}>
            {getHierarchyPath()}
          </Text>
          {materiItem.urutan && (
            <Text style={styles.urutanText}>Urutan: {materiItem.urutan}</Text>
          )}
        </View>
        
        {mataPelajaran.kategori && (
          <View style={[
            styles.kategoriTag,
            { backgroundColor: getKategoriColor(mataPelajaran.kategori) }
          ]}>
            <Text style={styles.kategoriText}>
              {getKategoriText(mataPelajaran.kategori)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.actionButtons}>
          {onMoveUp && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onMoveUp}
            >
              <Ionicons name="chevron-up" size={16} color="#6c757d" />
            </TouchableOpacity>
          )}
          
          {onMoveDown && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onMoveDown}
            >
              <Ionicons name="chevron-down" size={16} color="#6c757d" />
            </TouchableOpacity>
          )}
          
          {onEdit && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onEdit}
            >
              <Ionicons name="create-outline" size={16} color="#007bff" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={16} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  materiInfo: {
    flex: 1,
    marginRight: 12,
  },
  materiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hierarchyPath: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  urutanText: {
    fontSize: 11,
    color: '#28a745',
    fontWeight: '500',
  },
  kategoriTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  kategoriText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffeaea',
  },
});

export default MateriKurikulumCard;