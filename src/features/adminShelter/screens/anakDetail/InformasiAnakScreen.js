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

// Import utils
import { formatDateToIndonesian } from '../../../../common/utils/dateFormatter';

const InformasiAnakScreen = () => {
  const route = useRoute();
  const { anakData } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      {/* Personal Information */}
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
      
      {/* Additional Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <Text style={styles.infoLabelText}>Jenis Anak</Text>
          </View>
          <Text style={styles.infoValue}>{anakData?.jenis_anak_binaan || '-'}</Text>
        </View>
        
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
        
        {anakData?.kelompok && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="grid-outline" size={20} color="#666" />
              <Text style={styles.infoLabelText}>Kelompok</Text>
            </View>
            <Text style={styles.infoValue}>{anakData.kelompok.nama_kelompok || '-'}</Text>
          </View>
        )}
      </View>

      {/* Shelter Information */}
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

      {/* Family Information */}
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

      {/* Educational Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Pendidikan</Text>
        
        {anakData?.anakPendidikan ? (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="school-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Jenjang</Text>
              </View>
              <Text style={styles.infoValue}>{anakData.anakPendidikan.jenjang || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="list-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Kelas/Semester</Text>
              </View>
              <Text style={styles.infoValue}>
                {anakData.anakPendidikan.kelas 
                  ? `Kelas ${anakData.anakPendidikan.kelas}` 
                  : anakData.anakPendidikan.semester 
                    ? `Semester ${anakData.anakPendidikan.semester}`
                    : '-'
                }
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="business-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Nama Sekolah</Text>
              </View>
              <Text style={styles.infoValue}>
                {anakData.anakPendidikan.nama_sekolah || anakData.anakPendidikan.nama_pt || '-'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Alamat Sekolah</Text>
              </View>
              <Text style={styles.infoValue}>
                {anakData.anakPendidikan.alamat_sekolah || anakData.anakPendidikan.alamat_pt || '-'}
              </Text>
            </View>
            
            {anakData.anakPendidikan.jurusan && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="bookmark-outline" size={20} color="#666" />
                  <Text style={styles.infoLabelText}>Jurusan</Text>
                </View>
                <Text style={styles.infoValue}>{anakData.anakPendidikan.jurusan}</Text>
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
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  }
});

export default InformasiAnakScreen;