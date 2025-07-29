import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MasterDataMainScreen = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      id: 'jenjang',
      title: 'Jenjang',
      description: 'Kelola data jenjang pendidikan',
      icon: 'library-outline',
      color: '#007bff',
      route: 'JenjangList',
      available: true
    },
    {
      id: 'mata_pelajaran',
      title: 'Mata Pelajaran',
      description: 'Kelola data mata pelajaran',
      icon: 'book-outline',
      color: '#28a745',
      route: 'MataPelajaranList',
      available: true
    },
    {
      id: 'kelas',
      title: 'Kelas',
      description: 'Kelola data kelas',
      icon: 'people-outline',
      color: '#ffc107',
      route: 'KelasList',
      available: false // TODO: Phase 3
    },
    {
      id: 'materi',
      title: 'Materi',
      description: 'Kelola data materi pembelajaran',
      icon: 'document-text-outline',
      color: '#17a2b8',
      route: 'MateriList',
      available: false // TODO: Phase 4
    }
  ];

  const handleMenuPress = (item) => {
    if (item.available) {
      navigation.navigate(item.route);
    }
  };

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        !item.available && styles.menuItemDisabled
      ]}
      onPress={() => handleMenuPress(item)}
      activeOpacity={item.available ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons 
          name={item.icon} 
          size={32} 
          color={item.available ? item.color : '#ccc'} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[
          styles.menuTitle,
          !item.available && styles.disabledText
        ]}>
          {item.title}
        </Text>
        <Text style={[
          styles.menuDescription,
          !item.available && styles.disabledText
        ]}>
          {item.description}
        </Text>
        {!item.available && (
          <Text style={styles.comingSoon}>Segera hadir</Text>
        )}
      </View>
      
      {item.available && (
        <Ionicons name="chevron-forward" size={24} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Master Data</Text>
          <Text style={styles.subtitle}>
            Kelola data dasar sistem akademik
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.info}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color="#007bff" />
            <Text style={styles.infoText}>
              Data master digunakan sebagai referensi untuk semua fitur akademik
            </Text>
          </View>
          
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Progress Implementasi</Text>
            <View style={styles.progressItems}>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: '#28a745' }]} />
                <Text style={styles.progressText}>Jenjang - Selesai</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: '#28a745' }]} />
                <Text style={styles.progressText}>Mata Pelajaran - Selesai</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: '#ffc107' }]} />
                <Text style={styles.progressText}>Kelas - Dalam Pengembangan</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: '#6c757d' }]} />
                <Text style={styles.progressText}>Materi - Menunggu</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    padding: 16
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  menuContainer: {
    gap: 12,
    marginBottom: 24
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  menuItemDisabled: {
    opacity: 0.6
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  textContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  disabledText: {
    color: '#ccc'
  },
  comingSoon: {
    fontSize: 12,
    color: '#ffc107',
    fontWeight: '600',
    marginTop: 4
  },
  info: {
    gap: 16
  },
  infoCard: {
    backgroundColor: '#e7f3ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8
  },
  infoText: {
    fontSize: 14,
    color: '#007bff',
    marginLeft: 8,
    flex: 1
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  progressItems: {
    gap: 8
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  progressText: {
    fontSize: 14,
    color: '#666'
  }
});

export default MasterDataMainScreen;