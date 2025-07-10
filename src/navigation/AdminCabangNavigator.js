import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import AdminCabangDashboardScreen from '../features/adminCabang/screen/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screen/AdminCabangProfileScreen';
import SurveyStatusFilterScreen from '../features/adminCabang/screen/SurveyStatusFilterScreen';
import SurveyApprovalDetailScreen from '../features/adminCabang/screen/SurveyApprovalDetailScreen';
import AdminCabangPengajuanDonaturScreen from '../features/adminCabang/screen/AdminCabangPengajuanDonaturScreen';
import DonaturSelectionScreen from '../features/adminCabang/screen/DonaturSelectionScreen';
import ChildDetailScreen from '../features/adminCabang/screen/ChildDetailScreen';
import AdminCabangDonaturListScreen from '../features/adminCabang/screen/AdminCabangDonaturListScreen';
import AdminCabangDonaturFormScreen from '../features/adminCabang/screen/AdminCabangDonaturFormScreen';
import AdminCabangDonaturDetailScreen from '../features/adminCabang/screen/AdminCabangDonaturDetailScreen';
import DonaturFilterScreen from '../features/adminCabang/screen/DonaturFilterScreen';

// Kurikulum Management Screens
import KurikulumManagementScreen from '../features/adminCabang/screen/KurikulumManagementScreen';
import KurikulumFormScreen from '../features/adminCabang/screen/KurikulumFormScreen';
import KurikulumDetailScreen from '../features/adminCabang/screen/KurikulumDetailScreen';
import MateriKurikulumScreen from '../features/adminCabang/screen/MateriKurikulumScreen';

// Mata Pelajaran Management Screens
import MataPelajaranManagementScreen from '../features/adminCabang/screen/MataPelajaranManagementScreen';
import MataPelajaranFormScreen from '../features/adminCabang/screen/MataPelajaranFormScreen';
import MataPelajaranDetailScreen from '../features/adminCabang/screen/MataPelajaranDetailScreen';

// Jenjang Management Screens
import JenjangManagementScreen from '../features/adminCabang/screen/JenjangManagementScreen';
import JenjangFormScreen from '../features/adminCabang/screen/JenjangFormScreen';
import JenjangDetailScreen from '../features/adminCabang/screen/JenjangDetailScreen';

// Kelas Management Screens
import KelasManagementScreen from '../features/adminCabang/screen/KelasManagementScreen';
import KelasFormScreen from '../features/adminCabang/screen/KelasFormScreen';
import KelasDetailScreen from '../features/adminCabang/screen/KelasDetailScreen';

// Materi Management Screens
import MateriManagementScreen from '../features/adminCabang/screen/MateriManagementScreen';
import MateriFormScreen from '../features/adminCabang/screen/MateriFormScreen';
import MateriDetailScreen from '../features/adminCabang/screen/MateriDetailScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const PengajuanDonaturStack = createStackNavigator();
const DonaturStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Dashboard" 
        component={AdminCabangDashboardScreen} 
        options={{ headerTitle: 'Dashboard Admin Cabang' }}
      />
      <HomeStack.Screen 
        name="SurveyDetail" 
        component={SurveyApprovalDetailScreen} 
        options={{ headerTitle: 'Survey Detail' }}
      />
    </HomeStack.Navigator>
  );
};

