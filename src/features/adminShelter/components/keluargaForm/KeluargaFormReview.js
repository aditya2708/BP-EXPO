import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { formatDateToIndonesian } from '../../../../common/utils/dateFormatter';

const KeluargaFormReview = ({ formData, dropdownData, isEditMode }) => {
  const findKacabName = (id) => {
    const kacab = dropdownData.kacab.find(k => k.id_kacab.toString() === id);
    return kacab ? kacab.nama_kacab : '-';
  };
  
  const findWilbinName = (id) => {
    const wilbin = dropdownData.wilbin.find(w => w.id_wilbin.toString() === id);
    return wilbin ? wilbin.nama_wilbin : '-';
  };
  
  const findBankName = (id) => {
    const bank = dropdownData.bank.find(b => b.id_bank.toString() === id);
    return bank ? bank.nama_bank : '-';
  };
  
  const formatEducationLevel = (level) => {
    const levelMap = {
      'belum_sd': 'Belum Sekolah',
      'sd': 'SD / Sederajat',
      'smp': 'SMP / Sederajat',
      'sma': 'SMA / Sederajat',
      'perguruan_tinggi': 'Perguruan Tinggi'
    };
    
    return levelMap[level] || level;
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.reviewTitle}>Please review all information before {isEditMode ? 'updating' : 'saving'}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>KK Number:</Text>
          <Text style={styles.infoValue}>{formData.no_kk || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Family Head:</Text>
          <Text style={styles.infoValue}>{formData.kepala_keluarga || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={styles.infoValue}>{formData.status_ortu || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kacab:</Text>
          <Text style={styles.infoValue}>{findKacabName(formData.id_kacab)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wilbin:</Text>
          <Text style={styles.infoValue}>{findWilbinName(formData.id_wilbin)}</Text>
        </View>
        
        {formData.bank_choice === 'yes' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank:</Text>
              <Text style={styles.infoValue}>{findBankName(formData.id_bank)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account:</Text>
              <Text style={styles.infoValue}>{formData.no_rek ? `${formData.no_rek} (${formData.an_rek || 'N/A'})` : '-'}</Text>
            </View>
          </>
        )}
        
        {formData.telp_choice === 'yes' && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{formData.no_tlp ? `${formData.no_tlp} (${formData.an_tlp || 'N/A'})` : '-'}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Father Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NIK:</Text>
          <Text style={styles.infoValue}>{formData.nik_ayah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{formData.nama_ayah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Religion:</Text>
          <Text style={styles.infoValue}>{formData.agama_ayah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Birth:</Text>
          <Text style={styles.infoValue}>
            {formData.tempat_lahir_ayah ? `${formData.tempat_lahir_ayah}, ${formatDateToIndonesian(formData.tanggal_lahir_ayah)}` : '-'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{formData.alamat_ayah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Income:</Text>
          <Text style={styles.infoValue}>{formData.penghasilan_ayah || '-'}</Text>
        </View>
        
        {formData.tanggal_kematian_ayah && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deceased:</Text>
              <Text style={styles.infoValue}>{formatDateToIndonesian(formData.tanggal_kematian_ayah)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cause:</Text>
              <Text style={styles.infoValue}>{formData.penyebab_kematian_ayah || '-'}</Text>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mother Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NIK:</Text>
          <Text style={styles.infoValue}>{formData.nik_ibu || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{formData.nama_ibu || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Religion:</Text>
          <Text style={styles.infoValue}>{formData.agama_ibu || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Birth:</Text>
          <Text style={styles.infoValue}>
            {formData.tempat_lahir_ibu ? `${formData.tempat_lahir_ibu}, ${formatDateToIndonesian(formData.tanggal_lahir_ibu)}` : '-'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{formData.alamat_ibu || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Income:</Text>
          <Text style={styles.infoValue}>{formData.penghasilan_ibu || '-'}</Text>
        </View>
        
        {formData.tanggal_kematian_ibu && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deceased:</Text>
              <Text style={styles.infoValue}>{formatDateToIndonesian(formData.tanggal_kematian_ibu)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cause:</Text>
              <Text style={styles.infoValue}>{formData.penyebab_kematian_ibu || '-'}</Text>
            </View>
          </>
        )}
      </View>
      
      {formData.nik_wali || formData.nama_wali ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIK:</Text>
            <Text style={styles.infoValue}>{formData.nik_wali || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{formData.nama_wali || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Relation:</Text>
            <Text style={styles.infoValue}>{formData.hub_kerabat_wali || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Religion:</Text>
            <Text style={styles.infoValue}>{formData.agama_wali || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Birth:</Text>
            <Text style={styles.infoValue}>
              {formData.tempat_lahir_wali ? `${formData.tempat_lahir_wali}, ${formatDateToIndonesian(formData.tanggal_lahir_wali)}` : '-'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{formData.alamat_wali || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Income:</Text>
            <Text style={styles.infoValue}>{formData.penghasilan_wali || '-'}</Text>
          </View>
        </View>
      ) : null}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Child Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NIK:</Text>
          <Text style={styles.infoValue}>{formData.nik_anak || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{formData.full_name || '-'} ({formData.nick_name || '-'})</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Birth:</Text>
          <Text style={styles.infoValue}>
            {formData.tempat_lahir ? `${formData.tempat_lahir}, ${formatDateToIndonesian(formData.tanggal_lahir)}` : '-'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{formData.jenis_kelamin === 'Laki-laki' ? 'Laki-laki' : (formData.jenis_kelamin === 'Perempuan' ? 'Perempuan' : '-')}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Religion:</Text>
          <Text style={styles.infoValue}>{formData.agama || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Birth Order:</Text>
          <Text style={styles.infoValue}>{formData.anak_ke && formData.dari_bersaudara ? `${formData.anak_ke} of ${formData.dari_bersaudara}` : '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lives With:</Text>
          <Text style={styles.infoValue}>{formData.tinggal_bersama || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hafalan:</Text>
          <Text style={styles.infoValue}>{formData.hafalan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hobby:</Text>
          <Text style={styles.infoValue}>{formData.hobi || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fav Subject:</Text>
          <Text style={styles.infoValue}>{formData.pelajaran_favorit || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Achievements:</Text>
          <Text style={styles.infoValue}>{formData.prestasi || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Distance:</Text>
          <Text style={styles.infoValue}>{formData.jarak_rumah ? `${formData.jarak_rumah} km` : '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Transport:</Text>
          <Text style={styles.infoValue}>{formData.transportasi || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Level:</Text>
          <Text style={styles.infoValue}>{formatEducationLevel(formData.jenjang) || '-'}</Text>
        </View>
        
        {formData.jenjang && formData.jenjang !== 'belum_sd' && formData.jenjang !== 'perguruan_tinggi' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Grade:</Text>
              <Text style={styles.infoValue}>{formData.kelas || '-'}</Text>
            </View>
            
            {formData.jenjang === 'sma' && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Major:</Text>
                <Text style={styles.infoValue}>{formData.jurusan || '-'}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>School:</Text>
              <Text style={styles.infoValue}>{formData.nama_sekolah || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{formData.alamat_sekolah || '-'}</Text>
            </View>
          </>
        )}
        
        {formData.jenjang === 'perguruan_tinggi' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Semester:</Text>
              <Text style={styles.infoValue}>{formData.semester || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Major:</Text>
              <Text style={styles.infoValue}>{formData.jurusan || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>College:</Text>
              <Text style={styles.infoValue}>{formData.nama_pt || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{formData.alamat_pt || '-'}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Survey - Basic Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Head Job:</Text>
          <Text style={styles.infoValue}>{formData.pekerjaan_kepala_keluarga || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Head Education:</Text>
          <Text style={styles.infoValue}>{formData.pendidikan_kepala_keluarga || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dependents:</Text>
          <Text style={styles.infoValue}>{formData.jumlah_tanggungan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Child Status:</Text>
          <Text style={styles.infoValue}>{formData.status_anak || '-'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Survey - Financial Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Income:</Text>
          <Text style={styles.infoValue}>{formData.penghasilan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Savings:</Text>
          <Text style={styles.infoValue}>{formData.kepemilikan_tabungan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Education Cost:</Text>
          <Text style={styles.infoValue}>{formData.biaya_pendidikan_perbulan ? `Rp ${formData.biaya_pendidikan_perbulan}` : '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Other Aid:</Text>
          <Text style={styles.infoValue}>{formData.bantuan_lembaga_formal_lain || '-'}</Text>
        </View>
        
        {formData.bantuan_lembaga_formal_lain === 'Ya' && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aid Amount:</Text>
            <Text style={styles.infoValue}>{formData.bantuan_lembaga_formal_lain_sebesar ? `Rp ${formData.bantuan_lembaga_formal_lain_sebesar}` : '-'}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Survey - Assets Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Land Ownership:</Text>
          <Text style={styles.infoValue}>{formData.kepemilikan_tanah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>House Ownership:</Text>
          <Text style={styles.infoValue}>{formData.kepemilikan_rumah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wall Condition:</Text>
          <Text style={styles.infoValue}>{formData.kondisi_rumah_dinding || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Floor Condition:</Text>
          <Text style={styles.infoValue}>{formData.kondisi_rumah_lantai || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vehicle:</Text>
          <Text style={styles.infoValue}>{formData.kepemilikan_kendaraan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Electronics:</Text>
          <Text style={styles.infoValue}>{formData.kepemilikan_elektronik || '-'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Survey - Health Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Meals per Day:</Text>
          <Text style={styles.infoValue}>{formData.jumlah_makan || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Water Source:</Text>
          <Text style={styles.infoValue}>{formData.sumber_air_bersih || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Toilet:</Text>
          <Text style={styles.infoValue}>{formData.jamban_limbah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Trash Bin:</Text>
          <Text style={styles.infoValue}>{formData.tempat_sampah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Smoker:</Text>
          <Text style={styles.infoValue}>{formData.perokok || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Alcohol Consumer:</Text>
          <Text style={styles.infoValue}>{formData.konsumen_miras || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>First Aid Kit:</Text>
          <Text style={styles.infoValue}>{formData.persediaan_p3k || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fruits & Vegetables:</Text>
          <Text style={styles.infoValue}>{formData.makan_buah_sayur || '-'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Survey - Religious & Social</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Five Daily Prayers:</Text>
          <Text style={styles.infoValue}>{formData.solat_lima_waktu || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reading Quran:</Text>
          <Text style={styles.infoValue}>{formData.membaca_alquran || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Religious Study:</Text>
          <Text style={styles.infoValue}>{formData.majelis_taklim || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reading News:</Text>
          <Text style={styles.infoValue}>{formData.membaca_koran || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Organization Member:</Text>
          <Text style={styles.infoValue}>{formData.pengurus_organisasi || '-'}</Text>
        </View>
        
        {formData.pengurus_organisasi === 'Ya' && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Position:</Text>
            <Text style={styles.infoValue}>{formData.pengurus_organisasi_sebagai || '-'}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Beneficiary Condition:</Text>
          <Text style={styles.infoValue}>{formData.kondisi_penerima_manfaat || '-'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 90,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default KeluargaFormReview;