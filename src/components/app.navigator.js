import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import HomeScreen from '../screens/HomeScreen';
import {StatusBar} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import BuySerialKeyScreen from '../screens/BuySerialKeyScreen';
import SerialKeyScreen from '../screens/SerialKeyScreen';
import FullVideosScreen from '../screens/FullVideosScreen';
import VideoPlayerView from '../screens/VideoPlayerView';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
const AppNavigator = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={'rgba(0,0,0,0)'}
          barStyle="dark-content"
          translucent={true}
        />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="VideoPlayerView">
          <Stack.Screen name="SplasScreen" component={SplashScreen} />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HomeDashboard" component={DashboardScreen} />
          <Stack.Screen name="BuySerialKey" component={BuySerialKeyScreen} />
          <Stack.Screen name="SerialKey" component={SerialKeyScreen} />
          <Stack.Screen name="FullVideos" component={FullVideosScreen} />
          <Stack.Screen
            name="VideoPlayerView"
            component={VideoPlayerView}
            options={{headerShown: false}}
          />
          {/*  <Stack.Screen name="PromoVideos" component={PromoVideosScreen} />
          <Stack.Screen name="Assesment" component={AssesmentScreen} />
          <Stack.Screen
            name="Recommendation"
            component={RecommendationScreen}
          />
          <Stack.Screen name="Qualify" component={PromoVideosScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Videos" component={VideosScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default AppNavigator;
