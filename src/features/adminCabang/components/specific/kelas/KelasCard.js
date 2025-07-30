// src/features/adminCabang/components/specific/kelas/KelasCard.js
import React, { useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStoreSelectors } from '../../../stores';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * KelasCard - Card component untuk display kelas data
 * Dengan jenis kelas badge, jenjang relation, tingkat/rombel logic, dan statistics
 */
const KelasCard = ({
  // Data
  kelas,
  
  // Actions
  onPress,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onStats,
  
  // UI config
  showActions = true,
  showStatus = true,
  showStatistics = false,
  showJenjang = true,
  compact = false,
  
  // Styles
  style,
  cardStyle,
  contentStyle,
  
  // Interaction
  disabled = false,
  selectable = false,
  selected = false,
  onSelect
}) => {
  const navigation = useNavigation();
  
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const cascadeActions = useStoreSelectors.cascade.actions();
  const uiActions = useStoreSelectors.ui.actions();
  
  const deleting = useStoreSelectors.ui.loading(ENTITIES.KELAS, 'deleting');
  const updating = useStoreSelectors.ui.loading(ENTITIES.KELAS, 'updating');
  
  // ==================== COMPUTED VALUES ====================
  
  const isActive = useMemo(() => {
    return kelas.is_active !== false && kelas.status !== 'tidak_aktif';
  }, [kelas.is_active, kelas.status]);
  
  const displayData = useMemo(() => ({
    id: kelas.id_kelas,
    namaKelas: kelas.nama_kelas || 'Unnamed Kelas',
    jenisKelas: kelas.jenis_kelas || 'standard',
    tingkat: kelas.tingkat || null,
    urutan: kelas.urutan || 0,
    deskripsi: kelas.deskripsi || null,
    createdAt: kelas.created_at,
    updatedAt: kelas.updated_at,
    
    // Relationships
    jenjang: kelas.jenjang || null,
    jenjangNama: kelas.jenjang?.nama_jenjang || 'Jenjang tidak tersedia',
    
    // Statistics
    totalMateri: kelas.materi_count || (kelas.materi?.length || 0),
    totalSiswa: kelas.siswa_count || 0
  }), [kelas]);
  
  const statusColor = useMemo(() => {
    return isActive ? '#28a745' : '#dc3545';
  }, [isActive]);
  
  const statusText = useMemo(() => {
    return isActive ? 'Aktif' : 'Tidak Aktif';
  }, [isActive]);
  
  const jenisKelasColor = useMemo(() => {
    return displayData.jenisKelas === 'standard' ? '#007bff' : '#28a745';
  }, [displayData.jenisKelas]);
  
  const jenisKelasBackground = useMemo(() => {
    return displayData.jenisKelas === 'standard' ? '#e7f3ff' : '#d4edda';
  }, [displayData.jenisKelas]);
  
  const tingkatDisplay = useMemo(() => {
    if (displayData.jenisKelas === 'standard' && displayData.tingkat) {
      const romans = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
        7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
      };
      return `Tingkat ${romans[displayData.tingkat] || displayData.tingkat}`;
    }
    return displayData.tingkat ? `Tingkat ${displayData.tingkat}` : 'Tanpa tingkat';
  }, [displayData.jenisKelas, displayData.tingkat]);
  
  // ==================== HANDLERS ====================
  
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    if (selectable) {
      onSelect?.(displayData.id, !selected);
      return;
    }
    
    if (onPress) {
      onPress(kelas);
    } else if (onView) {
      onView(kelas);
    } else {
      // Default navigation to detail screen
      navigation.navigate('KelasDetail', { 
        kelasId: displayData.id,
        title: displayData.namaKelas 
      });
    }
  }, [disabled, selectable, selected, onSelect, onPress, onView, kelas, displayData, navigation]);
  
  const handleEdit = useCallback(async () => {
    if (disabled || updating) return;
    
    try {
      await cascadeActions.setSelected('kelas', displayData.id);
      
      if (onEdit) {
        onEdit(kelas);
      } else {
        navigation.navigate('KelasForm', { 
          mode: 'edit',
          kelasId: displayData.id,
          title: `Edit ${displayData.namaKelas}`
        });
      }
    } catch (error) {
      console.error('Error preparing edit:', error);
      uiActions.setError(ENTITIES.KELAS, 'Gagal menyiapkan data edit');
    }
  }, [disabled, updating, cascadeActions, displayData, onEdit, kelas, navigation, uiActions]);
  
  const handleDelete = useCallback(() => {
    if (disabled || deleting) return;
    
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus kelas "${displayData.namaKelas}"?\n\nTindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              if (onDelete) {
                await onDelete(kelas);
              } else {
                await masterDataActions.delete(ENTITIES.KELAS, displayData.id);
                uiActions.showSuccess(`Kelas "${displayData.namaKelas}" berhasil dihapus`);
              }
            } catch (error) {
              console.error('Error deleting kelas:', error);
              uiActions.setError(ENTITIES.KELAS, error.message || 'Gagal menghapus kelas');
            }
          }
        }
      ]
    );
  }, [disabled, deleting, displayData, kelas, onDelete, masterDataActions, uiActions]);
  
  const handleToggleStatus = useCallback(async () => {
    if (disabled || updating) return;
    
    try {
      const newStatus = !isActive;
      const updateData = { is_active: newStatus };
      
      if (onToggleStatus) {
        await onToggleStatus(kelas, newStatus);
      } else {
        await masterDataActions.update(ENTITIES.KELAS, displayData.id, updateData);
        uiActions.showSuccess(
          `Kelas "${displayData.namaKelas}" ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`
        );
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      uiActions.setError(ENTITIES.KELAS, error.message || 'Gagal mengubah status');
    }
  }, [disabled, updating, isActive, kelas, onToggleStatus, masterDataActions, displayData, uiActions]);
  
  const handleStats = useCallback(() => {
    if (onStats) {
      onStats(kelas);
    } else {
      navigation.navigate('KelasStats', { 
        kelasId: displayData.id,
        title: `Statistik ${displayData.namaKelas}`
      });
    }
  }, [onStats, kelas, navigation, displayData]);
  
  // ==================== RENDER ====================
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact && styles.compactContainer,
        selected && styles.selectedContainer,
        disabled && styles.disabledContainer,
        cardStyle,
        style
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Header with badges */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Jenis Kelas Badge */}
          <View style={[
            styles.jenisKelas,
            { backgroundColor: jenisKelasBackground }
          ]}>
            <Text style={[
              styles.jenisKelasText,
              { color: jenisKelasColor }
            ]}>
              {displayData.jenisKelas === 'standard' ? 'Standard' : 'Custom'}
            </Text>
          </View>
          
          {/* Status Badge */}
          {showStatus && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: isActive ? '#d4edda' : '#f8d7da' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: statusColor }
              ]}>
                {statusText}
              </Text>
            </View>
          )}
        </View>
        
        {/* Urutan Badge */}
        <View style={styles.urutanBadge}>
          <Text style={styles.urutanText}>#{displayData.urutan}</Text>
        </View>
      </View>
      
      {/* Main Content */}
      <View style={[styles.content, contentStyle]}>
        {/* Nama Kelas */}
        <Text style={styles.namaKelas} numberOfLines={compact ? 1 : 2}>
          {displayData.namaKelas}
        </Text>
        
        {/* Details Row */}
        <View style={styles.details}>
          {/* Jenjang Info */}
          {showJenjang && displayData.jenjang && (
            <View style={styles.detailItem}>
              <Ionicons name="library-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{displayData.jenjangNama}</Text>
            </View>
          )}
          
          {/* Tingkat Info */}
          <View style={styles.detailItem}>
            <Ionicons name="layers-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{tingkatDisplay}</Text>
          </View>
        </View>
        
        {/* Description */}
        {!compact && displayData.deskripsi && (
          <Text style={styles.deskripsi} numberOfLines={2}>
            {displayData.deskripsi}
          </Text>
        )}
        
        {/* Statistics */}
        {showStatistics && (
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="document-text-outline" size={16} color="#666" />
              <Text style={styles.statText}>
                {displayData.totalMateri} Materi
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.statText}>
                {displayData.totalSiswa} Siswa
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Actions */}
      {showActions && !selectable && (
        <View style={styles.actions}>
          {onStats && (
            <TouchableOpacity
              style={[styles.actionButton, styles.statsButton]}
              onPress={handleStats}
              disabled={disabled}
            >
              <Ionicons name="bar-chart-outline" size={18} color="#28a745" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
            disabled={disabled || updating}
          >
            {updating ? (
              <ActivityIndicator size={18} color="#007bff" />
            ) : (
              <Ionicons name="create-outline" size={18} color="#007bff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.statusButton]}
            onPress={handleToggleStatus}
            disabled={disabled || updating}
          >
            <Ionicons 
              name={isActive ? "eye-off-outline" : "eye-outline"} 
              size={18} 
              color={statusColor} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={disabled || deleting}
          >
            {deleting ? (
              <ActivityIndicator size={18} color="#dc3545" />
            ) : (
              <Ionicons name="trash-outline" size={18} color="#dc3545" />
            )}
          </TouchableOpacity>
        </View>
      )}
      
      {/* Selection Indicator */}
      {selectable && (
        <View style={styles.selectionIndicator}>
          <Ionicons
            name={selected ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={selected ? "#007bff" : "#ccc"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  compactContainer: {
    marginVertical: 4
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#007bff'
  },
  disabledContainer: {
    opacity: 0.6
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap'
  },
  jenisKelas: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4
  },
  jenisKelasText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600'
  },
  urutanBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  urutanText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666'
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  namaKelas: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500'
  },
  deskripsi: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8
  },
  stats: {
    flexDirection: 'row',
    marginTop: 4
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  statsButton: {
    backgroundColor: '#d4edda'
  },
  editButton: {
    backgroundColor: '#cce5ff'
  },
  statusButton: {
    backgroundColor: '#f8f9fa'
  },
  deleteButton: {
    backgroundColor: '#f5c6cb'
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2
  }
});

export default KelasCard;