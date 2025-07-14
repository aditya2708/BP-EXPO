import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import AdminCabangDashboardScreen from '../features/adminCabang/screen/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screen/AdminCabangProfileScreen';
import SurveyStatusFilterScreen from '../features/adminCabang/screen/SurveyStatusFilterScreen';
import SurveyApprovalDetailScreen from '../features/adminCabang/screen/SurveyApprovalDetailScreen';
import AdminCabangPengajuanDonaturScreen from '../features/adminCabang/screen/AdminCabangPengajuanDonaturScreen';
import DonaturSelectionScreen from '../features/adminCabang/screen/DonaturSelectionScreen';
import ChildDetailScreen from '../features/adminCabang/screen/ChildDetailScreen';
import AdminCabangDonaturListScreen from '../features/adminCabang/screen/AdminCabangDonaturListScreen';
import AdminCabangDonaturFormScreen from '../features/adminCabang/screen/AdminCabangDonaturFormScreen';
import AdminCabangDonaturDetailScreen from '../features/adminCabang/screen/AdminCabangDonaturDetailScreen';
import DonaturFilterScreen from '../features/adminCabang/screen/DonaturFilterScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const PengajuanDonaturStack = createStackNavigator();
const DonaturStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Dashboard" 
        component={AdminCabangDashboardScreen} 
        options={{ headerTitle: 'Dashboard Admin Cabang' }}
      />
      <HomeStack.Screen 
        name="SurveyDetail" 
        component={SurveyApprovalDetailScreen} 
        options={{ headerTitle: 'Survey Detail' }}
      />
    </HomeStack.Navigator>
  );
};

const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      <ManagementStack.Screen 
        name="SurveyStatusFilter" 
        component={SurveyStatusFilterScreen} 
        options={{ headerTitle: 'Manajemen Survei' }}
      />
      <ManagementStack.Screen 
        name="SurveyApprovalDetail" 
        component={SurveyApprovalDetailScreen} 
        options={{ headerTitle: 'Detail Survei' }}
      />
    </ManagementStack.Navigator>
  );
};

const PengajuanDonaturStackNavigator = () => {
  return (
    <PengajuanDonaturStack.Navigator>
      <PengajuanDonaturStack.Screen 
        name="PengajuanDonaturList" 
        component={AdminCabangPengajuanDonaturScreen} 
        options={{ headerTitle: 'Pengajuan Donatur' }}
      />
      <PengajuanDonaturStack.Screen 
        name="DonaturSelection" 
        component={DonaturSelectionScreen} 
        options={{ headerTitle: 'Pilih Donatur' }}
      />
      <PengajuanDonaturStack.Screen 
        name="ChildDetail" 
        component={ChildDetailScreen} 
        options={{ headerTitle: 'Detail Anak' }}
      />
    </PengajuanDonaturStack.Navigator>
  );
};

const DonaturStackNavigator = () => {
  return (
    <DonaturStack.Navigator>
      <DonaturStack.Screen 
        name="DonaturList" 
        component={AdminCabangDonaturListScreen} 
        options={{ headerTitle: 'Manajemen Donatur' }}
      />
      <DonaturStack.Screen 
        name="DonaturForm" 
        component={AdminCabangDonaturFormScreen} 
        options={({ route }) => ({
          headerTitle: route.params?.donaturId ? 'Edit Donatur' : 'Tambah Donatur'
        })}
      />
      <DonaturStack.Screen 
        name="DonaturDetail" 
        component={AdminCabangDonaturDetailScreen} 
        options={{ headerTitle: 'Detail Donatur' }}
      />
      <DonaturStack.Screen 
        name="DonaturFilter" 
        component={DonaturFilterScreen} 
        options={{ headerTitle: 'Filter Donatur' }}
      />
    </DonaturStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={AdminCabangProfileScreen} 
        options={{ headerTitle: 'Profil Saya' }}
      />
    </ProfileStack.Navigator>
  );
};

const AdminCabangNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'PengajuanDonatur') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'DonaturManagement') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
        },
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
        options={{ tabBarLabel: 'Survei' }}
      />
      <Tab.Screen 
        name="PengajuanDonatur" 
        component={PengajuanDonaturStackNavigator} 
        options={{ tabBarLabel: 'Pengajuan' }}
      />
      <Tab.Screen 
        name="DonaturManagement" 
        component={DonaturStackNavigator} 
        options={{ tabBarLabel: 'Donatur' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default AdminCabangNavigator;