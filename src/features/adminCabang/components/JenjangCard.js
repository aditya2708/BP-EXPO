import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JenjangCard = ({ jenjang, onPress, onEdit }) => {
  const getStatusColor = (isActive) => {
    return isActive ? '#27ae60' : '#e74c3c';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Aktif' : 'Non Aktif';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {jenjang.nama_jenjang}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(jenjang.is_active) }]}>
              <Text style={styles.statusText}>{getStatusText(jenjang.is_active)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="code-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Kode: {jenjang.kode_jenjang}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="list-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Urutan: {jenjang.urutan}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {jenjang.kelas_count || 0} Kelas
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="library-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {jenjang.mata_pelajaran_count || 0} Mata Pelajaran
            </Text>
          </View>
        </View>

        {jenjang.deskripsi && (
          <Text style={styles.description} numberOfLines={2}>
            {jenjang.deskripsi}
          </Text>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="eye-outline" size={18} color="#3498db" />
            <Text style={[styles.actionText, { color: '#3498db' }]}>Detail</Text>
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

export default JenjangCard;