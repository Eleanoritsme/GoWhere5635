import { View, Text, StatusBar, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useCallback } from 'react';
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

SplashScreen.preventAutoHideAsync();

const IntroScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "PTSerif-BoldItalic": require('../assets/fonts/PTSerif-BoldItalic.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf'),
    "Inter-Light": require('../assets/fonts/Inter-Light.ttf')
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
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onLayout={onLayoutRootView}>
    <StatusBar barStyle={'dark-content'} />

    <Image style={{
      position:'absolute',
      width: wp('98%'),
      height: wp('98%'),
      left: wp('48%'),
      top: hp('16%'),
    }}
    source={require('../assets/images/misc/LogoA.png')} />
    
    <Image style={{
      justifyContent: 'center',
      marginBottom: hp('10%'),
    }}
    source={require('../assets/images/misc/GoWhereLogo.png')} /> 
    <Text
      style={{
        fontFamily: 'PTSerif-BoldItalic',
        fontSize: wp('9.23%'),
      }}>Welcome Back!</Text>
    <View style={{flex: 1, justifyContent:'center', position: 'absolute', flexDirection: 'row', left: wp('65%'), top:('90%')}}>
    <Text style={{
      fontFamily: 'Inter-Light',
      fontSize: wp('7%'),
    }}>Login</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    <AntDesign name='rightcircleo' size={ wp('9%')} 
    style={{
      marginLeft: wp('2%')
    }}/>
    </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default IntroScreen