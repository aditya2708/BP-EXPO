import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MasterDataMainScreen from '../screens/masterData/MasterDataMainScreen';
import JenjangListScreen from '../screens/masterData/jenjang/JenjangListScreen';
import JenjangFormScreen from '../screens/masterData/jenjang/JenjangFormScreen';
import JenjangDetailScreen from '../screens/masterData/jenjang/JenjangDetailScreen';
import JenjangStatsScreen from '../screens/masterData/jenjang/JenjangStatsScreen';

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
      
      {/* TODO: Add other master data screens in future phases */}
      {/* 
      <Stack.Screen
        name="MataPelajaranList"
        component={MataPelajaranListScreen}
        options={{ headerTitle: 'Mata Pelajaran' }}
      />
      
      <Stack.Screen
        name="KelasList"
        component={KelasListScreen}
        options={{ headerTitle: 'Data Kelas' }}
      />
      
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