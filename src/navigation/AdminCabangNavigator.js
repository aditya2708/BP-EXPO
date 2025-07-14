import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Existing screens
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

// New landing screens (to be created)
import MasterDataMenuScreen from '../features/adminCabang/screen/MasterDataMenuScreen';
import AkademikMenuScreen from '../features/adminCabang/screen/AkademikMenuScreen';

const Tab = createBottomTabNavigator();
const MasterDataStack = createStackNavigator();
const AkademikStack = createStackNavigator();
const DashboardStack = createStackNavigator();

// Master Data Stack Navigator
const MasterDataStackNavigator = () => {
  return (
    <MasterDataStack.Navigator>
      <MasterDataStack.Screen 
        name="MasterDataMenu" 
        component={MasterDataMenuScreen} 
        options={{ headerTitle: 'Master Data' }}
      />
      {/* TODO: Add Jenjang, MataPelajaran, Kelas, Materi stacks */}
    </MasterDataStack.Navigator>
  );
};

// Akademik Stack Navigator
const AkademikStackNavigator = () => {
  return (
    <AkademikStack.Navigator>
      <AkademikStack.Screen 
        name="AkademikMenu" 
        component={AkademikMenuScreen} 
        options={{ headerTitle: 'Akademik' }}
      />
      {/* TODO: Add Kurikulum stack */}
    </AkademikStack.Navigator>
  );
};

// Dashboard Stack Navigator (consolidating existing functionality)
const DashboardStackNavigator = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen 
        name="Dashboard" 
        component={AdminCabangDashboardScreen} 
        options={{ headerTitle: 'Dashboard Admin Cabang' }}
      />
      <DashboardStack.Screen 
        name="Profile" 
        component={AdminCabangProfileScreen} 
        options={{ headerTitle: 'Profil Saya' }}
      />
      
      {/* Survey Management */}
      <DashboardStack.Screen 
        name="SurveyStatusFilter" 
        component={SurveyStatusFilterScreen} 
        options={{ headerTitle: 'Manajemen Survei' }}
      />
      <DashboardStack.Screen 
        name="SurveyApprovalDetail" 
        component={SurveyApprovalDetailScreen} 
        options={{ headerTitle: 'Detail Survei' }}
      />
      
      {/* Pengajuan Donatur */}
      <DashboardStack.Screen 
        name="PengajuanDonaturList" 
        component={AdminCabangPengajuanDonaturScreen} 
        options={{ headerTitle: 'Pengajuan Donatur' }}
      />
      <DashboardStack.Screen 
        name="DonaturSelection" 
        component={DonaturSelectionScreen} 
        options={{ headerTitle: 'Pilih Donatur' }}
      />
      <DashboardStack.Screen 
        name="ChildDetail" 
        component={ChildDetailScreen} 
        options={{ headerTitle: 'Detail Anak' }}
      />
      
      {/* Donatur Management */}
      <DashboardStack.Screen 
        name="DonaturList" 
        component={AdminCabangDonaturListScreen} 
        options={{ headerTitle: 'Manajemen Donatur' }}
      />
      <DashboardStack.Screen 
        name="DonaturForm" 
        component={AdminCabangDonaturFormScreen} 
        options={({ route }) => ({
          headerTitle: route.params?.donaturId ? 'Edit Donatur' : 'Tambah Donatur'
        })}
      />
      <DashboardStack.Screen 
        name="DonaturDetail" 
        component={AdminCabangDonaturDetailScreen} 
        options={{ headerTitle: 'Detail Donatur' }}
      />
      <DashboardStack.Screen 
        name="DonaturFilter" 
        component={DonaturFilterScreen} 
        options={{ headerTitle: 'Filter Donatur' }}
      />
    </DashboardStack.Navigator>
  );
};

const AdminCabangNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'MasterData') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Akademik') {
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardStackNavigator} 
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="MasterData" 
        component={MasterDataStackNavigator} 
        options={{ tabBarLabel: 'Master Data' }}
      />
      <Tab.Screen 
        name="Akademik" 
        component={AkademikStackNavigator} 
        options={{ tabBarLabel: 'Akademik' }}
      />
    </Tab.Navigator>
  );
};

export default AdminCabangNavigator;