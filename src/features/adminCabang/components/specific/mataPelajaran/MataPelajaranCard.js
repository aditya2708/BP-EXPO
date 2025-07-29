import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MataPelajaranCard = ({ 
  item, 
  onPress, 
  onEdit, 
  onDelete,
  showActions = true
}) => {
  const getKategoriColor = (kategori) => {
    const colors = {
      'wajib': '#007bff',
      'muatan_lokal': '#28a745',
      'pengembangan_diri': '#17a2b8',
      'pilihan': '#ffc107',
      'ekstrakurikuler': '#6f42c1'
    };
    return colors[kategori] || '#6c757d';
  };

  const getKategoriLabel = (kategori) => {
    const labels = {
      'wajib': 'Wajib',
      'muatan_lokal': 'Muatan Lokal',
      'pengembangan_diri': 'Pengembangan Diri',
      'pilihan': 'Pilihan',
      'ekstrakurikuler': 'Ekstrakurikuler'
    };
    return labels[kategori] || kategori;
  };

  const getStatusColor = (status) => {
    return status === 'aktif' ? '#d4edda' : '#f8d7da';
  };

  const getStatusTextColor = (status) => {
    return status === 'aktif' ? '#155724' : '#721c24';
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.kode}>{item.kode_mata_pelajaran}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusTextColor(item.status) }
            ]}>
              {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.kategoriBadge,
          { backgroundColor: getKategoriColor(item.kategori) + '20' }
        ]}>
          <Text style={[
            styles.kategoriText,
            { color: getKategoriColor(item.kategori) }
          ]}>
            {getKategoriLabel(item.kategori)}
          </Text>
        </View>
      </View>

      <Text style={styles.nama}>{item.nama_mata_pelajaran}</Text>
      
      {item.jenjang && (
        <View style={styles.jenjangInfo}>
          <Ionicons name="library-outline" size={14} color="#666" />
          <Text style={styles.jenjangText}>{item.jenjang.nama_jenjang}</Text>
        </View>
      )}

      {item.deskripsi && (
        <Text style={styles.deskripsi} numberOfLines={2}>
          {item.deskripsi}
        </Text>
      )}

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.statText}>
            {item.materi?.length || item.materi_count || 0} Materi
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="school-outline" size={16} color="#666" />
          <Text style={styles.statText}>
            {item.kurikulum_materi?.length || item.kurikulum_count || 0} Kurikulum
          </Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(item)}
            >
              <Ionicons name="create-outline" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(item)}
            >
              <Ionicons name="trash-outline" size={18} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  kode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginRight: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600'
  },
  kategoriBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8
  },
  kategoriText: {
    fontSize: 11,
    fontWeight: '600'
  },
  nama: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  jenjangInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  jenjangText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontStyle: 'italic'
  },
  deskripsi: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 12
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  editButton: {
    backgroundColor: '#cce5ff'
  },
  deleteButton: {
    backgroundColor: '#f5c6cb'
  }
});

export default MataPelajaranCard;