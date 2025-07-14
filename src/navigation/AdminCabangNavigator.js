import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Dashboard screens
import AdminCabangDashboardScreen from '../features/adminCabang/screens/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screens/AdminCabangProfileScreen';
import SurveyStatusFilterScreen from '../features/adminCabang/screens/SurveyStatusFilterScreen';
import SurveyApprovalDetailScreen from '../features/adminCabang/screens/SurveyApprovalDetailScreen';
import AdminCabangPengajuanDonaturScreen from '../features/adminCabang/screens/AdminCabangPengajuanDonaturScreen';
import DonaturSelectionScreen from '../features/adminCabang/screens/DonaturSelectionScreen';
import ChildDetailScreen from '../features/adminCabang/screens/ChildDetailScreen';
import AdminCabangDonaturListScreen from '../features/adminCabang/screens/AdminCabangDonaturListScreen';
import AdminCabangDonaturFormScreen from '../features/adminCabang/screens/AdminCabangDonaturFormScreen';
import AdminCabangDonaturDetailScreen from '../features/adminCabang/screens/AdminCabangDonaturDetailScreen';
import DonaturFilterScreen from '../features/adminCabang/screens/DonaturFilterScreen';

// Master Data screens
import MasterDataMenuScreen from '../features/adminCabang/screens/MasterDataMenuScreen';
import JenjangListScreen from '../features/adminCabang/screens/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../features/adminCabang/screens/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../features/adminCabang/screens/masterData/jenjang/JenjangDetailScreen';

// Akademik screens
import AkademikMenuScreen from '../features/adminCabang/screens/AkademikMenuScreen';

const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();
const MasterDataStack = createStackNavigator();
const AkademikStack = createStackNavigator();

// Dashboard Stack Navigator
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

// Master Data Stack Navigator
const MasterDataStackNavigator = () => {
  return (
    <MasterDataStack.Navigator>
      <MasterDataStack.Screen 
        name="MasterDataMenu" 
        component={MasterDataMenuScreen} 
        options={{ headerTitle: 'Master Data' }}
      />
      
      {/* Jenjang Screens */}
      <MasterDataStack.Screen 
        name="JenjangList" 
        component={JenjangListScreen} 
        options={{ headerTitle: 'Jenjang' }}
      />
      <MasterDataStack.Screen 
        name="JenjangForm" 
        component={JenjangFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isEdit ? 'Edit Jenjang' : 'Tambah Jenjang' 
        })}
      />
      <MasterDataStack.Screen 
        name="JenjangDetail" 
        component={JenjangDetailScreen} 
        options={{ headerTitle: 'Detail Jenjang' }}
      />
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
      {/* TODO: Add Kurikulum screens */}
    </AkademikStack.Navigator>
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
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardStackNavigator} 
        options={{ 
          tabBarLabel: 'Dashboard',
          title: 'Dashboard'
        }}
      />
      <Tab.Screen 
        name="MasterData" 
        component={MasterDataStackNavigator} 
        options={{ 
          tabBarLabel: 'Master Data',
          title: 'Master Data'
        }}
      />
      <Tab.Screen 
        name="Akademik" 
        component={AkademikStackNavigator} 
        options={{ 
          tabBarLabel: 'Akademik',
          title: 'Akademik'
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminCabangNavigator;