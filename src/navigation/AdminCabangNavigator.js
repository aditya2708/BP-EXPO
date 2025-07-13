// src/navigation/AdminCabangNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Dashboard and Core Screens
import AdminCabangDashboardScreen from '../features/adminCabang/screen/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screen/AdminCabangProfileScreen';

// Landing Screens
import MasterDataMenuScreen from '../features/adminCabang/screen/MasterDataMenuScreen';
import AkademikMenuScreen from '../features/adminCabang/screen/AkademikMenuScreen';

// Master Data Screens
import JenjangListScreen from '../features/adminCabang/screen/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../features/adminCabang/screen/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../features/adminCabang/screen/masterData/jenjang/JenjangDetailScreen';
import MataPelajaranListScreen from '../features/adminCabang/screen/masterData/mataPelajaran/MataPelajaranListScreen';
import MataPelajaranFormScreen from '../features/adminCabang/screen/masterData/mataPelajaran/MataPelajaranFormScreen';
import MataPelajaranDetailScreen from '../features/adminCabang/screen/masterData/mataPelajaran/MataPelajaranDetailScreen';
import KelasListScreen from '../features/adminCabang/screen/masterData/kelas/KelasListScreen';
import KelasFormScreen from '../features/adminCabang/screen/masterData/kelas/KelasFormScreen';
import KelasDetailScreen from '../features/adminCabang/screen/masterData/kelas/KelasDetailScreen';
import MateriListScreen from '../features/adminCabang/screen/masterData/materi/MateriListScreen';
import MateriFormScreen from '../features/adminCabang/screen/masterData/materi/MateriFormScreen';
import MateriDetailScreen from '../features/adminCabang/screen/masterData/materi/MateriDetailScreen';

// Akademik Screens
import KurikulumListScreen from '../features/adminCabang/screen/akademik/kurikulum/KurikulumListScreen';
import KurikulumFormScreen from '../features/adminCabang/screen/akademik/kurikulum/KurikulumFormScreen';
import KurikulumDetailScreen from '../features/adminCabang/screen/akademik/kurikulum/KurikulumDetailScreen';

// Management Screens
import AdminCabangManagementMenuScreen from '../features/adminCabang/screen/AdminCabangManagementMenuScreen';
import AdminCabangDonaturManagementScreen from '../features/adminCabang/screen/AdminCabangDonaturManagementScreen';
import AdminCabangDonaturFormScreen from '../features/adminCabang/screen/AdminCabangDonaturFormScreen';
import AdminCabangDonaturDetailScreen from '../features/adminCabang/screen/AdminCabangDonaturDetailScreen';
import AdminCabangPengajuanDonaturScreen from '../features/adminCabang/screen/AdminCabangPengajuanDonaturScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MasterDataStack = createStackNavigator();
const AkademikStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const PengajuanDonaturStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const defaultScreenOptions = {
  headerStyle: { backgroundColor: '#2ecc71' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

// Stack Navigators
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Dashboard" component={AdminCabangDashboardScreen} />
  </HomeStack.Navigator>
);

const MasterDataStackNavigator = () => (
  <MasterDataStack.Navigator screenOptions={{ headerShown: false }}>
    <MasterDataStack.Screen name="MasterDataMenu" component={MasterDataMenuScreen} />
    <MasterDataStack.Screen name="JenjangList" component={JenjangListScreen} />
    <MasterDataStack.Screen name="JenjangForm" component={JenjangFormScreen} />
    <MasterDataStack.Screen name="JenjangDetail" component={JenjangDetailScreen} />
    <MasterDataStack.Screen name="MataPelajaranList" component={MataPelajaranListScreen} />
    <MasterDataStack.Screen name="MataPelajaranForm" component={MataPelajaranFormScreen} />
    <MasterDataStack.Screen name="MataPelajaranDetail" component={MataPelajaranDetailScreen} />
    <MasterDataStack.Screen name="KelasList" component={KelasListScreen} />
    <MasterDataStack.Screen name="KelasForm" component={KelasFormScreen} />
    <MasterDataStack.Screen name="KelasDetail" component={KelasDetailScreen} />
    <MasterDataStack.Screen name="MateriList" component={MateriListScreen} />
    <MasterDataStack.Screen name="MateriForm" component={MateriFormScreen} />
    <MasterDataStack.Screen name="MateriDetail" component={MateriDetailScreen} />
  </MasterDataStack.Navigator>
);

const AkademikStackNavigator = () => (
  <AkademikStack.Navigator screenOptions={{ headerShown: false }}>
    <AkademikStack.Screen name="AkademikMenu" component={AkademikMenuScreen} />
    <AkademikStack.Screen name="KurikulumList" component={KurikulumListScreen} />
    <AkademikStack.Screen name="KurikulumForm" component={KurikulumFormScreen} />
    <AkademikStack.Screen name="KurikulumDetail" component={KurikulumDetailScreen} />
  </AkademikStack.Navigator>
);

const ManagementStackNavigator = () => (
  <ManagementStack.Navigator screenOptions={defaultScreenOptions}>
    <ManagementStack.Screen 
      name="ManagementMain" 
      component={AdminCabangManagementMenuScreen} 
      options={{ title: 'Manajemen' }}
    />
    <ManagementStack.Screen 
      name="DonaturManagement" 
      component={AdminCabangDonaturManagementScreen} 
      options={{ title: 'Manajemen Donatur' }}
    />
    <ManagementStack.Screen 
      name="DonaturForm" 
      component={AdminCabangDonaturFormScreen} 
      options={{ title: 'Form Donatur' }}
    />
    <ManagementStack.Screen 
      name="DonaturDetail" 
      component={AdminCabangDonaturDetailScreen} 
      options={{ title: 'Detail Donatur' }}
    />
  </ManagementStack.Navigator>
);

const PengajuanDonaturStackNavigator = () => (
  <PengajuanDonaturStack.Navigator screenOptions={defaultScreenOptions}>
    <PengajuanDonaturStack.Screen 
      name="PengajuanDonaturMain" 
      component={AdminCabangPengajuanDonaturScreen} 
      options={{ title: 'Pengajuan Donatur' }}
    />
  </PengajuanDonaturStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
    <ProfileStack.Screen 
      name="ProfileMain" 
      component={AdminCabangProfileScreen} 
      options={{ title: 'Profil' }}
    />
  </ProfileStack.Navigator>
);

// Main Tab Navigator
export default function AdminCabangNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            MasterData: focused ? 'library' : 'library-outline',
            Akademik: focused ? 'school' : 'school-outline',
            Management: focused ? 'settings' : 'settings-outline',
            PengajuanDonatur: focused ? 'document-text' : 'document-text-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ tabBarLabel: 'Beranda' }}
      />
      <Tab.Screen 
        name="MasterData" 
        component={MasterDataStackNavigator} 
        options={{ tabBarLabel: 'Master D..' }}
      />
      <Tab.Screen 
        name="Akademik" 
        component={AkademikStackNavigator} 
        options={{ tabBarLabel: 'Akademik' }}
      />
      <Tab.Screen 
        name="Management" 
        component={ManagementStackNavigator} 
        options={{ tabBarLabel: 'Manajem..' }}
      />
      <Tab.Screen 
        name="PengajuanDonatur" 
        component={PengajuanDonaturStackNavigator} 
        options={{ tabBarLabel: 'Pengajuan' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}