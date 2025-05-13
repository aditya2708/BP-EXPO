import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import AdminPusatDashboardScreen from '../features/adminPusat/screens/AdminPusatDashboardScreen';
import AdminPusatProfileScreen from '../features/adminPusat/screens/AdminPusatProfileScreen';
// import UserManagementScreen from '../features/adminPusat/screens/UserManagementScreen';
// import UserDetailScreen from '../features/adminPusat/screens/UserDetailScreen';
// import KacabManagementScreen from '../features/adminPusat/screens/KacabManagementScreen';
// import KacabDetailScreen from '../features/adminPusat/screens/KacabDetailScreen';
// import SettingsScreen from '../features/adminPusat/screens/SettingsScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ManagementStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Dashboard" 
        component={AdminPusatDashboardScreen} 
        options={{ headerTitle: 'Admin Pusat Dashboard' }}
      />
    </HomeStack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
   
      {/* <ManagementStack.Screen 
        name="UserManagement" 
        component={UserManagementScreen} 
        options={{ headerTitle: 'User Management' }}
      /> */}
      {/* <ManagementStack.Screen 
        name="UserDetail" 
        component={UserDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'User Detail' 
        })}
      />
      <ManagementStack.Screen 
        name="KacabManagement" 
        component={KacabManagementScreen} 
        options={{ headerTitle: 'Cabang Management' }}
      />
      <ManagementStack.Screen 
        name="KacabDetail" 
        component={KacabDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Cabang Detail' 
        })}
      /> */}
    </ManagementStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={AdminPusatProfileScreen} 
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

// Main Tab Navigator for Admin Pusat
const AdminPusatNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
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
        options={{ tabBarLabel: 'Management' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AdminPusatNavigator;