import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { firebase } from '../config'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const FeedbackScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [navigation])
  )

  const [user, setUser] = useState();
  const {uid} = firebase.auth().currentUser;
  const getUser = async() => {
    try {
      const documentSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      const userData = documentSnapshot.data();
      setUser(userData);
    } catch {
      console.log("get data")
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
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
        top: hp('23.7%'),
      }}
      onLayout={onLayoutRootView}>
      <StatusBar barStyle={'dark-content'} />
      <Image
          source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}}
          style={{
            left: wp('33.33%'),
            marginLeft: wp('5.13%'),
            width: wp('23.09%'),
            height: wp('23.09%'),
            borderRadius: 200,
            marginBottom: hp('5.92%'),
          }}
      />
      <Text style={{
        fontFamily: 'Inter-ExtraBold',
        fontSize: wp('8.21%'),
        textAlign: 'center',
        letterSpacing: 1,
        lineHeight: 50,
        marginBottom: hp('9.48%'),
      }}>Thanks for your feedback! :)</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize: wp('5.13%'),
          letterSpacing: -0.41,
          textAlign:'center',
          marginBottom: hp('3.55%'),
        }}>My Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Visited')}}>
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize: wp('5.13%'),
          letterSpacing: -0.41,
          textAlign:'center',
          marginBottom: hp('3.55%'),
        }}>View places</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}>
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize: wp('5.13%'),
          letterSpacing: -0.41,
          textAlign:'center',
          marginBottom: hp('3.55%'),
        }}>Choose an activity</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default FeedbackScreen
