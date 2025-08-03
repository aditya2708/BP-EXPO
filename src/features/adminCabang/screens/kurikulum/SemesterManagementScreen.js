import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '../../../../common/components/FloatingActionButton';

/**
 * Semester Management Screen - Sprint 1 Placeholder
 * CRUD interface for semester management
 */
const SemesterManagementScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('active');

  const handleAddSemester = () => {
    Alert.alert('Info', 'Form tambah semester akan diimplementasi di Sprint 2');
  };

  const handleEditSemester = (semester) => {
    Alert.alert('Info', 'Form edit semester akan diimplementasi di Sprint 2');
  };

  const handleDeleteSemester = (semester) => {
    Alert.alert(
      'Hapus Semester',
      `Apakah Anda yakin ingin menghapus semester "${semester.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => {
          Alert.alert('Info', 'Fitur hapus akan diimplementasi di Sprint 2');
        }}
      ]
    );
  };

  const handleSetActive = (semester) => {
    Alert.alert(
      'Aktifkan Semester',
      `Aktifkan semester "${semester.nama}"? Semester aktif lainnya akan dinonaktifkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Aktifkan', onPress: () => {
          Alert.alert('Info', 'Fitur aktivasi akan diimplementasi di Sprint 2');
        }}
      ]
    );
  };

  // Placeholder data - will be replaced with API call in Sprint 2
  const semesterData = {
    active: [
      {
        id: 1,
        nama: 'Semester Ganjil 2023/2024',
        periode: 'ganjil',
        tahun_ajaran: '2023/2024',
        tanggal_mulai: '2023-08-01',
        tanggal_selesai: '2023-12-31',
        status: 'active'
      }
    ],
    draft: [
      {
        id: 2,
        nama: 'Semester Genap 2023/2024',
        periode: 'genap',
        tahun_ajaran: '2023/2024',
        tanggal_mulai: '2024-01-01',
        tanggal_selesai: '2024-06-30',
        status: 'draft'
      }
    ],
    completed: [
      {
        id: 3,
        nama: 'Semester Genap 2022/2023',
        periode: 'genap',
        tahun_ajaran: '2022/2023',
        tanggal_mulai: '2023-01-01',
        tanggal_selesai: '2023-06-30',
        status: 'completed'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'draft': return '#ffc107';
      case 'completed': return '#6c757d';
      case 'archived': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'draft': return 'Draft';
      case 'completed': return 'Selesai';
      case 'archived': return 'Arsip';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const tabs = [
    { key: 'active', label: 'Aktif', count: semesterData.active.length },
    { key: 'draft', label: 'Draft', count: semesterData.draft.length },
    { key: 'completed', label: 'Selesai', count: semesterData.completed.length },
  ];

  const currentData = semesterData[selectedTab] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Kelola Semester</Text>
        <Text style={styles.subtitle}>
          Manajemen semester untuk kurikulum cabang
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {currentData.map((semester) => (
          <View key={semester.id} style={styles.semesterCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitle}>
                <Text style={styles.semesterName}>{semester.nama}</Text>
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(semester.status) }
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(semester.status)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color="#6c757d" />
                <Text style={styles.infoText}>
                  {formatDate(semester.tanggal_mulai)} - {formatDate(semester.tanggal_selesai)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={14} color="#6c757d" />
                <Text style={styles.infoText}>
                  Tahun Ajaran {semester.tahun_ajaran}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={14} color="#6c757d" />
                <Text style={styles.infoText}>
                  Periode {semester.periode === 'ganjil' ? 'Ganjil' : 'Genap'}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              {semester.status === 'draft' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.activateButton]}
                  onPress={() => handleSetActive(semester)}
                >
                  <Ionicons name="play-circle" size={16} color="#28a745" />
                  <Text style={[styles.actionText, { color: '#28a745' }]}>Aktifkan</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditSemester(semester)}
              >
                <Ionicons name="pencil" size={16} color="#007bff" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteSemester(semester)}
              >
                <Ionicons name="trash" size={16} color="#dc3545" />
                <Text style={[styles.actionText, styles.deleteText]}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {currentData.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum Ada Semester</Text>
            <Text style={styles.emptySubtitle}>
              Tap tombol + untuk menambah semester baru
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#17a2b8" />
          <Text style={styles.infoCardText}>
            Sprint 1: Data semester menggunakan placeholder. 
            Form CRUD lengkap akan diimplementasi di Sprint 2.
          </Text>
        </View>
      </ScrollView>

      <FloatingActionButton
        onPress={handleAddSemester}
        icon="add"
        backgroundColor="#28a745"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  semesterCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  semesterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  activateButton: {
    backgroundColor: '#e8f5e8',
  },
  deleteButton: {
    backgroundColor: '#f8f9fa',
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#007bff',
  },
  deleteText: {
    color: '#dc3545',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: '#e7f3ff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  infoCardText: {
    flex: 1,
    fontSize: 12,
    color: '#0056b3',
    marginLeft: 10,
    lineHeight: 16,
  },
});

export default SemesterManagementScreen;