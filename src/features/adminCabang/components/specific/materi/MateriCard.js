import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MateriCard = ({ 
  item, 
  onPress, 
  onEdit, 
  onDelete,
  showActions = true
}) => {
  const hasKurikulumUsage = item.kurikulum_materi_count > 0;
  const jenjangInfo = item.kelas?.jenjang || item.mata_pelajaran?.jenjang;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      {/* Header with Dependency Path */}
      <View style={styles.header}>
        <View style={styles.dependencyPath}>
          {jenjangInfo && (
            <View style={styles.pathItem}>
              <Text style={styles.pathText}>{jenjangInfo.kode_jenjang}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={12} color="#666" />
          
          <View style={styles.pathItem}>
            <Text style={styles.pathText}>
              {item.mata_pelajaran?.kode_mata_pelajaran || 'MP'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={12} color="#666" />
          
          <View style={styles.pathItem}>
            <Text style={styles.pathText}>
              {item.kelas?.nama_kelas || 'Kelas'}
            </Text>
          </View>
        </View>

        {hasKurikulumUsage && (
          <View style={styles.usageBadge}>
            <Ionicons name="link" size={12} color="#28a745" />
            <Text style={styles.usageText}>{item.kurikulum_materi_count}</Text>
          </View>
        )}
      </View>

      {/* Materi Name */}
      <Text style={styles.nama}>{item.nama_materi}</Text>
      
      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="book-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {item.mata_pelajaran?.nama_mata_pelajaran || 'Mata Pelajaran'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {item.kelas?.nama_kelas || 'Kelas'} 
            {item.kelas?.jenis_kelas && ` (${item.kelas.jenis_kelas})`}
          </Text>
        </View>
      </View>

      {/* Category and Jenjang Info */}
      <View style={styles.meta}>
        {item.mata_pelajaran?.kategori && (
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.mata_pelajaran.kategori) }
          ]}>
            <Text style={styles.categoryText}>
              {getCategoryLabel(item.mata_pelajaran.kategori)}
            </Text>
          </View>
        )}
        
        {jenjangInfo && (
          <Text style={styles.jenjangText}>
            {jenjangInfo.nama_jenjang}
          </Text>
        )}
      </View>

      {/* Validation Warnings */}
      {item.validation_warnings?.length > 0 && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color="#ffc107" />
          <Text style={styles.warningText}>
            {item.validation_warnings[0]}
          </Text>
        </View>
      )}

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
              style={[
                styles.actionButton, 
                hasKurikulumUsage ? styles.deleteButtonDisabled : styles.deleteButton
              ]}
              onPress={() => !hasKurikulumUsage && onDelete(item)}
              disabled={hasKurikulumUsage}
            >
              <Ionicons 
                name="trash-outline" 
                size={18} 
                color={hasKurikulumUsage ? "#ccc" : "#dc3545"} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const getCategoryColor = (kategori) => {
  const colors = {
    wajib: '#d1ecf1',
    muatan_lokal: '#d4edda',
    pengembangan_diri: '#fff3cd',
    pilihan: '#f8d7da',
    ekstrakurikuler: '#e2e3e5'
  };
  return colors[kategori] || '#f8f9fa';
};

const getCategoryLabel = (kategori) => {
  const labels = {
    wajib: 'Wajib',
    muatan_lokal: 'Muatan Lokal',
    pengembangan_diri: 'Pengembangan Diri',
    pilihan: 'Pilihan',
    ekstrakurikuler: 'Ekstrakurikuler'
  };
  return labels[kategori] || kategori;
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
  dependencyPath: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  pathItem: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 2
  },
  pathText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666'
  },
  usageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  usageText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#28a745',
    marginLeft: 2
  },
  nama: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24
  },
  details: {
    marginBottom: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333'
  },
  jenjangText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 6,
    flex: 1
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
  },
  deleteButtonDisabled: {
    backgroundColor: '#f8f9fa'
  }
});

export default MateriCard;