import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const PermanentCollectionListScreen = () => {
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
      }}>You have not collected any places yet</Text>
      <View style={{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
      }}>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize:14,
      }}>Go to  </Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}>
      <Image
        source={require('../assets/images/misc/Star.png')} />
      </TouchableOpacity>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize:14,
      }}>  some good places!</Text>
      </View>
    </View>
    
    </ScrollView>
  
  )
}

export default PermanentCollectionListScreen

