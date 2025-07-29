import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MateriUsageAnalytics from '../../../components/specific/materi/MateriUsageAnalytics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const MateriStatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};

  const handleMateriPress = (materi) => {
    navigation.navigate('MateriDetail', { 
      id: materi.id_materi, 
      item: materi 
    });
  };

  const handleExportReport = async (reportData, format) => {
    try {
      const fileName = `materi_analytics_${Date.now()}.${format}`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      let content;
      switch (format) {
        case 'json':
          content = JSON.stringify(reportData, null, 2);
          break;
        case 'csv':
          content = convertToCSV(reportData);
          break;
        default:
          content = JSON.stringify(reportData, null, 2);
      }
      
      await FileSystem.writeAsStringAsync(fileUri, content);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: format === 'json' ? 'application/json' : 'text/csv',
          dialogTitle: 'Export Analytics Report'
        });
      } else {
        Alert.alert('Success', `Report saved to ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export report');
    }
  };

  const convertToCSV = (data) => {
    // Simple CSV conversion for analytics data
    let csv = 'Metric,Value\n';
    
    if (data.overview) {
      csv += `Total Materi,${data.overview.total_materi}\n`;
      csv += `Used Materi,${data.overview.used_materi}\n`;
      csv += `Unused Materi,${data.overview.unused_materi}\n`;
      csv += `Average per Kurikulum,${data.overview.avg_per_kurikulum}\n`;
    }
    
    if (data.unused) {
      csv += '\nUnused Materi\n';
      csv += 'Name,Mata Pelajaran,Kelas,Created\n';
      data.unused.forEach(item => {
        csv += `"${item.nama_materi}","${item.mata_pelajaran?.nama_mata_pelajaran || ''}","${item.kelas?.nama_kelas || ''}","${item.created_at}"\n`;
      });
    }
    
    return csv;
  };

  return (
    <SafeAreaView style={styles.container}>
      <MateriUsageAnalytics
        materiId={id}
        onMateriPress={handleMateriPress}
        onExportReport={handleExportReport}
        style={styles.analytics}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  analytics: {
    flex: 1
  }
});

export default MateriStatsScreen;