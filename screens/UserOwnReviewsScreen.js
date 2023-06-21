import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const UserOwnReviewsScreen = () => {
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
    <ScrollView
      style={{flex:1}}
      contentContainerStyle={{alignContent:'flex-start', paddingBottom:60}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    <View style={{
      height:'100%',
      alignItems:'center',
      justifyContent:'center'
    }}>
      <Text style={{
        textAlign:'center',
        fontFamily:'Inter-Regular',
        color:'#949494',
        marginTop:20,
        fontSize:14,
      }}>You do not have any reviews yet.</Text>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize:14,
        marginTop:10,
      }}>Share your experience for the place!</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Visited')}}
        style={{
          marginTop:10,
          borderRadius:15,
          width:80,
          height:30,
          alignItems:'center',
          justifyContent:'center',
          borderWidth:1,
          borderColor:'#949494',
        }}>
        <Text>
        Have a try
        </Text>
      </TouchableOpacity>
    </View>
    
    
    </ScrollView>
  )
}

export default UserOwnReviewsScreen