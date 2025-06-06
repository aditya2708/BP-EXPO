import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import AdminCabangDashboardScreen from '../features/adminCabang/screen/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screen/AdminCabangProfileScreen';
import SurveyApprovalListScreen from '../features/adminCabang/screen/SurveyApprovalListScreen';
import SurveyApprovalDetailScreen from '../features/adminCabang/screen/SurveyApprovalDetailScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Dashboard" 
        component={AdminCabangDashboardScreen} 
        options={{ headerTitle: 'Admin Cabang Dashboard' }}
      />
    </HomeStack.Navigator>
  );
};

const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      <ManagementStack.Screen 
        name="SurveyApprovalList" 
        component={SurveyApprovalListScreen} 
        options={{ headerTitle: 'Survey Approval' }}
      />
      <ManagementStack.Screen 
        name="SurveyApprovalDetail" 
        component={SurveyApprovalDetailScreen} 
        options={{ headerTitle: 'Survey Detail' }}
      />
    </ManagementStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={AdminCabangProfileScreen} 
        options={{ headerTitle: 'My Profile' }}
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
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
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
        options={{ tabBarLabel: 'Survey Approval' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AdminCabangNavigator;