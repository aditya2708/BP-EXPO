import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import Button from '../../../common/components/Button';

// Import API
import { raportApi } from '../api/raportApi';
import { penilaianApi } from '../api/penilaianApi';

const RaportViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { raportId } = route.params || {};
  
  const [raport, setRaport] = useState(null);
  const [nilaiSikap, setNilaiSikap] = useState(null);
  const [detailedAcademic, setDetailedAcademic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRaportData();
  }, []);

  const fetchRaportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await raportApi.getRaportDetail(raportId);
      
      if (response.data.success) {
        const raportData = response.data.data;
        setRaport(raportData);
        setNilaiSikap(raportData.nilai_sikap);
        
        // Fetch detailed academic data
        if (raportData.id_anak && raportData.id_semester) {
          await fetchDetailedAcademicData(raportData.id_anak, raportData.id_semester);
        }
      } else {
        setError(response.data.message || 'Gagal memuat data raport');
      }
    } catch (err) {
      console.error('Error fetching raport:', err);
      setError('Gagal memuat data raport. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedAcademicData = async (idAnak, idSemester) => {
    try {
      const response = await penilaianApi.getByAnakSemester(idAnak, idSemester);
      if (response.data.success) {
        const penilaianData = response.data.data;
        
        // Transform penilaian data to academic details
        const academicDetails = Object.entries(penilaianData).map(([mataPelajaran, penilaianList]) => {
          // Group by materi
          const materiGroups = {};
          penilaianList.forEach(p => {
            const materiName = p.materi?.nama_materi || 'Materi Umum';
            if (!materiGroups[materiName]) {
              materiGroups[materiName] = [];
            }
            materiGroups[materiName].push(p);
          });

          const materiBreakdown = Object.entries(materiGroups).map(([materiName, materiPenilaian]) => ({
            nama_materi: materiName,
            rata_rata: (materiPenilaian.reduce((sum, p) => sum + p.nilai, 0) / materiPenilaian.length).toFixed(1),
            total_penilaian: materiPenilaian.length,
            assessments: materiPenilaian.map(p => ({
              jenis: p.jenisPenilaian?.nama_jenis,
              nilai: p.nilai,
              tanggal: new Date(p.tanggal_penilaian).toLocaleDateString('id-ID')
            }))
          }));

          return {
            mata_pelajaran: mataPelajaran,
            materi_breakdown: materiBreakdown
          };
        });

        setDetailedAcademic(academicDetails);
      }
    } catch (err) {
      console.error('Error fetching detailed academic data:', err);
    }
  };

  const getNilaiColor = (nilai) => {
    if (nilai >= 90) return '#2ecc71';
    if (nilai >= 80) return '#3498db';
    if (nilai >= 70) return '#f39c12';
    if (nilai >= 60) return '#e67e22';
    return '#e74c3c';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#2ecc71';
      case 'draft': return '#f39c12';
      case 'archived': return '#95a5a6';
      default: return '#7f8c8d';
    }
  };

  const handleExportPDF = async () => {
    Alert.alert(
      'Export PDF',
      'Fitur export PDF akan segera tersedia',
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      const message = `Raport ${raport.anak.full_name}\n` +
                     `Semester: ${raport.semester.nama_semester} ${raport.semester.tahun_ajaran}\n` +
                     `Ranking: ${raport.ranking || '-'}\n` +
                     `Kehadiran: ${raport.persentase_kehadiran}%`;
      
      await Share.share({
        message,
        title: 'Raport Anak Binaan'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat raport..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} onRetry={fetchRaportData} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>RAPORT ANAK BINAAN</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(raport.status) }]}>
            <Text style={styles.statusText}>{raport.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.schoolName}>YAYASAN PENDIDIKAN ANAK</Text>
        <Text style={styles.semesterText}>
          {raport.semester.nama_semester} - Tahun Ajaran {raport.semester.tahun_ajaran}
        </Text>
      </View>

      {/* Student Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Anak</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama</Text>
            <Text style={styles.infoValue}>{raport.anak.full_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIK</Text>
            <Text style={styles.infoValue}>{raport.anak.nik_anak || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shelter</Text>
            <Text style={styles.infoValue}>{raport.anak.shelter?.nama_shelter || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ranking</Text>
            <Text style={styles.infoValue}>{raport.ranking || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Attendance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kehadiran</Text>
        <View style={styles.attendanceCard}>
          <View style={styles.attendanceRow}>
            <Ionicons name="calendar-outline" size={24} color="#3498db" />
            <View style={styles.attendanceInfo}>
              <Text style={styles.attendanceLabel}>Total Kehadiran</Text>
              <Text style={styles.attendanceValue}>{raport.total_kehadiran} hari</Text>
            </View>
          </View>
          <View style={styles.attendanceRow}>
            <Ionicons name="stats-chart-outline" size={24} color="#2ecc71" />
            <View style={styles.attendanceInfo}>
              <Text style={styles.attendanceLabel}>Persentase</Text>
              <Text style={styles.attendanceValue}>{raport.persentase_kehadiran}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Academic Grades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nilai Akademik</Text>
        
        {/* Overall Summary */}
        {raport.nilai_rata_rata && (
          <View style={styles.averageCard}>
            <Text style={styles.averageLabel}>Nilai Rata-rata Keseluruhan</Text>
            <Text style={styles.averageValue}>{raport.nilai_rata_rata.toFixed(2)}</Text>
          </View>
        )}
        
        {/* Detailed Subject Breakdown */}
        {raport.raportDetail && raport.raportDetail.map((detail, index) => {
          const academicDetail = detailedAcademic.find(d => d.mata_pelajaran === detail.mata_pelajaran);
          
          return (
            <View key={detail.id_raport_detail} style={styles.gradeCard}>
              <View style={styles.gradeHeader}>
                <Text style={styles.subjectName}>{detail.mata_pelajaran}</Text>
                <View style={styles.gradeValueContainer}>
                  <Text style={[styles.gradeValue, { color: getNilaiColor(detail.nilai_akhir) }]}>
                    {detail.nilai_huruf}
                  </Text>
                  <Text style={styles.gradeScore}>{detail.nilai_akhir}</Text>
                </View>
              </View>
              
              <View style={styles.gradeDetails}>
                <View style={styles.gradeDetailRow}>
                  <Text style={styles.kkmLabel}>KKM: {detail.kkm}</Text>
                  <Text style={[
                    styles.statusText,
                    { color: detail.nilai_akhir >= detail.kkm ? '#2ecc71' : '#e74c3c' }
                  ]}>
                    {detail.keterangan}
                  </Text>
                </View>
              </View>
              
              {/* Material breakdown */}
              {academicDetail?.materi_breakdown && academicDetail.materi_breakdown.length > 0 && (
                <View style={styles.materiBreakdown}>
                  <Text style={styles.materiTitle}>Detail Materi:</Text>
                  {academicDetail.materi_breakdown.map((materi, mIndex) => (
                    <View key={mIndex} style={styles.materiItem}>
                      <View style={styles.materiRow}>
                        <Text style={styles.materiName}>• {materi.nama_materi}</Text>
                        <Text style={styles.materiScore}>{materi.rata_rata}</Text>
                      </View>
                      <Text style={styles.materiAssessments}>
                        {materi.total_penilaian} penilaian
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
        
        {/* Academic Statistics */}
        <View style={styles.academicStats}>
          <View style={styles.statItem}>
            <Ionicons name="book-outline" size={20} color="#3498db" />
            <Text style={styles.statLabel}>Total Mata Pelajaran</Text>
            <Text style={styles.statValue}>{raport.raportDetail?.length || 0}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={20} color="#2ecc71" />
            <Text style={styles.statLabel}>Nilai Tertinggi</Text>
            <Text style={styles.statValue}>
              {Math.max(...(raport.raportDetail?.map(d => d.nilai_akhir) || [0])).toFixed(1)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#f39c12" />
            <Text style={styles.statLabel}>Mata Pelajaran Tuntas</Text>
            <Text style={styles.statValue}>
              {raport.raportDetail?.filter(d => d.nilai_akhir >= d.kkm).length || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Behavior Grades */}
      {nilaiSikap && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nilai Sikap</Text>
          <View style={styles.behaviorCard}>
            {[
              { label: 'Kedisiplinan', value: nilaiSikap.kedisiplinan, icon: 'time-outline' },
              { label: 'Kerjasama', value: nilaiSikap.kerjasama, icon: 'people-outline' },
              { label: 'Tanggung Jawab', value: nilaiSikap.tanggung_jawab, icon: 'shield-checkmark-outline' },
              { label: 'Sopan Santun', value: nilaiSikap.sopan_santun, icon: 'happy-outline' }
            ].map((item, index) => (
              <View key={index} style={styles.behaviorRow}>
                <View style={styles.behaviorLabel}>
                  <Ionicons name={item.icon} size={20} color="#3498db" />
                  <Text style={styles.behaviorText}>{item.label}</Text>
                </View>
                <View style={styles.behaviorValue}>
                  <Text style={styles.behaviorScore}>{item.value}</Text>
                  <Text style={[styles.behaviorGrade, { color: getNilaiColor(item.value) }]}>
                    {nilaiSikap.nilai_huruf}
                  </Text>
                </View>
              </View>
            ))}
            
            {nilaiSikap.catatan_sikap && (
              <View style={styles.behaviorNotes}>
                <Text style={styles.notesLabel}>Catatan:</Text>
                <Text style={styles.notesText}>{nilaiSikap.catatan_sikap}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Teacher Notes */}
      {raport.catatan_wali_kelas && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catatan Wali Kelas</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{raport.catatan_wali_kelas}</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Export PDF"
          onPress={handleExportPDF}
          leftIcon={<Ionicons name="document-text" size={20} color="#ffffff" />}
          style={styles.actionButton}
        />
        
        <Button
          title="Bagikan"
          onPress={handleShare}
          type="outline"
          leftIcon={<Ionicons name="share-social" size={20} color="#3498db" />}
          style={styles.actionButton}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Diterbitkan pada: {new Date(raport.tanggal_terbit).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#e74c3c',
    padding: 20,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  schoolName: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  semesterText: {
    fontSize: 14,
    color: '#ffebee',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  attendanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceInfo: {
    marginLeft: 12,
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  attendanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  averageCard: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  averageLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  averageValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gradeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  gradeValueContainer: {
    alignItems: 'center',
  },
  gradeValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gradeScore: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  gradeDetails: {
    marginBottom: 8,
  },
  gradeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kkmLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  materiBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  materiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  materiItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  materiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materiName: {
    fontSize: 13,
    color: '#2c3e50',
    flex: 1,
  },
  materiScore: {
    fontSize: 13,
    fontWeight: '500',
    color: '#27ae60',
  },
  materiAssessments: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 2,
  },
  academicStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  behaviorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  behaviorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  behaviorLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  behaviorText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 12,
  },
  behaviorValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  behaviorScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 8,
  },
  behaviorGrade: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  behaviorNotes: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  notesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default RaportViewScreen;