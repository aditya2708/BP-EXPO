import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MasterDataMainScreen from '../screens/masterData/MasterDataMainScreen';

// Jenjang Screens
import JenjangListScreen from '../screens/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../screens/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../screens/masterData/jenjang/JenjangDetailScreen';
import JenjangStatsScreen from '../screens/masterData/jenjang/JenjangStatsScreen';

// Mata Pelajaran Screens  
import MataPelajaranListScreen from '../screens/masterData/mataPelajaran/MataPelajaranListScreen';
import MataPelajaranFormScreen from '../screens/masterData/mataPelajaran/MataPelajaranFormScreen';
import MataPelajaranDetailScreen from '../screens/masterData/mataPelajaran/MataPelajaranDetailScreen';
import MataPelajaranStatsScreen from '../screens/masterData/mataPelajaran/MataPelajaranStatsScreen';

// Kelas Screens
import KelasListScreen from '../screens/masterData/kelas/KelasListScreen';
import KelasFormScreen from '../screens/masterData/kelas/KelasFormScreen';
import KelasDetailScreen from '../screens/masterData/kelas/KelasDetailScreen';
import KelasStatsScreen from '../screens/masterData/kelas/KelasStatsScreen';

const Stack = createStackNavigator();

const MasterDataStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Main Entry Point */}
      <Stack.Screen
        name="MasterDataMain" 
        component={MasterDataMainScreen}
        options={{ headerTitle: 'Master Data' }}
      />
      
      {/* Jenjang Stack - Phase 1 Complete */}
      <Stack.Screen
        name="JenjangList"
        component={JenjangListScreen}
        options={{ headerTitle: 'Data Jenjang' }}
      />
      
      <Stack.Screen
        name="JenjangForm"
        component={JenjangFormScreen}
        options={{ headerTitle: 'Form Jenjang' }}
      />
      
      <Stack.Screen
        name="JenjangDetail"
        component={JenjangDetailScreen}
        options={{ headerTitle: 'Detail Jenjang' }}
      />
      
      <Stack.Screen
        name="JenjangStats"
        component={JenjangStatsScreen}
        options={{ headerTitle: 'Statistik Jenjang' }}
      />

      {/* Mata Pelajaran Stack - Phase 2 Complete */}
      <Stack.Screen
        name="MataPelajaranList"
        component={MataPelajaranListScreen}
        options={{ headerTitle: 'Mata Pelajaran' }}
      />
      
      <Stack.Screen
        name="MataPelajaranForm"
        component={MataPelajaranFormScreen}
        options={{ headerTitle: 'Form Mata Pelajaran' }}
      />
      
      <Stack.Screen
        name="MataPelajaranDetail"
        component={MataPelajaranDetailScreen}
        options={{ headerTitle: 'Detail Mata Pelajaran' }}
      />
      
      <Stack.Screen
        name="MataPelajaranStats"
        component={MataPelajaranStatsScreen}
        options={{ headerTitle: 'Statistik Mata Pelajaran' }}
      />

      {/* Kelas Stack - Phase 3 Complete */}
      <Stack.Screen
        name="KelasList"
        component={KelasListScreen}
        options={{ headerTitle: 'Data Kelas' }}
      />
      
      <Stack.Screen
        name="KelasForm"
        component={KelasFormScreen}
        options={{ headerTitle: 'Form Kelas' }}
      />
      
      <Stack.Screen
        name="KelasDetail"
        component={KelasDetailScreen}
        options={{ headerTitle: 'Detail Kelas' }}
      />
      
      <Stack.Screen
        name="KelasStats"
        component={KelasStatsScreen}
        options={{ headerTitle: 'Statistik Kelas' }}
      />
      
      {/* TODO: Future Phases */}
      {/* 
      // Materi Stack - Phase 4
      <Stack.Screen
        name="MateriList"
        component={MateriListScreen}
        options={{ headerTitle: 'Data Materi' }}
      />
      */}
    </Stack.Navigator>
  );
};

export default MasterDataStackNavigator;