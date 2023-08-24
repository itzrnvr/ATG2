import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from './SplashScreen';
import DashboardScreen from './DashboardScreen';


const Tab = createBottomTabNavigator();


const HomeScreen = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel:false,
            headerShown:false
        }}>
             <Tab.Screen name="HomeDashboard" component={DashboardScreen} />
        <Tab.Screen name="Profile" component={SplashScreen} />

        </Tab.Navigator>
    )
}

export default HomeScreen