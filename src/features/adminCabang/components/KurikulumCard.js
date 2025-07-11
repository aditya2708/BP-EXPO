// 17. src/features/adminCabang/components/KurikulumCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KurikulumCard = ({ kurikulum, onPress, onEdit, onSetActive, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'aktif': return '#27ae60';
      case 'draft': return '#95a5a6';
      case 'nonaktif': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aktif': return 'Aktif';
      case 'draft': return 'Draft';
      case 'nonaktif': return 'Non Aktif';
      default: return 'Draft';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {kurikulum.nama_kurikulum}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(kurikulum.status) }]}>
              <Text style={styles.statusText}>{getStatusText(kurikulum.status)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Tahun: {kurikulum.tahun_berlaku}</Text>
          </View>
          
          {kurikulum.mata_pelajaran_count !== undefined && (
            <View style={styles.infoRow}>
              <Ionicons name="library-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {kurikulum.mata_pelajaran_count || 0} Mata Pelajaran
              </Text>
            </View>
          )}
          
          {kurikulum.kurikulum_materi_count !== undefined && (
            <View style={styles.infoRow}>
              <Ionicons name="book-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {kurikulum.kurikulum_materi_count || 0} Materi
              </Text>
            </View>
          )}
        </View>

        {kurikulum.deskripsi && (
          <Text style={styles.description} numberOfLines={2}>
            {kurikulum.deskripsi}
          </Text>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color="#3498db" />
            <Text style={[styles.actionText, { color: '#3498db' }]}>Edit</Text>
          </TouchableOpacity>

          {kurikulum.status !== 'aktif' && (
            <TouchableOpacity style={styles.actionButton} onPress={onSetActive}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#27ae60" />
              <Text style={[styles.actionText, { color: '#27ae60' }]}>Aktifkan</Text>
            </TouchableOpacity>
          )}

          {kurikulum.status !== 'aktif' && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
              <Text style={[styles.actionText, { color: '#e74c3c' }]}>Hapus</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default KurikulumCard;