import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KelasCard = ({ 
  item, 
  onPress, 
  onEdit, 
  onDelete, 
  onStats,
  showActions = true
}) => {
  const getTypeColor = () => {
    return item.jenis_kelas === 'standard' ? '#007bff' : '#28a745';
  };

  const getTypeIcon = () => {
    return item.jenis_kelas === 'standard' ? 'library-outline' : 'create-outline';
  };

  const getDisplayName = () => {
    if (item.jenis_kelas === 'standard' && item.tingkat) {
      const romans = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'};
      return `Kelas ${item.tingkat} (${romans[item.tingkat]})`;
    }
    return item.nama_kelas;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor() + '20' }]}>
            <Ionicons name={getTypeIcon()} size={16} color={getTypeColor()} />
          </View>
          <Text style={[styles.typeText, { color: getTypeColor() }]}>
            {item.jenis_kelas === 'standard' ? 'Standard' : 'Custom'}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.is_active ? '#d4edda' : '#f8d7da' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.is_active ? '#155724' : '#721c24' }
            ]}>
              {item.is_active ? 'Aktif' : 'Nonaktif'}
            </Text>
          </View>
        </View>
        
        <View style={styles.urutanBadge}>
          <Text style={styles.urutanText}>#{item.urutan}</Text>
        </View>
      </View>

      <Text style={styles.nama}>{getDisplayName()}</Text>
      
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
        
        {item.jenis_kelas === 'standard' && item.tingkat && (
          <View style={styles.statItem}>
            <Ionicons name="school-outline" size={16} color="#666" />
            <Text style={styles.statText}>Tingkat {item.tingkat}</Text>
          </View>
        )}
      </View>

      {showActions && (
        <View style={styles.actions}>
          {onStats && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.statsButton]}
              onPress={() => onStats(item)}
            >
              <Ionicons name="bar-chart-outline" size={18} color="#28a745" />
            </TouchableOpacity>
          )}
          
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
    alignItems: 'center'
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
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
  urutanBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  urutanText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666'
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
    marginLeft: 4
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
  statsButton: {
    backgroundColor: '#d4edda'
  },
  editButton: {
    backgroundColor: '#cce5ff'
  },
  deleteButton: {
    backgroundColor: '#f5c6cb'
  }
});

export default KelasCard;