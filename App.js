import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ActivityScreen from './screens/ActivityScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Register" component={RegistrationScreen} />
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#FFE0E4"} }} name="Activity" component={ActivityScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});