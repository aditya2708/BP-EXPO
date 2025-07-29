import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MateriUsageIndicator = ({
  usage = [],
  totalUsage = 0,
  onKurikulumPress,
  showDetails = true,
  style
}) => {
  if (totalUsage === 0) {
    return (
      <View style={[styles.container, styles.noUsage, style]}>
        <View style={styles.header}>
          <Ionicons name="unlink-outline" size={20} color="#28a745" />
          <Text style={styles.noUsageTitle}>Tidak Digunakan</Text>
        </View>
        <Text style={styles.noUsageText}>
          Materi ini belum digunakan dalam kurikulum apapun dan dapat dihapus
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.hasUsage, style]}>
      <View style={styles.header}>
        <Ionicons name="link" size={20} color="#dc3545" />
        <Text style={styles.usageTitle}>
          Digunakan dalam {totalUsage} Kurikulum
        </Text>
      </View>

      <Text style={styles.warningText}>
        Materi ini tidak dapat dihapus karena sedang digunakan
      </Text>

      {showDetails && usage.length > 0 && (
        <View style={styles.usageList}>
          {usage.slice(0, 3).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.usageItem}
              onPress={() => onKurikulumPress?.(item)}
              activeOpacity={0.7}
            >
              <View style={styles.usageContent}>
                <Text style={styles.kurikulumName}>{item.nama_kurikulum}</Text>
                <Text style={styles.kurikulumInfo}>
                  {item.tahun_berlaku} • {item.status}
                </Text>
              </View>
              
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusTextColor(item.status) }
                ]}>
                  {item.is_active ? 'Aktif' : item.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {usage.length > 3 && (
            <View style={styles.moreIndicator}>
              <Text style={styles.moreText}>
                +{usage.length - 3} kurikulum lainnya
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <Ionicons name="information-circle" size={16} color="#007bff" />
          <Text style={styles.actionText}>
            Hapus materi dari kurikulum terlebih dahulu
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'aktif': return '#d4edda';
    case 'draft': return '#fff3cd';
    case 'nonaktif': return '#f8d7da';
    default: return '#f8f9fa';
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case 'aktif': return '#155724';
    case 'draft': return '#856404';
    case 'nonaktif': return '#721c24';
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8
  },
  noUsage: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1
  },
  hasUsage: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  noUsageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
    marginLeft: 8
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#721c24',
    marginLeft: 8
  },
  noUsageText: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20
  },
  warningText: {
    fontSize: 14,
    color: '#721c24',
    fontWeight: '500',
    marginBottom: 12
  },
  usageList: {
    marginBottom: 12
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1
  },
  usageContent: {
    flex: 1
  },
  kurikulumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  kurikulumInfo: {
    fontSize: 12,
    color: '#666'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600'
  },
  moreIndicator: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  moreText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  actions: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5c6cb'
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionText: {
    fontSize: 12,
    color: '#007bff',
    marginLeft: 6,
    flex: 1
  }
});

export default MateriUsageIndicator;