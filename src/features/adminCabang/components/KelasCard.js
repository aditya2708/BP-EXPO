import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KelasCard = ({ kelas, onPress, onEdit, onDelete }) => {
  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getDisplayName = () => {
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas;
  };

  const getJenisColor = (jenis) => {
    return jenis === 'standard' ? '#3498db' : '#e74c3c';
  };

  const getJenisText = (jenis) => {
    return jenis === 'standard' ? 'Standard' : 'Custom';
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#27ae60' : '#95a5a6';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {getDisplayName()}
            </Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.jenisBadge, { backgroundColor: getJenisColor(kelas.jenis_kelas) }]}>
                <Text style={styles.badgeText}>{getJenisText(kelas.jenis_kelas)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {kelas.jenjang?.nama_jenjang || 'N/A'}
            </Text>
          </View>
          
          {kelas.tingkat && (
            <View style={styles.infoRow}>
              <Ionicons name="bar-chart-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Tingkat: {kelas.tingkat}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="list-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Urutan: {kelas.urutan}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {kelas.materi_count || 0} Materi
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={getStatusColor(kelas.is_active)} />
            <Text style={[styles.infoText, { color: getStatusColor(kelas.is_active) }]}>
              {kelas.is_active ? 'Aktif' : 'Non Aktif'}
            </Text>
          </View>
        </View>

        {kelas.deskripsi && (
          <Text style={styles.description} numberOfLines={2}>
            {kelas.deskripsi}
          </Text>
        )}

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
  badgeContainer: {
    alignItems: 'flex-end',
  },
  jenisBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
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

export default KelasCard;