// src/navigation/AdminCabangNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Dashboard and Core Screens
import AdminCabangDashboardScreen from '../features/adminCabang/screen/AdminCabangDashboardScreen';
import ProfileScreen from '../features/adminCabang/screen/ProfileScreen';

// Landing Screens
import MasterDataMenuScreen from '../features/adminCabang/screens/MasterDataMenuScreen';
import AkademikMenuScreen from '../features/adminCabang/screens/AkademikMenuScreen';

// Master Data - Jenjang Screens
import JenjangListScreen from '../features/adminCabang/screens/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../features/adminCabang/screens/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../features/adminCabang/screens/masterData/jenjang/JenjangDetailScreen';

// Master Data - Mata Pelajaran Screens
import MataPelajaranListScreen from '../features/adminCabang/screens/masterData/mataPelajaran/MataPelajaranListScreen';
import MataPelajaranFormScreen from '../features/adminCabang/screens/masterData/mataPelajaran/MataPelajaranFormScreen';
import MataPelajaranDetailScreen from '../features/adminCabang/screens/masterData/mataPelajaran/MataPelajaranDetailScreen';

// Master Data - Kelas Screens
import KelasListScreen from '../features/adminCabang/screens/masterData/kelas/KelasListScreen';
import KelasFormScreen from '../features/adminCabang/screens/masterData/kelas/KelasFormScreen';
import KelasDetailScreen from '../features/adminCabang/screens/masterData/kelas/KelasDetailScreen';

// Master Data - Materi Screens
import MateriListScreen from '../features/adminCabang/screens/masterData/materi/MateriListScreen';
import MateriFormScreen from '../features/adminCabang/screens/masterData/materi/MateriFormScreen';
import MateriDetailScreen from '../features/adminCabang/screens/masterData/materi/MateriDetailScreen';

// Akademik - Kurikulum Screens
import KurikulumListScreen from '../features/adminCabang/screens/akademik/kurikulum/KurikulumListScreen';
import KurikulumFormScreen from '../features/adminCabang/screens/akademik/kurikulum/KurikulumFormScreen';
import KurikulumDetailScreen from '../features/adminCabang/screens/akademik/kurikulum/KurikulumDetailScreen';

// Management Screens (unchanged)
import ManagementScreen from '../features/adminCabang/screen/ManagementScreen';
import DonaturManagementScreen from '../features/adminCabang/screen/DonaturManagementScreen';
import DonaturFormScreen from '../features/adminCabang/screen/DonaturFormScreen';
import DonaturDetailScreen from '../features/adminCabang/screen/DonaturDetailScreen';
import PengajuanDonaturScreen from '../features/adminCabang/screen/PengajuanDonaturScreen';
import PengajuanDonaturDetailScreen from '../features/adminCabang/screen/PengajuanDonaturDetailScreen';

// Survey Management Screens (if exists)
import SurveyManagementScreen from '../features/adminCabang/screen/SurveyManagementScreen';
import SurveyDetailScreen from '../features/adminCabang/screen/SurveyDetailScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MasterDataStack = createStackNavigator();
const AkademikStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const PengajuanDonaturStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#2ecc71',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

// Home Stack Navigator
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={AdminCabangDashboardScreen} />
    </HomeStack.Navigator>
  );
}

// Master Data Stack Navigator
function MasterDataStackNavigator() {
  return (
    <MasterDataStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Landing Screen */}
      <MasterDataStack.Screen name="MasterDataMenu" component={MasterDataMenuScreen} />
      
      {/* Jenjang Screens */}
      <MasterDataStack.Screen name="JenjangList" component={JenjangListScreen} />
      <MasterDataStack.Screen name="JenjangForm" component={JenjangFormScreen} />
      <MasterDataStack.Screen name="JenjangDetail" component={JenjangDetailScreen} />
      
      {/* Mata Pelajaran Screens */}
      <MasterDataStack.Screen name="MataPelajaranList" component={MataPelajaranListScreen} />
      <MasterDataStack.Screen name="MataPelajaranForm" component={MataPelajaranFormScreen} />
      <MasterDataStack.Screen name="MataPelajaranDetail" component={MataPelajaranDetailScreen} />
      
      {/* Kelas Screens */}
      <MasterDataStack.Screen name="KelasList" component={KelasListScreen} />
      <MasterDataStack.Screen name="KelasForm" component={KelasFormScreen} />
      <MasterDataStack.Screen name="KelasDetail" component={KelasDetailScreen} />
      
      {/* Materi Screens */}
      <MasterDataStack.Screen name="MateriList" component={MateriListScreen} />
      <MasterDataStack.Screen name="MateriForm" component={MateriFormScreen} />
      <MasterDataStack.Screen name="MateriDetail" component={MateriDetailScreen} />
    </MasterDataStack.Navigator>
  );
}

// Akademik Stack Navigator
function AkademikStackNavigator() {
  return (
    <AkademikStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Landing Screen */}
      <AkademikStack.Screen name="AkademikMenu" component={AkademikMenuScreen} />
      
      {/* Kurikulum Screens */}
      <AkademikStack.Screen name="KurikulumList" component={KurikulumListScreen} />
      <AkademikStack.Screen name="KurikulumForm" component={KurikulumFormScreen} />
      <AkademikStack.Screen name="KurikulumDetail" component={KurikulumDetailScreen} />
    </AkademikStack.Navigator>
  );
}

// Management Stack Navigator
function ManagementStackNavigator() {
  return (
    <ManagementStack.Navigator screenOptions={defaultScreenOptions}>
      <ManagementStack.Screen 
        name="ManagementMain" 
        component={ManagementScreen} 
        options={{ title: 'Manajemen' }}
      />
      
      {/* Survey Management */}
      <ManagementStack.Screen 
        name="SurveyManagement" 
        component={SurveyManagementScreen} 
        options={{ title: 'Survey Management' }}
      />
      <ManagementStack.Screen 
        name="SurveyDetail" 
        component={SurveyDetailScreen} 
        options={{ title: 'Detail Survey' }}
      />
      
      {/* Donatur Management */}
      <ManagementStack.Screen 
        name="DonaturManagement" 
        component={DonaturManagementScreen} 
        options={{ title: 'Manajemen Donatur' }}
      />
      <ManagementStack.Screen 
        name="DonaturForm" 
        component={DonaturFormScreen} 
        options={{ title: 'Form Donatur' }}
      />
      <ManagementStack.Screen 
        name="DonaturDetail" 
        component={DonaturDetailScreen} 
        options={{ title: 'Detail Donatur' }}
      />
    </ManagementStack.Navigator>
  );
}

// Pengajuan Donatur Stack Navigator
function PengajuanDonaturStackNavigator() {
  return (
    <PengajuanDonaturStack.Navigator screenOptions={defaultScreenOptions}>
      <PengajuanDonaturStack.Screen 
        name="PengajuanDonaturMain" 
        component={PengajuanDonaturScreen} 
        options={{ title: 'Pengajuan Donatur' }}
      />
      <PengajuanDonaturStack.Screen 
        name="PengajuanDonaturDetail" 
        component={PengajuanDonaturDetailScreen} 
        options={{ title: 'Detail Pengajuan' }}
      />
    </PengajuanDonaturStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }}
      />
    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
export default function AdminCabangNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MasterData') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Akademik') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'PengajuanDonatur') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
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
      <Tab.Screen 
        name="Management" 
        component={ManagementStackNavigator} 
        options={{ tabBarLabel: 'Manajemen' }} 
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
