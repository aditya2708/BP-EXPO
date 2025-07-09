// 18. src/features/adminCabang/components/MataPelajaranCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MataPelajaranCard = ({ mataPelajaran, onPress, onEdit, onDelete }) => {
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

  const getKategoriIcon = (kategori) => {
    switch (kategori) {
      case 'wajib': return 'bookmark';
      case 'pilihan': return 'options-outline';
      case 'muatan_lokal': return 'location-outline';
      case 'ekstrakurikuler': return 'basketball-outline';
      default: return 'library-outline';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {mataPelajaran.nama_mata_pelajaran}
            </Text>
            <View style={[styles.kategoriBadge, { backgroundColor: getKategoriColor(mataPelajaran.kategori) }]}>
              <Ionicons 
                name={getKategoriIcon(mataPelajaran.kategori)} 
                size={12} 
                color="#fff" 
                style={styles.kategoriIcon}
              />
              <Text style={styles.kategoriText}>
                {getKategoriText(mataPelajaran.kategori)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="trophy-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Bobot: {mataPelajaran.bobot_sks} SKS</Text>
          </View>
          
          {mataPelajaran.kurikulum_materi_count !== undefined && (
            <View style={styles.infoRow}>
              <Ionicons name="book-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Digunakan di {mataPelajaran.kurikulum_materi_count || 0} kurikulum
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color="#3498db" />
            <Text style={[styles.actionText, { color: '#3498db' }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#e74c3c" />
            <Text style={[styles.actionText, { color: '#e74c3c' }]}>Hapus</Text>
          </TouchableOpacity>
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
  kategoriBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    justifyContent: 'center',
  },
  kategoriIcon: {
    marginRight: 4,
  },
  kategoriText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 16,
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

export default MataPelajaranCard;