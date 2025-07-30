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
      color: '#3B82F6',
      route: 'JenjangList',
      statsRoute: 'JenjangStats',
      available: true
    },
    {
      id: 'mata_pelajaran',
      title: 'Mata Pelajaran',
      description: 'Kelola data mata pelajaran',
      icon: 'book-outline',
      color: '#10B981',
      route: 'MataPelajaranList',
      statsRoute: 'MataPelajaranStats',
      available: true
    },
    {
      id: 'kelas',
      title: 'Kelas',
      description: 'Kelola data kelas',
      icon: 'people-outline',
      color: '#F59E0B',
      route: 'KelasList',
      statsRoute: 'KelasStats',
      available: true
    },
    {
      id: 'materi',
      title: 'Materi',
      description: 'Kelola data materi pembelajaran',
      icon: 'document-text-outline',
      color: '#06B6D4',
      route: 'MateriList',
      statsRoute: 'MateriStats',
      available: true
    }
  ];

  const handleMenuPress = (item) => {
    if (item.available) {
      navigation.navigate(item.route);
    }
  };

  const handleStatsPress = (item, event) => {
    event.stopPropagation();
    if (item.available) {
      navigation.navigate(item.statsRoute);
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
          color={item.available ? item.color : '#6c757d'} 
        />
      </View>
      
      <View style={styles.menuContent}>
        <View style={styles.menuHeader}>
          <Text style={[
            styles.menuTitle,
            !item.available && styles.menuTitleDisabled
          ]}>
            {item.title}
          </Text>
          
          {item.available && (
            <TouchableOpacity
              style={[styles.statsButton, { borderColor: item.color }]}
              onPress={(event) => handleStatsPress(item, event)}
              activeOpacity={0.7}
            >
              <Ionicons name="analytics-outline" size={16} color={item.color} />
              <Text style={[styles.statsButtonText, { color: item.color }]}>
                Stats
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={[
          styles.menuDescription,
          !item.available && styles.menuDescriptionDisabled
        ]}>
          {item.description}
        </Text>
        
        {!item.available && (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
      
      {item.available && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#6c757d" 
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Master Data</Text>
          <Text style={styles.headerSubtitle}>
            Kelola data dasar sistem pembelajaran
          </Text>
        </View>

        {/* Quick Stats Overview */}
        <View style={styles.quickStatsContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickStatsGrid}>
            {menuItems.filter(item => item.available).map((item) => (
              <TouchableOpacity
                key={`quick-${item.id}`}
                style={[styles.quickStatCard, { borderColor: item.color }]}
                onPress={() => handleStatsPress(item, {})}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text style={styles.quickStatTitle}>{item.title}</Text>
                <Text style={styles.quickStatLabel}>Statistik</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Panduan Penggunaan</Text>
              <Text style={styles.infoText}>
                Gunakan menu di atas untuk mengelola data master sistem. 
                Mulai dari jenjang, lalu mata pelajaran, kelas, dan terakhir materi.
              </Text>
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
    backgroundColor: '#F8FAFC'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 24
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  quickStatsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  quickStatCard: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8
  },
  quickStatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center'
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6B7280'
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  menuItemDisabled: {
    opacity: 0.6
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  menuContent: {
    flex: 1
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  menuTitleDisabled: {
    color: '#6c757d'
  },
  menuDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  menuDescriptionDisabled: {
    color: '#9CA3AF'
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
    gap: 4
  },
  statsButtonText: {
    fontSize: 12,
    fontWeight: '500'
  },
  comingSoon: {
    marginTop: 8
  },
  comingSoonText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#F59E0B'
  },
  chevron: {
    marginLeft: 8
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  infoContent: {
    flex: 1,
    marginLeft: 12
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  }
});

export default MasterDataMainScreen;