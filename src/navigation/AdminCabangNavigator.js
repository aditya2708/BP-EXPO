import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Dashboard screens
import AdminCabangDashboardScreen from '../features/adminCabang/screens/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screens/AdminCabangProfileScreen';
import SurveyStatusFilterScreen from '../features/adminCabang/screens/SurveyStatusFilterScreen';
import SurveyApprovalDetailScreen from '../features/adminCabang/screens/SurveyApprovalDetailScreen';
import AdminCabangPengajuanDonaturScreen from '../features/adminCabang/screens/AdminCabangPengajuanDonaturScreen';
import DonaturSelectionScreen from '../features/adminCabang/screens/DonaturSelectionScreen';
import ChildDetailScreen from '../features/adminCabang/screens/ChildDetailScreen';
import AdminCabangDonaturListScreen from '../features/adminCabang/screens/AdminCabangDonaturListScreen';
import AdminCabangDonaturFormScreen from '../features/adminCabang/screens/AdminCabangDonaturFormScreen';
import AdminCabangDonaturDetailScreen from '../features/adminCabang/screens/AdminCabangDonaturDetailScreen';
import DonaturFilterScreen from '../features/adminCabang/screens/DonaturFilterScreen';

// Menu screens
import MasterDataMenuScreen from '../features/adminCabang/screens/MasterDataMenuScreen';
import AkademikMenuScreen from '../features/adminCabang/screens/AkademikMenuScreen';

// Universal Entity Screen (replaces 16+ individual screens)
import EntityScreen from '../features/adminCabang/screens/EntityScreen';

// Special screens (keep for now - complex logic)
import AssignMateriScreen from '../features/adminCabang/screens/akademik/kurikulum/AssignMateriScreen';

// Helper for dynamic headers
import { getEntityTitle } from '../features/adminCabang/logic/entityHelpers';

const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();
const MasterDataStack = createStackNavigator();
const AkademikStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Dashboard Stack Navigator (unchanged)
const DashboardStackNavigator = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen
      name="DashboardHome"
      component={AdminCabangDashboardScreen}
      options={{ headerTitle: 'Dashboard' }}
    />
    <DashboardStack.Screen
      name="SurveyStatusFilter"
      component={SurveyStatusFilterScreen}
      options={{ headerTitle: 'Status Survey' }}
    />
    <DashboardStack.Screen
      name="SurveyApprovalDetail"
      component={SurveyApprovalDetailScreen}
      options={{ headerTitle: 'Detail Persetujuan Survey' }}
    />
    <DashboardStack.Screen
      name="PengajuanDonatur"
      component={AdminCabangPengajuanDonaturScreen}
      options={{ headerTitle: 'Pengajuan Donatur' }}
    />
    <DashboardStack.Screen
      name="DonaturSelection"
      component={DonaturSelectionScreen}
      options={{ headerTitle: 'Pilih Donatur' }}
    />
    <DashboardStack.Screen
      name="ChildDetail"
      component={ChildDetailScreen}
      options={{ headerTitle: 'Detail Anak' }}
    />
    <DashboardStack.Screen
      name="DonaturList"
      component={AdminCabangDonaturListScreen}
      options={{ headerTitle: 'Daftar Donatur' }}
    />
    <DashboardStack.Screen
      name="DonaturForm"
      component={AdminCabangDonaturFormScreen}
      options={{ headerTitle: 'Form Donatur' }}
    />
    <DashboardStack.Screen
      name="DonaturDetail"
      component={AdminCabangDonaturDetailScreen}
      options={{ headerTitle: 'Detail Donatur' }}
    />
    <DashboardStack.Screen
      name="DonaturFilter"
      component={DonaturFilterScreen}
      options={{ headerTitle: 'Filter Donatur' }}
    />
  </DashboardStack.Navigator>
);

// Master Data Stack Navigator (REFACTORED - 12 screens → 1 screen)
const MasterDataStackNavigator = () => (
  <MasterDataStack.Navigator>
    <MasterDataStack.Screen
      name="MasterDataMenu"
      component={MasterDataMenuScreen}
      options={{ headerTitle: 'Master Data' }}
    />
    {/* Universal Entity Screen - handles all Master Data CRUD operations */}
    <MasterDataStack.Screen
      name="Entity"
      component={EntityScreen}
      options={({ route }) => {
        const { entityType, mode, itemId, item } = route.params || {};
        
        // Dynamic header title based on entity and mode
        try {
          return {
            headerTitle: getEntityTitle(entityType, mode, item)
          };
        } catch (error) {
          console.warn('Error getting entity title:', error);
          return { headerTitle: 'Entity' };
        }
      }}
    />
  </MasterDataStack.Navigator>
);

// Akademik Stack Navigator (REFACTORED - 4 screens → 1 screen + special)
const AkademikStackNavigator = () => (
  <AkademikStack.Navigator>
    <AkademikStack.Screen
      name="AkademikMenu"
      component={AkademikMenuScreen}
      options={{ headerTitle: 'Akademik' }}
    />
    {/* Universal Entity Screen - handles Kurikulum CRUD operations */}
    <AkademikStack.Screen
      name="Entity"
      component={EntityScreen}
      options={({ route }) => {
        const { entityType, mode, itemId, item } = route.params || {};
        
        // Dynamic header title based on entity and mode
        try {
          return {
            headerTitle: getEntityTitle(entityType, mode, item)
          };
        } catch (error) {
          console.warn('Error getting entity title:', error);
          return { headerTitle: 'Entity' };
        }
      }}
    />
    {/* Keep special screens with complex logic */}
    <AkademikStack.Screen
      name="AssignMateri"
      component={AssignMateriScreen}
      options={{ headerTitle: 'Assign Materi' }}
    />
  </AkademikStack.Navigator>
);

// Profile Stack Navigator (unchanged)
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileHome"
      component={AdminCabangProfileScreen}
      options={{ headerTitle: 'Profil' }}
    />
  </ProfileStack.Navigator>
);

const AdminCabangNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'grid' : 'grid-outline';
        else if (route.name === 'MasterData') iconName = focused ? 'library' : 'library-outline';
        else if (route.name === 'Akademik') iconName = focused ? 'school' : 'school-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person-circle' : 'person-circle-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="Home"
      component={DashboardStackNavigator}
      options={{ tabBarLabel: 'Dashboard' }}
    />
    <Tab.Screen
      name="MasterData"
      component={MasterDataStackNavigator}
      options={{ tabBarLabel: 'Master Data' }}
    />
    <Tab.Screen
      name="Akademik"
      component={AkademikStackNavigator}
      options={{ tabBarLabel: 'Akademik' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{ tabBarLabel: 'Profil' }}
    />
  </Tab.Navigator>
);

export default AdminCabangNavigator;