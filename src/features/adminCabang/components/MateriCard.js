import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MateriCard = ({ materi, onPress, onEdit, onDelete }) => {
  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getKelasDisplayName = () => {
    if (!materi.kelas) return 'N/A';
    
    if (materi.kelas.jenis_kelas === 'standard' && materi.kelas.tingkat) {
      return `Kelas ${getRomanNumeral(materi.kelas.tingkat)}`;
    }
    return materi.kelas.nama_kelas;
  };

  const getHierarchyPath = () => {
    const jenjang = materi.kelas?.jenjang?.nama_jenjang || 'N/A';
    const kelas = getKelasDisplayName();
    return `${jenjang} > ${kelas}`;
  };

  const getMataPelajaranColor = (mataPelajaran) => {
    // Simple hash to color mapping for consistency
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71', '#34495e'];
    const hash = mataPelajaran?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {materi.nama_materi}
            </Text>
            <View style={[styles.mataPelajaranBadge, { backgroundColor: getMataPelajaranColor(materi.mata_pelajaran) }]}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {materi.mata_pelajaran || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.hierarchyContainer}>
          <View style={styles.hierarchyRow}>
            <Ionicons name="git-branch-outline" size={16} color="#666" />
            <Text style={styles.hierarchyText} numberOfLines={1}>
              {getHierarchyPath()}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {materi.kelas?.jenjang?.nama_jenjang || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="library-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {getKelasDisplayName()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              Digunakan di {materi.kurikulum_materi_count || 0} kurikulum
            </Text>
          </View>
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
  mataPelajaranBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 120,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  hierarchyContainer: {
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  hierarchyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hierarchyText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
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

export default MateriCard;