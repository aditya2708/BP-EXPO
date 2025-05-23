import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import TestExpoCameraScreen from '../features/adminShelter/screens/TestExpoCameraScreen';
// Import existing screens
import AdminShelterDashboardScreen from '../features/adminShelter/screens/AdminShelterDashboardScreen';
import AdminShelterProfileScreen from '../features/adminShelter/screens/AdminShelterProfileScreen';
import AnakManagementScreen from '../features/adminShelter/screens/AnakManagementScreen';
import AnakDetailScreen from '../features/adminShelter/screens/AnakDetailScreen';


// Import attendance-related screens (Phase 1)
import QrScannerScreen from '../features/adminShelter/screens/attendance/QrScannerScreen';
import AttendanceListScreen from '../features/adminShelter/screens/attendance/AttendanceListScreen';
import AttendanceDetailScreen from '../features/adminShelter/screens/attendance/AttendanceDetailScreen';
import ManualAttendanceScreen from '../features/adminShelter/screens/attendance/ManualAttendanceScreen';
import AttendanceReportScreen from '../features/adminShelter/screens/attendance/AttendanceReportScreen';

// Import activities-related screens
import ActivitiesListScreen from '../features/adminShelter/screens/attendance/ActivitiesListScreen';
import ActivityFormScreen from '../features/adminShelter/screens/attendance/ActivityFormScreen';
import ActivityDetailScreen from '../features/adminShelter/screens/attendance/ActivityDetailScreen';

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

import KeluargaManagementScreen from '../features/adminShelter/screens/KeluargaManagementScreen';
import KeluargaDetailScreen from '../features/adminShelter/screens/KeluargaDetailScreen';
import KeluargaFormScreen from '../features/adminShelter/screens/KeluargaFormScreen';
import PengajuanAnakSearchScreen from '../features/adminShelter/screens/PengajuanAnakSearchScreen';
import PengajuanAnakFormScreen from '../features/adminShelter/screens/PengajuanAnakFormScreen';

import SurveyManagementScreen from '../features/adminShelter/screens/SurveyManagementScreen';
import SurveyDetailScreen from '../features/adminShelter/screens/SurveyDetailScreen';
import SurveyFormScreen from '../features/adminShelter/screens/SurveyFormScreen';

import SurveyValidationDetailScreen from '../features/adminShelter/screens/SurveyValidationDetailScreen';
import SurveyValidationManagementScreen from '../features/adminShelter/screens/SurveyValidationManagementScreen';
import QrTokenGenerationScreen from '../features/adminShelter/screens/attendance/QrTokenGenerationScreen';
// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const DevStack = createStackNavigator();
const AttendanceStack = createStackNavigator(); // New stack for attendance

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
        name="TestExpoCameraScreen" 
        component={TestExpoCameraScreen} 
        options={{ headerTitle: 'Camera Test' }}
      />
      {/* Add attendance-related screens */}
      <HomeStack.Screen
        name="AttendanceStack"
        component={AttendanceStackNavigator}
        options={{ headerShown: false }}
      />

    </HomeStack.Navigator>
  );
};

