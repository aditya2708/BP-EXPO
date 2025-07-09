// src/features/adminCabang/components/MateriKurikulumCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MateriKurikulumCard = ({ materiItem, onEdit, onDelete, onMoveUp, onMoveDown }) => {
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes > 0) {
      return `${hours} jam ${remainingMinutes} menit`;
    }
    
    return `${hours} jam`;
  };

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

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.urutanContainer}>
            <Text style={styles.urutanText}>#{materiItem.urutan}</Text>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.materiTitle} numberOfLines={2}>
              {materiItem.materi?.nama_materi || 'Nama Materi'}
            </Text>
            
            <View style={styles.mataPelajaranContainer}>
              <View style={[
                styles.kategoriBadge, 
                { backgroundColor: getKategoriColor(materiItem.mata_pelajaran?.kategori) }
              ]}>
                <Text style={styles.kategoriText}>
                  {getKategoriText(materiItem.mata_pelajaran?.kategori)}
                </Text>
              </View>
              <Text style={styles.mataPelajaranText} numberOfLines={1}>
                {materiItem.mata_pelajaran?.nama_mata_pelajaran || 'Mata Pelajaran'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              Durasi: {formatDuration(materiItem.jam_pelajaran)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="list-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              Urutan: {materiItem.urutan}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {onMoveUp && (
            <TouchableOpacity style={styles.actionButton} onPress={onMoveUp}>
              <Ionicons name="arrow-up-outline" size={18} color="#3498db" />
              <Text style={[styles.actionText, { color: '#3498db' }]}>Naik</Text>
            </TouchableOpacity>
          )}

          {onMoveDown && (
            <TouchableOpacity style={styles.actionButton} onPress={onMoveDown}>
              <Ionicons name="arrow-down-outline" size={18} color="#3498db" />
              <Text style={[styles.actionText, { color: '#3498db' }]}>Turun</Text>
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color="#f39c12" />
              <Text style={[styles.actionText, { color: '#f39c12' }]}>Edit</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
              <Text style={[styles.actionText, { color: '#e74c3c' }]}>Hapus</Text>
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
    flexDirection: 'row',
    marginBottom: 12,
  },
  urutanContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  urutanText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  materiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  mataPelajaranContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  kategoriBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  kategoriText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  mataPelajaranText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
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
    flexWrap: 'wrap',
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

export default MateriKurikulumCard;