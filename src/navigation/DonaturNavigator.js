import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import DonaturDashboardScreen from '../features/donatur/screen/DonaturDashboardScreen';
import DonaturProfileScreen from '../features/donatur/screen/DonaturProfileScreen';
import MySponsoredChildrenScreen from '../features/donatur/screen/MySponsoredChildrenScreen';
// import ChildDetailScreen from '../features/donatur/screens/ChildDetailScreen';
// import DonationHistoryScreen from '../features/donatur/screens/DonationHistoryScreen';
// import DonationDetailScreen from '../features/donatur/screens/DonationDetailScreen';
// import SettingsScreen from '../features/donatur/screens/SettingsScreen';
// import NotificationsScreen from '../features/donatur/screens/NotificationsScreen';

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
      {/* <HomeStack.Screen 
        name="DonationHistory" 
        component={DonationHistoryScreen} 
        options={{ headerTitle: 'Donation History' }}
      />
      <HomeStack.Screen 
        name="DonationDetail" 
        component={DonationDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Donation Detail' 
        })}
      />
      <HomeStack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ headerTitle: 'Notifications' }}
      /> */}
    </HomeStack.Navigator>
  );
};

// Children Stack Navigator
const ChildrenStackNavigator = () => {
  return (
    <ChildrenStack.Navigator>
      <ChildrenStack.Screen 
        name="MySponsoredChildren" 
        component={MySponsoredChildrenScreen} 
        options={{ headerTitle: 'My Sponsored Children' }}
      />
      {/* <ChildrenStack.Screen 
        name="ChildDetail" 
        component={ChildDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Child Detail' 
        })}
      /> */}
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
      {/* <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ headerTitle: 'Settings' }}
      /> */}
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