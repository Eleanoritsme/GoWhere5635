import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const BackgroudSettingScreen = () => {
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{
        justifyContent:'center', 
        alignSelf:'center'
      }}>
        <Image style={{
          width:400,
        }}
        source={require('../assets/images/users/WholeBackground.png')} />
       
      </SafeAreaView>
    </>
  );
};

export default BackgroudSettingScreen;