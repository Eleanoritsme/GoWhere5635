import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const PasswordResettingScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const changePassword = () => {
    if (email != null) {
      firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("Password rest email has been sent")
      }).catch((error) => {
        alert(error.message)
      })
    }
  }

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf'),
    "Inder-Regular": require('../assets/fonts/Inder-Regular.ttf')
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
    <SafeAreaView 
    style={{
      top:30,
    }}
    onLayout={onLayoutRootView}>
      <Text style={{
        left:20,
        fontFamily:'Inter-ExtraBold',
        fontSize:18,
        letterSpacing:1,
        lineHeight:50,
        marginBottom:10,
      }}>
      Please Enter Your Email Address
      </Text>
      <TextInput
      placeholder='example@gmail.com'
      placeholderTextColor={'#ACACAC'}
      fontSize={14}
        style={{
          left:20,
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#4F200D',
          borderRadius:6,
          marginBottom:40,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>
      <TouchableOpacity style={{
          backgroundColor:'#FFCE84',
          width:256,
          height:48,
          alignSelf:'center',
          justifyContent:'center',
          alignItems:'center',
          borderRadius:10,
          marginBottom:40,
        }}
        onPress={() => changePassword()}>
          <Text style={{
            fontFamily:'Inder-Regular',
            fontSize:20,
            color:'#4F200D'
          }}>Send An Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor:'#FFCE84',
          width:256,
          height:48,
          alignSelf:'center',
          justifyContent:'center',
          alignItems:'center',
          borderRadius:10,
        }}
          onPress={() => {navigation.navigate('Login')}}>
          <Text style={{
            fontFamily:'Inder-Regular',
            fontSize:20,
            color:'#4F200D'
          }}>Back To Login</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default PasswordResettingScreen