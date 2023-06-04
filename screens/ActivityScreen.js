import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();

const ActivityScreen = () => {

  const navigation = useNavigation()

  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
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
    <SafeAreaView>
      <View style={styles.title}>
        <Text style={styles.titleText}>
          What are you looking for?
        </Text>
      </View>

      <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <TouchableOpacity
          onPress={() => {navigation.navigate('Filter')}}
          //存储选择 要添加一下 下面三个同理
          style={styles.buttonInput}>
          <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Study  </Text>
          <Image style={styles.inputImage}
          source={require('../assets/images/misc/Study.png')}/>
          </View>
        </TouchableOpacity> 
        </View>

        <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <TouchableOpacity
          onPress={() => {navigation.navigate('Filter')}}
          style={styles.buttonInput}>
          <View style={styles.inputContainer}>
          <Image style={styles.inputImage}
          source={require('../assets/images/misc/Work.png')}/>
          <Text style={styles.inputText}>   Work</Text>
          </View>
        </TouchableOpacity> 
        </View>

        <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <TouchableOpacity
          onPress={() => {navigation.navigate('Filter')}}
          style={styles.buttonInput}>
          <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Eat        </Text>
          <Image style={styles.inputImage}
          source={require('../assets/images/misc/Eat.png')}/>
          </View>
        </TouchableOpacity> 
        </View>
    </SafeAreaView>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  title:{
    marginLeft:20,
    marginTop:20,
    marginBottom:40
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    fontSize: 35,
  },
  buttonContainer:{
    justifyContent:'space-around',
    flexDirection:'row',
    marginBottom:20,
  },
  buttonInput:{
    borderColor:'#212A3E',
    borderWidth:2.5,
    borderRadius:20,
    paddingHorizontal:50,
    shadowColor: '#B3B3B3', 
    shadowOffset: { height: 2, width: 2 }, 
    shadowOpacity: 1, 
    shadowRadius: 1, 
    backgroundColor:'#FFCDD6',
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:20
  },
  inputImage:{
    width:150,
    height:150,
    resizeMode:'contain',
  },
  inputText:{
    fontFamily:'Inter-ExtraBold',
    fontSize:36,
    color:'#002B5B'
  }
})

  // const handleSignout = () => {
  //   auth
  //   .signOut()
  //   .then(() => {
  //     navigation.replace("Login")
  //   })
  //   .catch(error => alert(error.message))
  // }