// Attendance Stack Navigator
const AttendanceStackNavigator = () => {
  return (
    <AttendanceStack.Navigator>
      <AttendanceStack.Screen
        name="ActivitiesList"
        component={ActivitiesListScreen}
        options={{ headerTitle: 'Activities' }}
      />
      <AttendanceStack.Screen
        name="ActivityForm"
        component={ActivityFormScreen}
        options={({ route }) => ({ 
          headerTitle: route.params?.activity ? 'Edit Activity' : 'Create Activity'
        })}
      />
      <AttendanceStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={({ route }) => ({ 
          headerTitle: route.params?.activityName || 'Activity Details'
        })}
      />
      <AttendanceStack.Screen
        name="AttendanceList"
        component={AttendanceListScreen}
        options={{ headerTitle: 'Attendance Records' }}
      />
      <AttendanceStack.Screen
        name="AttendanceDetail"
        component={AttendanceDetailScreen}
        options={{ headerTitle: 'Attendance Details' }}
      />
      <AttendanceStack.Screen
        name="QrScanner"
        component={QrScannerScreen}
        options={{ 
          headerTitle: 'Scan QR Code',
          headerShown: false
        }}
      />
      <AttendanceStack.Screen
        name="ManualAttendance"
        component={ManualAttendanceScreen}
        options={{ headerTitle: 'Manual Attendance Entry' }}
      />
      <AttendanceStack.Screen
        name="AttendanceReport"
        component={AttendanceReportScreen}
        options={{ headerTitle: 'Attendance Report' }}
      />
      <AttendanceStack.Screen
  name="QrTokenGeneration"
  component={QrTokenGenerationScreen}
  options={{ headerTitle: 'Generate QR Codes' }}
/>
    </AttendanceStack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      <ManagementStack.Screen 
        name="KeluargaManagement" 
        component={KeluargaManagementScreen} 
        options={{ headerTitle: 'Keluarga' }}
      />
      <ManagementStack.Screen 
        name="KeluargaDetail" 
        component={KeluargaDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Family Detail'
        })}
      />
      <ManagementStack.Screen 
        name="KeluargaForm" 
        component={KeluargaFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isEdit ? 'Edit Family' : 'Add New Family'
        })}
      />
      <ManagementStack.Screen 
        name="PengajuanAnakSearch" 
        component={PengajuanAnakSearchScreen} 
        options={{ headerTitle: 'Add Child to Family' }}
      />
      <ManagementStack.Screen 
        name="PengajuanAnakForm" 
        component={PengajuanAnakFormScreen} 
        options={{ headerTitle: 'Add Child Form' }}
      />

      <ManagementStack.Screen 
        name="AnakManagement" 
        component={AnakManagementScreen} 
        options={{ headerTitle: 'Anak' }}
      />
      <ManagementStack.Screen 
        name="AnakDetail" 
        component={AnakDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.isNew ? 'Tambah Anak' : (route.params?.title || 'Detail Anak')
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
        options={{ headerTitle: 'Tutor' }}
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
        options={{ headerTitle: 'Kelompok Anak Binaan' }}
      />
      <ManagementStack.Screen 
        name="KelompokForm" 
        component={KelompokFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.kelompok ? 'Edit Kelompok' : 'Buat Kelompok'
        })}
      />
      <ManagementStack.Screen 
        name="KelompokDetail" 
        component={KelompokDetailScreen} 
        options={{ headerTitle: 'Group Details' }}
      />

      {/* Survey Screens */}
      <ManagementStack.Screen 
        name="SurveyManagement" 
        component={SurveyManagementScreen} 
        options={{ headerTitle: 'Survei' }}
      />
      <ManagementStack.Screen 
        name="SurveyDetail" 
        component={SurveyDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Survey Detail'
        })}
      />
      <ManagementStack.Screen 
        name="SurveyForm" 
        component={SurveyFormScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.surveyData ? 'Edit Survei' : 'Buat Survei'
        })}
      />
      <ManagementStack.Screen 
        name="SurveyValidationDetail" 
        component={SurveyValidationDetailScreen} 
        options={{ headerTitle: 'Validate Survey' }}
      />
      <ManagementStack.Screen 
        name="SurveyValidationManagement" 
        component={SurveyValidationManagementScreen} 
        options={{ headerTitle: 'Survey Validation' }}
      />
      
      {/* Attendance/Activities Screens in Management Stack */}
      <ManagementStack.Screen
        name="ActivitiesList"
        component={ActivitiesListScreen}
        options={{ headerTitle: 'Activitas' }}
      />
      <ManagementStack.Screen
        name="ActivityForm"
        component={ActivityFormScreen}
        options={({ route }) => ({ 
          headerTitle: route.params?.activity ? 'Edit Aktivitas' : 'Buat Aktivitas'
        })}
      />
      <ManagementStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={({ route }) => ({ 
          headerTitle: route.params?.activityName || 'Activity Details'
        })}
      />
      <ManagementStack.Screen
        name="AttendanceList"
        component={AttendanceListScreen}
        options={{ headerTitle: 'Riwayat Aktivitas' }}
      />
      <ManagementStack.Screen
        name="AttendanceDetail"
        component={AttendanceDetailScreen}
        options={{ headerTitle: 'Detail Aktivitas' }}
      />
      <ManagementStack.Screen
        name="QrScanner"
        component={QrScannerScreen}
        options={{ 
          headerTitle: 'Scan QR Code',
          headerShown: false 
        }}
      />
      <ManagementStack.Screen
        name="ManualAttendance"
        component={ManualAttendanceScreen}
        options={{ headerTitle: 'Absen Manual' }}
      />
      <ManagementStack.Screen
        name="AttendanceReport"
        component={AttendanceReportScreen}
        options={{ headerTitle: 'Laporan Aktivitas' }}
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
        options={{ headerTitle: 'Profil' }}
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
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'calendar' : 'calendar-outline';
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
        options={{ tabBarLabel: 'Manajemen' }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceStackNavigator} 
        options={{ tabBarLabel: 'Aktivitas' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profil' }}
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