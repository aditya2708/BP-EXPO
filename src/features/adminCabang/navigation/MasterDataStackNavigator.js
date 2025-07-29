import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MasterDataMainScreen from '../screens/masterData/MasterDataMainScreen';

// Jenjang screens
import JenjangListScreen from '../screens/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../screens/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../screens/masterData/jenjang/JenjangDetailScreen';
import JenjangStatsScreen from '../screens/masterData/jenjang/JenjangStatsScreen';

// Mata Pelajaran screens
import MataPelajaranListScreen from '../screens/masterData/mataPelajaran/MataPelajaranListScreen';
import MataPelajaranFormScreen from '../screens/masterData/mataPelajaran/MataPelajaranFormScreen';
import MataPelajaranDetailScreen from '../screens/masterData/mataPelajaran/MataPelajaranDetailScreen';
import MataPelajaranStatsScreen from '../screens/masterData/mataPelajaran/MataPelajaranStatsScreen';

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
      <Stack.Screen
        name="MasterDataMain" 
        component={MasterDataMainScreen}
        options={{ headerTitle: 'Master Data' }}
      />
      
      {/* Jenjang Routes */}
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
      
      {/* Mata Pelajaran Routes */}
      <Stack.Screen
        name="MataPelajaranList"
        component={MataPelajaranListScreen}
        options={{ headerTitle: 'Data Mata Pelajaran' }}
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
      
      {/* TODO: Phase 3 - Kelas Routes
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
      */}
      
      {/* TODO: Phase 4 - Materi Routes
      <Stack.Screen
        name="MateriList"
        component={MateriListScreen}
        options={{ headerTitle: 'Data Materi' }}
      />
      
      <Stack.Screen
        name="MateriForm"
        component={MateriFormScreen}
        options={{ headerTitle: 'Form Materi' }}
      />
      
      <Stack.Screen
        name="MateriDetail"
        component={MateriDetailScreen}
        options={{ headerTitle: 'Detail Materi' }}
      />
      
      <Stack.Screen
        name="MateriStats"
        component={MateriStatsScreen}
        options={{ headerTitle: 'Statistik Materi' }}
      />
      */}
    </Stack.Navigator>
  );
};

export default MasterDataStackNavigator;