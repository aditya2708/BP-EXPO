import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RaportCard = ({
  child,
  expanded = false,
  onToggle,
  onViewDetail,
  onRaportDetail
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#4caf50';
      case 'draft': return '#ff9800';
      case 'archived': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'Terbit';
      case 'draft': return 'Draft';
      case 'archived': return 'Arsip';
      default: return status;
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 85) return '#4caf50';
    if (grade >= 75) return '#ff9800';
    if (grade >= 65) return '#ff5722';
    return '#f44336';
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.childInfo}>
          <Image
            source={{ 
              uri: child.foto_url || 'https://via.placeholder.com/50' 
            }}
            style={styles.childPhoto}
          />
          
          <View style={styles.childDetails}>
            <Text style={styles.childName}>
              {child.full_name}
            </Text>
            {child.nick_name && (
              <Text style={styles.childNickname}>
                ({child.nick_name})
              </Text>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {child.total_raport} Raport
              </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={[
                styles.averageGrade,
                { color: getGradeColor(child.average_grade) }
              ]}>
                Rata-rata: {child.average_grade}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor('published') }
                ]} />
                <Text style={styles.statusText}>
                  {child.published_count} Terbit
                </Text>
              </View>
              
              {child.draft_count > 0 && (
                <View style={styles.statusItem}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: getStatusColor('draft') }
                  ]} />
                  <Text style={styles.statusText}>
                    {child.draft_count} Draft
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={(e) => {
              e.stopPropagation();
              onViewDetail(child.id_anak);
            }}
          >
            <Ionicons name="eye" size={16} color="#9b59b6" />
          </TouchableOpacity>
          
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          
          {child.latest_raport_date && (
            <View style={styles.latestInfo}>
              <Text style={styles.latestLabel}>Raport Terakhir:</Text>
              <Text style={styles.latestValue}>
                {child.latest_semester} - {child.latest_raport_date}
              </Text>
            </View>
          )}

          <Text style={styles.raportListTitle}>
            Daftar Raport ({child.total_raport})
          </Text>

          {child.raport_data && child.raport_data.length > 0 ? (
            child.raport_data.map((raport, index) => (
              <TouchableOpacity
                key={raport.id_raport}
                style={styles.raportItem}
                onPress={() => onRaportDetail(child.id_anak, raport.id_raport)}
              >
                <View style={styles.raportInfo}>
                  <View style={styles.raportHeader}>
                    <Text style={styles.raportSemester}>
                      {raport.semester} {raport.tahun_ajaran}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(raport.status) }
                    ]}>
                      <Text style={styles.statusBadgeText}>
                        {getStatusText(raport.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.raportDetails}>
                    <View style={styles.raportStat}>
                      <Text style={styles.statLabel}>Mapel:</Text>
                      <Text style={styles.statValue}>
                        {raport.subjects_count}
                      </Text>
                    </View>
                    
                    <View style={styles.raportStat}>
                      <Text style={styles.statLabel}>Rata-rata:</Text>
                      <Text style={[
                        styles.statValue,
                        { color: getGradeColor(raport.average_grade) }
                      ]}>
                        {raport.average_grade?.toFixed(1) || '-'}
                      </Text>
                    </View>
                    
                    {raport.ranking && (
                      <View style={styles.raportStat}>
                        <Text style={styles.statLabel}>Ranking:</Text>
                        <Text style={styles.statValue}>#{raport.ranking}</Text>
                      </View>
                    )}
                  </View>

                  {raport.tanggal_terbit && (
                    <Text style={styles.publishDate}>
                      Terbit: {raport.tanggal_terbit}
                    </Text>
                  )}
                </View>

                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color="#666" 
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRaportText}>
              Belum ada data raport
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  childInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  childPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f0f0f0'
  },
  childDetails: {
    flex: 1
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  childNickname: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  summaryText: {
    fontSize: 14,
    color: '#666'
  },
  separator: {
    fontSize: 14,
    color: '#ccc',
    marginHorizontal: 8
  },
  averageGrade: {
    fontSize: 14,
    fontWeight: '500'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4
  },
  statusText: {
    fontSize: 12,
    color: '#666'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: '#f8f4ff',
    borderRadius: 6
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12
  },
  latestInfo: {
    flexDirection: 'row',
    marginBottom: 12
  },
  latestLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 100
  },
  latestValue: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  raportListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  raportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8
  },
  raportInfo: {
    flex: 1
  },
  raportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  raportSemester: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500'
  },
  raportDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  raportStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4
  },
  statValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  publishDate: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic'
  },
  noRaportText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    padding: 20
  }
});

export default RaportCard;