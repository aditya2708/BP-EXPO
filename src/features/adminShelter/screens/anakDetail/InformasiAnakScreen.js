import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { formatDateToIndonesian } from '../../../../common/utils/dateFormatter';
import { formatEducationDetail, getEducationIcon } from '../../../../common/utils/educationFormatter';

const InformasiAnakScreen = () => {
  const route = useRoute();
  const { anakData } = route.params || {};
  const educationDetail = formatEducationDetail(anakData?.anakPendidikan);

  const getLevelBadgeColor = (level) => {
    if (!level) return '#95a5a6';
    
    const levelName = level.nama_level_binaan?.toLowerCase() || '';
    
    if (levelName.includes('sd') || levelName.includes('dasar')) return '#3498db';
    if (levelName.includes('smp') || levelName.includes('menengah pertama')) return '#f39c12';
    if (levelName.includes('sma') || levelName.includes('menengah atas')) return '#e74c3c';
    if (levelName.includes('tk') || levelName.includes('paud')) return '#9b59b6';
    if (levelName.includes('universitas') || levelName.includes('tinggi')) return '#2ecc71';
    
    return '#95a5a6';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Nama Lengkap</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.full_name || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="happy-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Nama Panggilan</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.nick_name || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>NIK</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.nik_anak || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons 
              name={anakData?.jenis_kelamin === 'Laki-laki' ? 'male-outline' : 'female-outline'} 
              size={20} 
              color="#666" 
            />
            <Text style={styles.infoLabelText}>Jenis Kelamin</Text>
          </View>
          <Text style={styles.infoValue}>
            {anakData?.jenis_kelamin || '-'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Tanggal Lahir</Text>
          </View>
          <Text style={styles.infoValue}>
            {anakData?.tanggal_lahir ? formatDateToIndonesian(anakData.tanggal_lahir) : '-'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Tempat Lahir</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.tempat_lahir || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Anak Ke</Text>
          </View>
          <Text style={styles.infoValue}>
            {anakData?.anak_ke ? 
              `${anakData.anak_ke} dari ${anakData.dari_bersaudara || '-'}` : 
              '-'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="home-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Tinggal Bersama</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.tinggal_bersama || '-'}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Status & Level</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Status</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: anakData?.status_validasi === 'aktif' ? '#2ecc71' : '#e74c3c' }
            ]}>
              <Text style={styles.statusBadgeText}>
                {anakData?.status_validasi === 'aktif' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="layers-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Level Binaan</Text>
          </View>
          <View style={styles.levelContainer}>
            {anakData?.levelAnakBinaan ? (
              <View style={[
                styles.levelBadge,
                { backgroundColor: getLevelBadgeColor(anakData.levelAnakBinaan) }
              ]}>
                <Text style={styles.levelBadgeText}>
                  {anakData.levelAnakBinaan.nama_level_binaan}
                </Text>
              </View>
            ) : (
              <Text style={styles.infoValue}>Belum ada level</Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Jenis Anak</Text>
          </View>
          <View style={styles.jenisContainer}>
            <Text style={styles.infoValue}>{anakData?.jenis_anak_binaan || '-'}</Text>
            {anakData?.status_cpb && (
              <View style={[
                styles.cpbBadge,
                { backgroundColor: anakData.status_cpb === 'CPB' ? '#e74c3c' : '#3498db' }
              ]}>
                <Text style={styles.cpbBadgeText}>
                  {anakData.status_cpb}
                </Text>
              </View>
            )}
          </View>
        </View>

        {anakData?.kelompok && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="grid-outline" size={20} color="#666" />
              <Text style={styles.infoLabelText}>Kelompok</Text>
            </View>
            <View style={styles.kelompokContainer}>
              <View style={styles.kelompokBadge}>
                <Text style={styles.kelompokBadgeText}>
                  {anakData.kelompok.nama_kelompok}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="book-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Hafalan</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.hafalan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="person" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Agama</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.agama || '-'}</Text>
        </View>

        {anakData?.pelajaran_favorit && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="heart-outline" size={20} color="#666" />
              <Text style={styles.infoLabelText}>Pelajaran Favorit</Text>
            </View>
            <Text style={styles.infoValue}>{anakData.pelajaran_favorit}</Text>
          </View>
        )}

        {anakData?.hobi && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="game-controller-outline" size={20} color="#666" />
              <Text style={styles.infoLabelText}>Hobi</Text>
            </View>
            <Text style={styles.infoValue}>{anakData.hobi}</Text>
          </View>
        )}

        {anakData?.prestasi && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="trophy-outline" size={20} color="#666" />
              <Text style={styles.infoLabelText}>Prestasi</Text>
            </View>
            <Text style={styles.infoValue}>{anakData.prestasi}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Shelter</Text>
        
        {anakData?.shelter && (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="home" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Nama Shelter</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.shelter.nama_shelter || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>No. Telp Shelter</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.shelter.no_telp || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="map-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Alamat Shelter</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.shelter.alamat || '-'}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Keluarga</Text>
        
        {anakData?.keluarga ? (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="people" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Kepala Keluarga</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.keluarga.kepala_keluarga || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="document-text-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>No. KK</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.keluarga.no_kk || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="happy-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Status Orang Tua</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.keluarga.status_ortu || '-'}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Data keluarga tidak tersedia</Text>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Pendidikan</Text>
        
        {educationDetail ? (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name={getEducationIcon(educationDetail.jenjang)} size={20} color="#666" />
                <Text style={styles.infoLabelText}>Jenjang Pendidikan</Text>
              </View>
              <View style={styles.educationContainer}>
                <Text style={styles.infoValue}>{educationDetail.jenjang}</Text>
                <View style={styles.educationBadge}>
                  <Text style={styles.educationBadgeText}>
                    {anakData.anakPendidikan.jenjang?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="list-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Tingkat</Text>
              </View>
              <Text style={styles.infoValue}>{educationDetail.tingkat}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="business-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Nama Institusi</Text>
              </View>
              <Text style={styles.infoValue}>{educationDetail.institusi}</Text>
            </View>
            
            {anakData?.anakPendidikan?.alamat_sekolah && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.infoLabelText}>Alamat Sekolah</Text>
                </View>
                <Text style={styles.infoValue}>{anakData.anakPendidikan.alamat_sekolah}</Text>
              </View>
            )}
            
            {anakData?.anakPendidikan?.alamat_pt && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.infoLabelText}>Alamat Kampus</Text>
                </View>
                <Text style={styles.infoValue}>{anakData.anakPendidikan.alamat_pt}</Text>
              </View>
            )}
            
            {educationDetail.jurusan !== '-' && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="bookmark-outline" size={20} color="#666" />
                  <Text style={styles.infoLabelText}>Jurusan</Text>
                </View>
                <Text style={styles.infoValue}>{educationDetail.jurusan}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>Data pendidikan tidak tersedia</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabelText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 28,
  },
  statusContainer: {
    paddingLeft: 28,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  levelContainer: {
    paddingLeft: 28,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  jenisContainer: {
    paddingLeft: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cpbBadge: {
    marginLeft: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  cpbBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  kelompokContainer: {
    paddingLeft: 28,
  },
  kelompokBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2e5ff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  kelompokBadgeText: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: '500',
  },
  educationContainer: {
    paddingLeft: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  educationBadge: {
    marginLeft: 8,
    backgroundColor: '#ecf0f1',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  educationBadgeText: {
    fontSize: 12,
    color: '#34495e',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  }
});

export default InformasiAnakScreen;