import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import AdminShelterDashboardScreen from '../features/adminShelter/screens/AdminShelterDashboardScreen';
import AdminShelterProfileScreen from '../features/adminShelter/screens/AdminShelterProfileScreen';
// import ChildrenManagementScreen from '../features/adminShelter/screens/ChildrenManagementScreen';
// import ChildDetailScreen from '../features/adminShelter/screens/ChildDetailScreen';
// import DonaturManagementScreen from '../features/adminShelter/screens/DonaturManagementScreen';
// import DonaturDetailScreen from '../features/adminShelter/screens/DonaturDetailScreen';
// import AttendanceScreen from '../features/adminShelter/screens/AttendanceScreen';
// import AttendanceDetailScreen from '../features/adminShelter/screens/AttendanceDetailScreen';
// import SettingsScreen from '../features/adminShelter/screens/SettingsScreen';

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
        component={AdminShelterDashboardScreen} 
        options={{ headerTitle: 'Admin Shelter Dashboard' }}
      />
      {/* <HomeStack.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{ headerTitle: 'Attendance Records' }}
      />
      <HomeStack.Screen 
        name="AttendanceDetail" 
        component={AttendanceDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Attendance Detail' 
        })}
      /> */}
    </HomeStack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      {/* <ManagementStack.Screen 
        name="ChildrenManagement" 
        component={ChildrenManagementScreen} 
        options={{ headerTitle: 'Children Management' }}
      />
      <ManagementStack.Screen 
        name="ChildDetail" 
        component={ChildDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Child Detail' 
        })}
      />
      <ManagementStack.Screen 
        name="DonaturManagement" 
        component={DonaturManagementScreen} 
        options={{ headerTitle: 'Donatur Management' }}
      />
      <ManagementStack.Screen 
        name="DonaturDetail" 
        component={DonaturDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Donatur Detail' 
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
        component={AdminShelterProfileScreen} 
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

// Main Tab Navigator for Admin Shelter
const AdminShelterNavigator = () => {
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
        tabBarActiveTintColor: '#e74c3c',
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

export default AdminShelterNavigator;