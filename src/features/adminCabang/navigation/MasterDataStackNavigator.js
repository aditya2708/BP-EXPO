import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Main screen
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

// Kelas screens
import KelasListScreen from '../screens/masterData/kelas/KelasListScreen';
import KelasFormScreen from '../screens/masterData/kelas/KelasFormScreen';
import KelasDetailScreen from '../screens/masterData/kelas/KelasDetailScreen';
import KelasStatsScreen from '../screens/masterData/kelas/KelasStatsScreen';

// Materi screens
import MateriListScreen from '../screens/masterData/materi/MateriListScreen';
import MateriFormScreen from '../screens/masterData/materi/MateriFormScreen';
import MateriDetailScreen from '../screens/masterData/materi/MateriDetailScreen';
import MateriStatsScreen from '../screens/masterData/materi/MateriStatsScreen';

const Stack = createStackNavigator();

const MasterDataStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007bff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MasterDataMain" 
        component={MasterDataMainScreen}
        options={{ headerTitle: 'Master Data' }}
      />
      
      {/* Jenjang Stack */}
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
      
      {/* Mata Pelajaran Stack */}
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
      
      {/* Kelas Stack */}
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
      
      {/* Materi Stack */}
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
    </Stack.Navigator>
  );
};

export default MasterDataStackNavigator;