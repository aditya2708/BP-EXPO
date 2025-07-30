// src/features/adminCabang/components/specific/materi/MateriCard.js
import React, { useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStoreSelectors } from '../../../stores';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * MateriCard - Card component untuk display materi data
 * Dengan triple dependency relations (jenjang > mata pelajaran > kelas > materi)
 * Support untuk file attachments dan usage analytics
 */
const MateriCard = ({
  // Data
  materi,
  
  // Actions
  onPress,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onViewFiles,
  
  // UI config
  showActions = true,
  showStatus = true,
  showStatistics = false,
  showHierarchy = true,
  showFiles = true,
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
  const uiActions = useStoreSelectors.ui.actions();
  const cascadeActions = useStoreSelectors.cascade.actions();
  
  const deleting = useStoreSelectors.ui.loading(ENTITIES.MATERI, 'deleting');
  const updating = useStoreSelectors.ui.loading(ENTITIES.MATERI, 'updating');
  
  // ==================== COMPUTED VALUES ====================
  
  const isActive = useMemo(() => {
    return materi.is_active !== false && materi.status !== 'tidak_aktif';
  }, [materi.is_active, materi.status]);
  
  const displayData = useMemo(() => ({
    id: materi.id_materi,
    nama: materi.nama_materi || 'Unnamed Materi',
    kode: materi.kode_materi || '-',
    deskripsi: materi.deskripsi || null,
    createdAt: materi.created_at,
    updatedAt: materi.updated_at,
    
    // Triple dependency relationships
    mataPelajaran: materi.mataPelajaran || null,
    kelas: materi.kelas || null,
    jenjang: materi.mataPelajaran?.jenjang || materi.kelas?.jenjang || null,
    
    // Display names for hierarchy
    mataPelajaranNama: materi.mataPelajaran?.nama_mata_pelajaran || 'Unknown MP',
    kelasNama: materi.kelas?.nama_kelas || 'Unknown Kelas',
    jenjangNama: materi.mataPelajaran?.jenjang?.nama_jenjang || 
                 materi.kelas?.jenjang?.nama_jenjang || 'Unknown Jenjang',
    
    // File/attachment info
    totalFiles: materi.files_count || 0,
    hasFiles: (materi.files_count || 0) > 0,
    
    // Statistics
    usageCount: materi.usage_count || 0,
    kurikulumCount: materi.kurikulum_count || 0
  }), [materi]);
  
  const statusColor = useMemo(() => {
    return isActive ? '#28a745' : '#dc3545';
  }, [isActive]);
  
  const statusText = useMemo(() => {
    return isActive ? 'Aktif' : 'Tidak Aktif';
  }, [isActive]);
  
  // Get hierarchy path for display
  const hierarchyPath = useMemo(() => {
    const parts = [];
    if (displayData.jenjangNama && displayData.jenjangNama !== 'Unknown Jenjang') {
      parts.push(displayData.jenjangNama);
    }
    if (displayData.mataPelajaranNama && displayData.mataPelajaranNama !== 'Unknown MP') {
      parts.push(displayData.mataPelajaranNama);
    }
    if (displayData.kelasNama && displayData.kelasNama !== 'Unknown Kelas') {
      parts.push(displayData.kelasNama);
    }
    return parts.join(' › ');
  }, [displayData.jenjangNama, displayData.mataPelajaranNama, displayData.kelasNama]);
  
  // Usage badge color based on usage count
  const usageBadgeColor = useMemo(() => {
    if (displayData.usageCount === 0) return '#6c757d';
    if (displayData.usageCount < 5) return '#fd7e14';
    if (displayData.usageCount < 10) return '#ffc107';
    return '#28a745';
  }, [displayData.usageCount]);
  
  // ==================== HANDLERS ====================
  
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    if (selectable) {
      onSelect?.(materi, !selected);
    } else if (onPress) {
      onPress(materi);
    } else if (onView) {
      onView(materi);
    }
  }, [disabled, selectable, onSelect, materi, selected, onPress, onView]);
  
  const handleEdit = useCallback((e) => {
    e?.stopPropagation();
    
    if (onEdit) {
      onEdit(materi);
    } else {
      navigation.navigate('MateriForm', { 
        mode: 'edit', 
        id: displayData.id, 
        item: materi 
      });
    }
  }, [onEdit, materi, navigation, displayData.id]);
  
  const handleDelete = useCallback((e) => {
    e?.stopPropagation();
    
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus materi "${displayData.nama}"?\n\n` +
      `Mata Pelajaran: ${displayData.mataPelajaranNama}\n` +
      `Kelas: ${displayData.kelasNama}\n\n` +
      `Perringatan: Ini akan mempengaruhi kurikulum yang menggunakan materi ini.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            if (onDelete) {
              onDelete(materi);
            } else {
              await performDelete();
            }
          }
        }
      ]
    );
  }, [materi, displayData.nama, displayData.mataPelajaranNama, displayData.kelasNama, onDelete]);
  
  const performDelete = useCallback(async () => {
    try {
      await masterDataActions.delete(ENTITIES.MATERI, displayData.id);
      uiActions.setSuccess(`Materi "${displayData.nama}" berhasil dihapus`, 'delete');
    } catch (error) {
      uiActions.setError(ENTITIES.MATERI, error.message || 'Gagal menghapus materi');
    }
  }, [masterDataActions, uiActions, displayData.id, displayData.nama]);
  
  const handleToggleStatus = useCallback(async (e) => {
    e?.stopPropagation();
    
    const newStatus = !isActive;
    const action = newStatus ? 'mengaktifkan' : 'menonaktifkan';
    
    Alert.alert(
      'Konfirmasi Status',
      `Apakah Anda yakin ingin ${action} materi "${displayData.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya',
          onPress: async () => {
            if (onToggleStatus) {
              onToggleStatus(materi, newStatus);
            } else {
              await performToggleStatus(newStatus);
            }
          }
        }
      ]
    );
  }, [isActive, displayData.nama, materi, onToggleStatus]);
  
  const performToggleStatus = useCallback(async (newStatus) => {
    try {
      const updateData = {
        is_active: newStatus,
        status: newStatus ? 'aktif' : 'tidak_aktif'
      };
      
      await masterDataActions.update(ENTITIES.MATERI, displayData.id, updateData);
      const action = newStatus ? 'diaktifkan' : 'dinonaktifkan';
      uiActions.setSuccess(`Materi "${displayData.nama}" berhasil ${action}`, 'update');
    } catch (error) {
      uiActions.setError(ENTITIES.MATERI, error.message || 'Gagal mengubah status materi');
    }
  }, [masterDataActions, uiActions, displayData.id, displayData.nama]);
  
  const handleViewFiles = useCallback((e) => {
    e?.stopPropagation();
    
    if (onViewFiles) {
      onViewFiles(materi);
    } else {
      navigation.navigate('MateriFiles', { 
        id: displayData.id, 
        item: materi 
      });
    }
  }, [onViewFiles, materi, navigation, displayData.id]);
  
  // ==================== RENDER ====================
  
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.containerCompact, selected && styles.selectedContainer, style]}
        onPress={handlePress}
        disabled={disabled || deleting || updating}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <Text style={styles.namaCompact} numberOfLines={1}>
            {displayData.nama}
          </Text>
          <Text style={styles.hierarchyCompact} numberOfLines={1}>
            {hierarchyPath}
          </Text>
        </View>
        
        {showStatus && (
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        )}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
        disabled && styles.disabledContainer,
        cardStyle,
        style
      ]}
      onPress={handlePress}
      disabled={disabled || deleting || updating}
      activeOpacity={0.7}
    >
      {/* Header with hierarchy path and usage badge */}
      <View style={styles.header}>
        {showHierarchy && hierarchyPath && (
          <View style={styles.hierarchyPath}>
            <Text style={styles.pathText} numberOfLines={1}>
              {hierarchyPath}
            </Text>
          </View>
        )}
        
        {showStatistics && (
          <View style={[styles.usageBadge, { backgroundColor: usageBadgeColor }]}>
            <Text style={styles.usageText}>
              {displayData.usageCount} usage
            </Text>
          </View>
        )}
      </View>
      
      {/* Materi name */}
      <Text style={styles.nama} numberOfLines={2}>
        {displayData.nama}
      </Text>
      
      {/* Content */}
      <View style={[styles.content, contentStyle]}>
        {/* Mata Pelajaran and Kelas info */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="book-outline" size={14} color="#666" />
            <Text style={styles.detailText}>
              {displayData.mataPelajaranNama}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="school-outline" size={14} color="#666" />
            <Text style={styles.detailText}>
              {displayData.kelasNama}
            </Text>
          </View>
          
          {displayData.mataPelajaran?.kategori && (
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={14} color="#666" />
              <Text style={styles.detailText}>
                {displayData.mataPelajaran.kategori}
              </Text>
            </View>
          )}
          
          {showFiles && displayData.hasFiles && (
            <TouchableOpacity 
              style={styles.detailItem}
              onPress={handleViewFiles}
            >
              <Ionicons name="document-attach-outline" size={14} color="#007bff" />
              <Text style={[styles.detailText, { color: '#007bff' }]}>
                {displayData.totalFiles} file{displayData.totalFiles > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Description */}
        {displayData.deskripsi && (
          <Text style={styles.deskripsi} numberOfLines={2}>
            {displayData.deskripsi}
          </Text>
        )}
        
        {/* Status and statistics */}
        <View style={styles.footer}>
          {showStatus && (
            <View style={styles.statusSection}>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={[styles.statusText, { color: isActive ? '#fff' : '#fff' }]}>
                  {statusText}
                </Text>
              </View>
            </View>
          )}
          
          {showStatistics && (
            <View style={styles.statsSection}>
              <Text style={styles.statsText}>
                {displayData.kurikulumCount} kurikulum
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          {showFiles && displayData.hasFiles && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.filesButton]}
              onPress={handleViewFiles}
            >
              <Ionicons name="document-attach-outline" size={18} color="#17a2b8" />
            </TouchableOpacity>
          )}
          
          {onToggleStatus && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.statusButton]}
              onPress={handleToggleStatus}
            >
              <Ionicons 
                name={isActive ? "eye-off-outline" : "eye-outline"} 
                size={18} 
                color={isActive ? "#ffc107" : "#28a745"} 
              />
            </TouchableOpacity>
          )}
          
          {onEdit && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={18} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Loading overlay */}
      {(deleting || updating) && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>
            {deleting ? 'Menghapus...' : 'Memperbarui...'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  containerCompact: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 3,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1
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
    alignItems: 'center',
    marginBottom: 8
  },
  hierarchyPath: {
    flex: 1,
    marginRight: 8
  },
  pathText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic'
  },
  usageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  usageText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff'
  },
  nama: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  namaCompact: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  compactContent: {
    flex: 1,
    marginRight: 8
  },
  hierarchyCompact: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  content: {},
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  deskripsi: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statsSection: {
    alignItems: 'flex-end'
  },
  statsText: {
    fontSize: 11,
    color: '#666'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
    gap: 8
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filesButton: {
    backgroundColor: '#b8e6f0'
  },
  statusButton: {
    backgroundColor: '#fff3cd'
  },
  editButton: {
    backgroundColor: '#cce5ff'
  },
  deleteButton: {
    backgroundColor: '#f5c6cb'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  }
});

export default MateriCard;