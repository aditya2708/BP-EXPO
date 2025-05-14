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
import PrestasiDetailScreen from '../features/adminShelter/screens/anakDetail/PrestasiDetailScreen';
import PrestasiFormScreen from '../features/adminShelter/screens/anakDetail/PrestasiFormScreen';
import SuratScreen from '../features/adminShelter/screens/anakDetail/SuratScreen';
import RiwayatScreen from '../features/adminShelter/screens/anakDetail/RiwayatScreen';
import RiwayatDetailScreen from '../features/adminShelter/screens/anakDetail/RiwayatDetailScreen';
import RiwayatFormScreen from '../features/adminShelter/screens/anakDetail/RiwayatFormScreen';
import CeritaScreen from '../features/adminShelter/screens/anakDetail/CeritaScreen';
import NilaiAnakScreen from '../features/adminShelter/screens/anakDetail/NilaiAnakScreen';
import RaporShelterScreen from '../features/adminShelter/screens/anakDetail/RaporShelterScreen';

// Tutor Screens
import TutorManagementScreen from '../features/adminShelter/screens/TutorManagementScreen';
import TutorFormScreen from '../features/adminShelter/screens/TutorFormScreen';
import TutorDetailScreen from '../features/adminShelter/screens/TutorDetailScreen';



import KelompokTestScreen from '../features/adminShelter/screens/KelompokTestScreen';
import KelompokManagementScreen from '../features/adminShelter/screens/KelompokManagementScreen';
import KelompokFormScreen from '../features/adminShelter/screens/KelompokFormScreen';
import KelompokDetailScreen from '../features/adminShelter/screens/KelompokDetailScreen';
// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const DevStack = createStackNavigator();

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
      
      {/* Prestasi Screens */}
      <ManagementStack.Screen 
        name="Prestasi" 
        component={PrestasiScreen} 
        options={{ headerTitle: 'Prestasi Anak' }}
      />
      <ManagementStack.Screen 
        name="PrestasiDetail" 
        component={PrestasiDetailScreen} 
        options={{ headerTitle: 'Detail Prestasi' }}
      />
      <ManagementStack.Screen 
        name="PrestasiForm" 
        component={PrestasiFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isEdit ? 'Edit Prestasi' : 'Tambah Prestasi'
        })}
      />
      
      {/* Riwayat Screens */}
      <ManagementStack.Screen 
        name="Riwayat" 
        component={RiwayatScreen} 
        options={{ headerTitle: 'Riwayat Anak' }}
      />
      <ManagementStack.Screen 
        name="RiwayatDetail" 
        component={RiwayatDetailScreen} 
        options={{ headerTitle: 'Detail Riwayat' }}
      />
      <ManagementStack.Screen 
        name="RiwayatForm" 
        component={RiwayatFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isEdit ? 'Edit Riwayat' : 'Tambah Riwayat'
        })}
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

      {/* Tutor Screens */}
      <ManagementStack.Screen 
        name="TutorManagement" 
        component={TutorManagementScreen} 
        options={{ headerTitle: 'Tutor Management' }}
      />
      <ManagementStack.Screen 
        name="TutorForm" 
        component={TutorFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.tutor ? 'Edit Tutor' : 'Add New Tutor'
        })}
      />
      <ManagementStack.Screen 
        name="TutorDetail" 
        component={TutorDetailScreen} 
        options={{ headerTitle: 'Tutor Detail' }}
      />
      <ManagementStack.Screen 
  name="KelompokManagement" 
  component={KelompokManagementScreen} 
  options={{ headerTitle: 'Group Management' }}
/>
<ManagementStack.Screen 
  name="KelompokForm" 
  component={KelompokFormScreen} 
  options={({ route }) => ({ 
    headerTitle: route.params?.kelompok ? 'Edit Group' : 'Create Group'
  })}
/>
<ManagementStack.Screen 
  name="KelompokDetail" 
  component={KelompokDetailScreen} 
  options={{ headerTitle: 'Group Details' }}
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

// Developer Stack Navigator for API Testing
const DeveloperStackNavigator = () => {
  return (
    <DevStack.Navigator>
      <DevStack.Screen 
  name="KelompokTest" 
  component={KelompokTestScreen} 
  options={{ headerTitle: 'Kelompok API Test' }}
/>
    </DevStack.Navigator>
  );
};

// Main Tab Navigator for Admin Shelter
const AdminShelterNavigator = () => {
  // Only show dev tab in development mode
  const isDev = __DEV__;
  
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
          } else if (route.name === 'DevTab') {
            iconName = focused ? 'code-working' : 'code-outline';
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
      
      {/* Show Developer tab only in development mode */}
      {isDev && (
        <Tab.Screen 
          name="DevTab" 
          component={DeveloperStackNavigator} 
          options={{ tabBarLabel: 'API Test' }}
        />
      )}
    </Tab.Navigator>
  );
};

export default AdminShelterNavigator;