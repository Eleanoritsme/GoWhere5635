import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ActivityScreen from './screens/ActivityScreen';
import * as WebBrowser from "expo-web-browser";
import { firebase } from './config';
import 'expo-dev-client';

WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Register" component={RegistrationScreen} />
      </Stack.Navigator>
    );
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#FFE0E4"} }} name="Activity" component={ActivityScreen} />
      </Stack.Navigator>
    );
  }

  export default () => {
    return (
      <NavigationContainer>
        <App />
      </NavigationContainer>
    )
  }
