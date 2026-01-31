import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from '@/navigation/TabNavigator';
import MovieDetailScreen from '@/screens/MovieDetailScreen';
import NavigationHeader from '@/components/NavigationHeader'; // Import custom header
import { RootStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          header: (props) => <NavigationHeader {...props} />, // Use custom header
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
        />
        <Stack.Screen 
          name="MovieDetail" 
          component={MovieDetailScreen}
          options={{ 
            headerShown: true, 
            title: '', 
            headerStyle: { backgroundColor: '#00B4E4' }, // HERO_BLUE
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator
