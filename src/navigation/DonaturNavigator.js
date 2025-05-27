import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import DonaturDashboardScreen from '../features/donatur/screen/DonaturDashboardScreen';
import DonaturProfileScreen from '../features/donatur/screen/DonaturProfileScreen';
import ChildListScreen from '../features/donatur/screen/ChildListScreen';

// Import new child-related screens
import ChildProfileScreen from '../features/donatur/screen/ChildProfileScreen';
import SuratListScreen from '../features/donatur/screen/SuratListScreen';
import SuratDetailScreen from '../features/donatur/screen/SuratDetailScreen';
import SuratFormScreen from '../features/donatur/screen/SuratFormScreen';
import ChildPrestasiListScreen from '../features/donatur/screen/ChildPrestasiListScreen';
import ChildPrestasiDetailScreen from '../features/donatur/screen/ChildPrestasiDetailScreen';
import ChildRaportListScreen from '../features/donatur/screen/ChildRaportListScreen';
import ChildRaportDetailScreen from '../features/donatur/screen/ChildRaportDetailScreen';
import ChildAktivitasListScreen from '../features/donatur/screen/ChildAktivitasListScreen';
import ChildAktivitasDetailScreen from '../features/donatur/screen/ChildAktivitasDetailScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ChildrenStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Dashboard" 
        component={DonaturDashboardScreen} 
        options={{ headerTitle: 'Donatur Dashboard' }}
      />
    </HomeStack.Navigator>
  );
};

// Children Stack Navigator
const ChildrenStackNavigator = () => {
  return (
    <ChildrenStack.Navigator>
       <ChildrenStack.Screen 
        name="ChildList" 
        component={ChildListScreen} 
        options={{ headerTitle: 'My Sponsored Children' }}
      />
      <ChildrenStack.Screen 
        name="ChildProfile" 
        component={ChildProfileScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.childName || 'Child Profile' 
        })}
      />
      <ChildrenStack.Screen 
        name="SuratList" 
        component={SuratListScreen} 
        options={{ headerTitle: 'Messages' }}
      />
      <ChildrenStack.Screen 
        name="SuratDetail" 
        component={SuratDetailScreen} 
        options={{ headerTitle: 'Message Detail' }}
      />
      <ChildrenStack.Screen 
        name="SuratForm" 
        component={SuratFormScreen} 
        options={{ headerTitle: 'Compose Message' }}
      />
      <ChildrenStack.Screen 
        name="ChildPrestasiList" 
        component={ChildPrestasiListScreen} 
        options={{ headerTitle: 'Achievements' }}
      />
      <ChildrenStack.Screen 
        name="ChildPrestasiDetail" 
        component={ChildPrestasiDetailScreen} 
        options={{ headerTitle: 'Achievement Detail' }}
      />
      <ChildrenStack.Screen 
        name="ChildRaportList" 
        component={ChildRaportListScreen} 
        options={{ headerTitle: 'Report Cards' }}
      />
      <ChildrenStack.Screen 
        name="ChildRaportDetail" 
        component={ChildRaportDetailScreen} 
        options={{ headerTitle: 'Report Card Detail' }}
      />
      <ChildrenStack.Screen 
        name="ChildAktivitasList" 
        component={ChildAktivitasListScreen} 
        options={{ headerTitle: 'Activities' }}
      />
      <ChildrenStack.Screen 
        name="ChildAktivitasDetail" 
        component={ChildAktivitasDetailScreen} 
        options={{ headerTitle: 'Activity Detail' }}
      />
    </ChildrenStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={DonaturProfileScreen} 
        options={{ headerTitle: 'My Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator for Donatur
const DonaturNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Children') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9b59b6',
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
        name="Children" 
        component={ChildrenStackNavigator} 
        options={{ tabBarLabel: 'My Children' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default DonaturNavigator;
