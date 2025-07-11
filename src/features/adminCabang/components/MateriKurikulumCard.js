import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MateriKurikulumCard = ({ materiItem, onEdit, onDelete, onMoveUp, onMoveDown }) => {
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
      default: return kategori;
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
    if (!materiItem.materi?.kelas) return 'N/A';
    
    const kelas = materiItem.materi.kelas;
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas;
  };

  const getHierarchyPath = () => {
    const jenjang = materiItem.mata_pelajaran?.jenjang?.nama_jenjang || 'N/A';
    const mataPelajaran = materiItem.mata_pelajaran?.nama_mata_pelajaran || 'N/A';
    const kelas = getKelasDisplayName();
    
    return `${jenjang} > ${mataPelajaran} > ${kelas}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.materiInfo}>
          <Text style={styles.materiTitle} numberOfLines={2}>
            {materiItem.materi?.nama_materi || 'N/A'}
          </Text>
          <Text style={styles.hierarchyPath} numberOfLines={1}>
            {getHierarchyPath()}
          </Text>
        </View>
        
        {materiItem.mata_pelajaran?.kategori && (
          <View style={[
            styles.kategoriTag,
            { backgroundColor: getKategoriColor(materiItem.mata_pelajaran.kategori) }
          ]}>
            <Text style={styles.kategoriText}>
              {getKategoriText(materiItem.mata_pelajaran.kategori)}
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
              style={[styles.actionButton, styles.deleteButton]}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa'
  },
  materiInfo: {
    flex: 1,
    marginBottom: 8
  },
  materiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    lineHeight: 22
  },
  hierarchyPath: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4
  },
  kategoriTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8
  },
  kategoriText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500'
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#fecaca'
  }
});

export default MateriKurikulumCard;