const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      <ManagementStack.Screen 
        name="SurveyStatusFilter" 
        component={SurveyStatusFilterScreen} 
        options={{ headerTitle: 'Manajemen Survei' }}
      />
      <ManagementStack.Screen 
        name="SurveyApprovalDetail" 
        component={SurveyApprovalDetailScreen} 
        options={{ headerTitle: 'Detail Survei' }}
      />
      
      {/* Kurikulum Management */}
      <ManagementStack.Screen 
        name="KurikulumManagement" 
        component={KurikulumManagementScreen} 
        options={{ headerTitle: 'Manajemen Kurikulum' }}
      />
      <ManagementStack.Screen 
        name="KurikulumForm" 
        component={KurikulumFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.kurikulum ? 'Edit Kurikulum' : 'Tambah Kurikulum'
        })}
      />
      <ManagementStack.Screen 
        name="KurikulumDetail" 
        component={KurikulumDetailScreen} 
        options={{ headerTitle: 'Detail Kurikulum' }}
      />
      <ManagementStack.Screen 
        name="MateriKurikulum" 
        component={MateriKurikulumScreen} 
        options={{ headerTitle: 'Materi Kurikulum' }}
      />

      {/* Jenjang Management */}
      <ManagementStack.Screen 
        name="JenjangManagement" 
        component={JenjangManagementScreen} 
        options={{ headerTitle: 'Manajemen Jenjang' }}
      />
      <ManagementStack.Screen 
        name="JenjangForm" 
        component={JenjangFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.jenjang ? 'Edit Jenjang' : 'Tambah Jenjang'
        })}
      />
      <ManagementStack.Screen 
        name="JenjangDetail" 
        component={JenjangDetailScreen} 
        options={{ headerTitle: 'Detail Jenjang' }}
      />

      {/* Kelas Management */}
      <ManagementStack.Screen 
        name="KelasManagement" 
        component={KelasManagementScreen} 
        options={{ headerTitle: 'Manajemen Kelas' }}
      />
      <ManagementStack.Screen 
        name="KelasForm" 
        component={KelasFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.kelas ? 'Edit Kelas' : 'Tambah Kelas'
        })}
      />
      <ManagementStack.Screen 
        name="KelasDetail" 
        component={KelasDetailScreen} 
        options={{ headerTitle: 'Detail Kelas' }}
      />

      {/* Mata Pelajaran Management */}
      <ManagementStack.Screen 
        name="MataPelajaranManagement" 
        component={MataPelajaranManagementScreen} 
        options={{ headerTitle: 'Manajemen Mata Pelajaran' }}
      />
      <ManagementStack.Screen 
        name="MataPelajaranForm" 
        component={MataPelajaranFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.mataPelajaran ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'
        })}
      />
      <ManagementStack.Screen 
        name="MataPelajaranDetail" 
        component={MataPelajaranDetailScreen} 
        options={{ headerTitle: 'Detail Mata Pelajaran' }}
      />

      {/* Materi Management */}
      <ManagementStack.Screen 
        name="MateriManagement" 
        component={MateriManagementScreen} 
        options={{ headerTitle: 'Manajemen Materi' }}
      />
      <ManagementStack.Screen 
        name="MateriForm" 
        component={MateriFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.materi ? 'Edit Materi' : 'Tambah Materi'
        })}
      />
      <ManagementStack.Screen 
        name="MateriDetail" 
        component={MateriDetailScreen} 
        options={{ headerTitle: 'Detail Materi' }}
      />
    </ManagementStack.Navigator>
  );
};

const PengajuanDonaturStackNavigator = () => {
  return (
    <PengajuanDonaturStack.Navigator>
      <PengajuanDonaturStack.Screen 
        name="PengajuanDonaturList" 
        component={AdminCabangPengajuanDonaturScreen} 
        options={{ headerTitle: 'Pengajuan Donatur' }}
      />
      <PengajuanDonaturStack.Screen 
        name="DonaturSelection" 
        component={DonaturSelectionScreen} 
        options={{ headerTitle: 'Pilih Donatur' }}
      />
      <PengajuanDonaturStack.Screen 
        name="ChildDetail" 
        component={ChildDetailScreen} 
        options={{ headerTitle: 'Detail Anak' }}
      />
    </PengajuanDonaturStack.Navigator>
  );
};

const DonaturStackNavigator = () => {
  return (
    <DonaturStack.Navigator>
      <DonaturStack.Screen 
        name="DonaturList" 
        component={AdminCabangDonaturListScreen} 
        options={{ headerTitle: 'Manajemen Donatur' }}
      />
      <DonaturStack.Screen 
        name="DonaturForm" 
        component={AdminCabangDonaturFormScreen} 
        options={({ route }) => ({
          headerTitle: route.params?.donaturId ? 'Edit Donatur' : 'Tambah Donatur'
        })}
      />
      <DonaturStack.Screen 
        name="DonaturDetail" 
        component={AdminCabangDonaturDetailScreen} 
        options={{ headerTitle: 'Detail Donatur' }}
      />
      <DonaturStack.Screen 
        name="DonaturFilter" 
        component={DonaturFilterScreen} 
        options={{ headerTitle: 'Filter Donatur' }}
      />
    </DonaturStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={AdminCabangProfileScreen} 
        options={{ headerTitle: 'Profil Saya' }}
      />
    </ProfileStack.Navigator>
  );
};

const AdminCabangNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'PengajuanDonatur') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'DonaturManagement') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Management" 
        component={ManagementStackNavigator} 
        options={{ tabBarLabel: 'Kurikulum' }}
      />
      <Tab.Screen 
        name="PengajuanDonatur" 
        component={PengajuanDonaturStackNavigator} 
        options={{ tabBarLabel: 'Pengajuan' }}
      />
      <Tab.Screen 
        name="DonaturManagement" 
        component={DonaturStackNavigator} 
        options={{ tabBarLabel: 'Donatur' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default AdminCabangNavigator;