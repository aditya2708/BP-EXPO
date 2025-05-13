import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import AdminShelterDashboardScreen from '../features/adminShelter/screens/AdminShelterDashboardScreen';
import AdminShelterProfileScreen from '../features/adminShelter/screens/AdminShelterProfileScreen';
import AnakManagementScreen from '../features/adminShelter/screens/AnakManagementScreen';
import AnakDetailScreen from '../features/adminShelter/screens/AnakDetailScreen';
import AttendanceScreen from '../features/adminShelter/screens/AttendaceScreen';

// Import Anak Detail Screens
import InformasiAnakScreen from '../features/adminShelter/screens/anakDetail/InformasiAnakScreen';
import RaportScreen from '../features/adminShelter/screens/anakDetail/RaportScreen';
import AddRaportScreen from '../features/adminShelter/screens/anakDetail/AddRaportScreen';
import RaportDetailScreen from '../features/adminShelter/screens/anakDetail/RaportDetailScreen';
import PrestasiScreen from '../features/adminShelter/screens/anakDetail/PrestasiScreen';
import SuratScreen from '../features/adminShelter/screens/anakDetail/SuratScreen';
import RiwayatScreen from '../features/adminShelter/screens/anakDetail/RiwayatScreen';
import CeritaScreen from '../features/adminShelter/screens/anakDetail/CeritaScreen';
import NilaiAnakScreen from '../features/adminShelter/screens/anakDetail/NilaiAnakScreen';
import RaporShelterScreen from '../features/adminShelter/screens/anakDetail/RaporShelterScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Dashboard" 
        component={AdminShelterDashboardScreen} 
        options={{ headerTitle: 'Admin Shelter Dashboard' }}
      />
      <HomeStack.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{ headerTitle: 'Attendance Records' }}
      />
    </HomeStack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      <ManagementStack.Screen 
        name="AnakManagement" 
        component={AnakManagementScreen} 
        options={{ headerTitle: 'Children Management' }}
      />
      <ManagementStack.Screen 
        name="AnakDetail" 
        component={AnakDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isNew ? 'Add New Child' : (route.params?.title || 'Child Detail')
        })}
      />
      
      {/* Anak Detail Screens */}
      <ManagementStack.Screen 
        name="InformasiAnak" 
        component={InformasiAnakScreen} 
        options={{ headerTitle: 'Informasi Anak' }}
      />
      <ManagementStack.Screen 
        name="Raport" 
        component={RaportScreen} 
        options={{ headerTitle: 'Raport Anak' }}
      />
      <ManagementStack.Screen 
        name="AddRaport" 
        component={AddRaportScreen} 
        options={{ headerTitle: 'Tambah Raport' }}
      />
    
      <ManagementStack.Screen 
        name="RaportDetail" 
        component={RaportDetailScreen} 
        options={{ headerTitle: 'Detail Raport' }}
      />
      <ManagementStack.Screen 
        name="Prestasi" 
        component={PrestasiScreen} 
        options={{ headerTitle: 'Prestasi Anak' }}
      />
      {/* <ManagementStack.Screen 
        name="Surat" 
        component={SuratScreen} 
        options={{ headerTitle: 'Surat Anak' }}
      /> */}
      <ManagementStack.Screen 
        name="Riwayat" 
        component={RiwayatScreen} 
        options={{ headerTitle: 'Riwayat Anak' }}
      />
      <ManagementStack.Screen 
        name="Cerita" 
        component={CeritaScreen} 
        options={{ headerTitle: 'Cerita Anak' }}
      />
      <ManagementStack.Screen 
        name="NilaiAnak" 
        component={NilaiAnakScreen} 
        options={{ headerTitle: 'Nilai Anak' }}
      />
      <ManagementStack.Screen 
        name="RaporShelter" 
        component={RaporShelterScreen} 
        options={{ headerTitle: 'Rapor Shelter' }}
      />
    </ManagementStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={AdminShelterProfileScreen} 
        options={{ headerTitle: 'My Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator for Admin Shelter
const AdminShelterNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
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
        options={{ tabBarLabel: 'Management' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AdminShelterNavigator;