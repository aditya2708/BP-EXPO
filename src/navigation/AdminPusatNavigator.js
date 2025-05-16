import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import AdminPusatDashboardScreen from '../features/adminPusat/screens/AdminPusatDashboardScreen';
import AdminPusatProfileScreen from '../features/adminPusat/screens/AdminPusatProfileScreen';
// import UserManagementScreen from '../features/adminPusat/screens/UserManagementScreen';
// import UserDetailScreen from '../features/adminPusat/screens/UserDetailScreen';
// import KacabManagementScreen from '../features/adminPusat/screens/KacabManagementScreen';
// import KacabDetailScreen from '../features/adminPusat/screens/KacabDetailScreen';
// import SettingsScreen from '../features/adminPusat/screens/SettingsScreen';

//Anak Screen
import AnakManagementScreen from '../features/adminPusat/screens/AnakManagementScreen';
import AnakDetailScreen from '../features/adminPusat/screens/AnakDetailScreen';
//import AnakFormScreen from '../features/adminPusat/screens/AnakFormScreen';
// Import Anak Detail Screens
import InformasiAnakScreen from '../features/adminPusat/screens/anakDetail/InformasiAnakScreen';
import RaportScreen from '../features/adminPusat/screens/anakDetail/RaportScreen';
//import RaportDetailScreen from '../features/adminPusat/screens/anakDetail/RaportDetailScreen';
import PrestasiScreen from '../features/adminPusat/screens/anakDetail/PrestasiScreen';
//import PrestasiDetailScreen from '../features/adminPusat/screens/anakDetail/PrestasiDetailScreen';
import RiwayatScreen from '../features/adminPusat/screens/anakDetail/RiwayatScreen';
//import RiwayatDetailScreen from '../features/adminPusat/screens/anakDetail/RiwayatDetailScreen';
//import SuratScreen from '../features/adminPusat/screens/anakDetail/SuratScreen';
//import CeritaScreen from '../features/adminPusat/screens/anakDetail/CeritaScreen';
//import NilaiAnakScreen from '../features/adminPusat/screens/anakDetail/NilaiAnakScreen';
//import RaporShelterScreen from '../features/adminPusat/screens/anakDetail/RaporShelterScreen';
import KeluargaManagement from '../features/adminPusat/screens/KeluargaManagementScreen';
import KeluargaDetail from '../features/adminPusat/screens/KeluargaDetailScreen';
import KeluargaForm from '../features/adminPusat/screens/KeluargaFormScreen';

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
        component={AdminPusatDashboardScreen} 
        options={{ headerTitle: 'Admin Pusat Dashboard' }}
      />
    </HomeStack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
   
      {/* <ManagementStack.Screen 
        name="UserManagement" 
        component={UserManagementScreen} 
        options={{ headerTitle: 'User Management' }}
      /> */}
      {/* <ManagementStack.Screen 
        name="UserDetail" 
        component={UserDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'User Detail' 
        })}
      />
      <ManagementStack.Screen 
        name="KacabManagement" 
        component={KacabManagementScreen} 
        options={{ headerTitle: 'Cabang Management' }}
      />
      <ManagementStack.Screen 
        name="KacabDetail" 
        component={KacabDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Cabang Detail' 
        })}
      /> */}
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
      {/* <ManagementStack.Screen 
        name="AnakForm" 
        component={AnakFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isEdit ? 'Edit Child' : 'Add New Child'
        })}
      /> */}
      
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
      {/* <ManagementStack.Screen 
        name="RaportDetail" 
        component={RaportDetailScreen} 
        options={{ headerTitle: 'Detail Raport' }}
      /> */}
      <ManagementStack.Screen 
        name="Prestasi" 
        component={PrestasiScreen} 
        options={{ headerTitle: 'Prestasi Anak' }}
      />
      {/* <ManagementStack.Screen 
        name="PrestasiDetail" 
        component={PrestasiDetailScreen} 
        options={{ headerTitle: 'Detail Prestasi' }}
      /> */}
      <ManagementStack.Screen 
        name="Riwayat" 
        component={RiwayatScreen} 
        options={{ headerTitle: 'Riwayat Anak' }}
      />
      <Stack.Screen 
  name="KeluargaManagement" 
  component={KeluargaManagementScreen} 
  options={{ headerTitle: 'Family Management' }}
/>
<Stack.Screen 
  name="KeluargaDetail" 
  component={KeluargaDetailScreen} 
  options={({ route }) => ({ 
    headerTitle: route.params?.title || 'Family Detail'
  })}
/>
<Stack.Screen 
  name="KeluargaForm" 
  component={KeluargaFormScreen} 
  options={({ route }) => ({ 
    headerTitle: route.params?.isEdit ? 'Edit Family' : 'Add New Family'
  })}
/>
      {/* <ManagementStack.Screen 
        name="RiwayatDetail" 
        component={RiwayatDetailScreen} 
        options={{ headerTitle: 'Detail Riwayat' }}
      /> */}
      {/* <ManagementStack.Screen 
        name="Surat" 
        component={SuratScreen} 
        options={{ headerTitle: 'Surat Anak' }}
      />
      <ManagementStack.Screen 
        name="Cerita" 
        component={CeritaScreen} 
        options={{ headerTitle: 'Cerita Anak' }}
      /> */}
      {/* <ManagementStack.Screen 
        name="NilaiAnak" 
        component={NilaiAnakScreen} 
        options={{ headerTitle: 'Nilai Anak' }}
      /> */}
      {/* <ManagementStack.Screen 
        name="RaporShelter" 
        component={RaporShelterScreen} 
        options={{ headerTitle: 'Rapor Shelter' }}
      /> */}
    </ManagementStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={AdminPusatProfileScreen} 
        options={{ headerTitle: 'My Profile' }}
      />
      {/* <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ headerTitle: 'Settings' }}
      /> */}
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator for Admin Pusat
const AdminPusatNavigator = () => {
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
        tabBarActiveTintColor: '#3498db',
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

export default AdminPusatNavigator;
