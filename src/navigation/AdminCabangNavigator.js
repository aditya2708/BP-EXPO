import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import AdminCabangDashboardScreen from '../features/adminCabang/screen/AdminCabangDashboardScreen';
import AdminCabangProfileScreen from '../features/adminCabang/screen/AdminCabangProfileScreen';
// import WilbinManagementScreen from '../features/adminCabang/screens/WilbinManagementScreen';
// import WilbinDetailScreen from '../features/adminCabang/screens/WilbinDetailScreen';
// import ShelterManagementScreen from '../features/adminCabang/screens/ShelterManagementScreen';
// import ShelterDetailScreen from '../features/adminCabang/screens/ShelterDetailScreen';
// import AdminShelterManagementScreen from '../features/adminCabang/screens/AdminShelterManagementScreen';
// import AdminShelterDetailScreen from '../features/adminCabang/screens/AdminShelterDetailScreen';
// import SettingsScreen from '../features/adminCabang/screens/SettingsScreen';

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
        component={AdminCabangDashboardScreen} 
        options={{ headerTitle: 'Admin Cabang Dashboard' }}
      />
    </HomeStack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      {/* <ManagementStack.Screen 
        name="WilbinManagement" 
        component={WilbinManagementScreen} 
        options={{ headerTitle: 'Wilayah Binaan' }}
      />
      <ManagementStack.Screen 
        name="WilbinDetail" 
        component={WilbinDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Wilbin Detail' 
        })}
      />
      <ManagementStack.Screen 
        name="ShelterManagement" 
        component={ShelterManagementScreen} 
        options={{ headerTitle: 'Shelter Management' }}
      />
      <ManagementStack.Screen 
        name="ShelterDetail" 
        component={ShelterDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Shelter Detail' 
        })}
      />
      <ManagementStack.Screen 
        name="AdminShelterManagement" 
        component={AdminShelterManagementScreen} 
        options={{ headerTitle: 'Admin Shelter' }}
      />
      <ManagementStack.Screen 
        name="AdminShelterDetail" 
        component={AdminShelterDetailScreen} 
        options={({ route }) => ({ 
          headerTitle: route.params?.title || 'Admin Shelter Detail' 
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
        component={AdminCabangProfileScreen} 
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

// Main Tab Navigator for Admin Cabang
const AdminCabangNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'business' : 'business-outline';
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

export default AdminCabangNavigator;