import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LaporanAnakBinaanScreen = () => (
  <View style={styles.container}>
    <Ionicons name="construct" size={80} color="#cccccc" />
    <Text style={styles.title}>Fitur Dalam Pengembangan</Text>
    <Text style={styles.message}>
      Laporan Anak Binaan sedang dalam tahap pengembangan.{'\n'}
      Mohon tunggu update selanjutnya.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 }
});

export default LaporanAnakBinaanScreen;