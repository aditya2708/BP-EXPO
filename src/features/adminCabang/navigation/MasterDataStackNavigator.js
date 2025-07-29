import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MasterDataMainScreen from '../screens/masterData/MasterDataMainScreen';

// Jenjang screens
import JenjangListScreen from '../screens/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../screens/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../screens/masterData/jenjang/JenjangDetailScreen';
import JenjangStatsScreen from '../screens/masterData/jenjang/JenjangStatsScreen';

// Kelas screens
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

      {/* Kelas Routes */}
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
      
      {/* TODO: Future mata pelajaran and materi routes */}
    </Stack.Navigator>
  );
};

export default MasterDataStackNavigator;