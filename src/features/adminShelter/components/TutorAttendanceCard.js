import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AttendanceChart from './AttendanceChart';
import { getPercentageColor, getMonthName } from '../utils/reportUtils';

const TutorAttendanceCard = ({ 
  tutor, 
  isExpanded, 
  onToggle,
  onTutorPress 
}) => {
  const renderMonthlyBreakdown = () => {
    const monthlyData = Object.values(tutor.monthly_data);
    
    return (
      <View style={styles.monthlyBreakdown}>
        <Text style={styles.breakdownTitle}>Detail Bulanan</Text>
        {monthlyData.map((month) => (
          <View key={month.month_number} style={styles.monthRow}>
            <Text style={styles.monthName}>{getMonthName(month.month_number)}</Text>
            <Text style={styles.monthStats}>
              {month.attended_count}/{month.activities_count}
            </Text>
            <Text style={[
              styles.monthPercentage,
              { color: getPercentageColor(month.percentage) }
            ]}>
              {month.percentage}%
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={onToggle}
      >
        <View style={styles.tutorInfo}>
          <TouchableOpacity onPress={() => onTutorPress?.(tutor)}>
            <Image 
              source={{ uri: tutor.foto_url }}
              style={styles.photo}
              defaultSource={require('../../../../src/assets/images/logo.png')}
            />
          </TouchableOpacity>
          
          <View style={styles.details}>
            <Text style={styles.name}>{tutor.nama}</Text>
            {tutor.maple && (
              <Text style={styles.maple}>Mapel: {tutor.maple}</Text>
            )}
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                {tutor.total_attended}/{tutor.total_activities} aktivitas
              </Text>
              <Text style={[
                styles.percentageText,
                { color: getPercentageColor(tutor.overall_percentage) }
              ]}>
                {tutor.overall_percentage}%
              </Text>
            </View>
          </View>
        </View>
        
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <AttendanceChart monthlyData={tutor.monthly_data} />
          {renderMonthlyBreakdown()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16
  },
  tutorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  details: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  maple: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  statText: {
    fontSize: 12,
    color: '#666'
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16
  },
  monthlyBreakdown: {
    marginTop: 16
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  monthName: {
    fontSize: 12,
    color: '#333',
    flex: 1
  },
  monthStats: {
    fontSize: 12,
    color: '#666',
    marginRight: 8
  },
  monthPercentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right'
  }
});

export default TutorAttendanceCard;