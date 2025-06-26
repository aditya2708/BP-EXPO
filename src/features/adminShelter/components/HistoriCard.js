import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HistoriCard = ({ histori, onPress }) => {
  const getJenisHistoriIcon = (jenis) => {
    switch (jenis?.toLowerCase()) {
      case 'sakit':
        return 'medical-outline';
      case 'kecelakaan':
        return 'warning-outline';
      case 'operasi':
        return 'cut-outline';
      default:
        return 'document-text-outline';
    }
  };

  const getJenisHistoriColor = (jenis) => {
    switch (jenis?.toLowerCase()) {
      case 'sakit':
        return '#f39c12';
      case 'kecelakaan':
        return '#e74c3c';
      case 'operasi':
        return '#9b59b6';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(histori)}
      activeOpacity={0.7}
    >
      {/* Header dengan foto anak dan info dasar */}
      <View style={styles.header}>
        <Image
          source={{ uri: histori.anak.foto_url }}
          style={styles.childPhoto}
          defaultSource={require('../../../assets/images/logo.png')}
        />
        
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{histori.anak.full_name}</Text>
          <Text style={styles.childNickname}>({histori.anak.nick_name})</Text>
          <View style={styles.childDetails}>
            <Text style={styles.childAge}>{histori.anak.umur} tahun</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.childGender}>{histori.anak.jenis_kelamin}</Text>
          </View>
        </View>

        {histori.di_opname === 'Ya' && (
          <View style={styles.opnameBadge}>
            <Ionicons name="bed-outline" size={12} color="#fff" />
            <Text style={styles.opnameText}>Opname</Text>
          </View>
        )}
      </View>

      {/* Histori Info */}
      <View style={styles.historiInfo}>
        <View style={styles.historiHeader}>
          <View style={[
            styles.jenisIcon, 
            { backgroundColor: getJenisHistoriColor(histori.jenis_histori) }
          ]}>
            <Ionicons 
              name={getJenisHistoriIcon(histori.jenis_histori)} 
              size={16} 
              color="#fff" 
            />
          </View>
          
          <View style={styles.historiDetails}>
            <Text style={styles.jenisHistori}>{histori.jenis_histori}</Text>
            <Text style={styles.namaHistori} numberOfLines={2}>
              {histori.nama_histori}
            </Text>
          </View>
        </View>

        <View style={styles.historiFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.tanggal}>{histori.tanggal_formatted}</Text>
          </View>

          {histori.foto_url && (
            <View style={styles.photoIndicator}>
              <Ionicons name="camera" size={14} color="#9b59b6" />
            </View>
          )}

          {!histori.is_read && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  childPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  childNickname: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  childDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAge: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
  childGender: {
    fontSize: 12,
    color: '#999',
  },
  opnameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  opnameText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  historiInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  historiHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jenisIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historiDetails: {
    flex: 1,
  },
  jenisHistori: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  namaHistori: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  historiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tanggal: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  photoIndicator: {
    marginLeft: 8,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    marginLeft: 8,
  },
});

export default HistoriCard;