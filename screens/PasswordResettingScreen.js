import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React, { useCallback, useState } from 'react'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
      top: hp('3.55%'),
    }}
    onLayout={onLayoutRootView}>
    <StatusBar barStyle={'dark-content'} />
      <Text style={{
        left: wp('5.13%'),
        fontFamily: 'Inter-ExtraBold',
        fontSize: wp('4.62%'),
        letterSpacing: 1,
        lineHeight: 50,
        marginBottom: hp('1.18%'),
      }}>
      Please Enter Your Email Address
      </Text>
      <TextInput
      placeholder='example@gmail.com'
      placeholderTextColor={'#ACACAC'}
      autoCorrect={false}
      autoCapitalize='none'
      onChangeText={(text) => setEmail(text)}
      fontSize={wp('3.59%')}
        style={{
          letterSpacing: 0.6,
          left: wp('5.13%'),
          borderWidth: 1,
          height: hp('5.92%'),
          width: wp('87.69%'),
          borderColor:'#4F200D',
          borderRadius: 6,
          marginBottom: hp('4.74%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>
      <TouchableOpacity style={{
          backgroundColor:'#FFCE84',
          width: wp('65.64%'),
          height: hp('5.69%'),
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: hp('4.74%'),
        }}
        onPress={() => {changePassword()}}>
          <Text style={{
            fontFamily: 'Inder-Regular',
            fontSize: wp('5.13%'),
            color: '#4F200D'
          }}>Send An Email</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default PasswordResettingScreen
