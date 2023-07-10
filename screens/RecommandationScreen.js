import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const RecommandationScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf')
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
        <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
        <Image
          source={require('../assets/images/users/Default_pfp.jpg')} 
          style={{
            marginLeft:20,
            width:90,
            height:90,
            borderRadius:400 / 2
          }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Review Posting')}}>
         <Text>Review Posting</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Feedback')}}>
        <Text>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Details')}}>
         <Text>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Reset Password')}}>
         <Text>Reset password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default RecommandationScreen

const styles = StyleSheet.create({
  title:{
    marginLeft:20,
    marginTop:20,
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    fontSize: 35,
  },
  subTitle:{
    marginTop:20,
    marginLeft:20,
    marginBottom:10,
  },
  subtitleText:{
    fontFamily:'Inter-Bold',
    fontSize:20
  },
  buttonContainer:{
    justifyContent:'space-around',
    flexDirection:'row',
    marginBottom:15,
    marginLeft:15,
    marginRight:15,
  },
  buttonContainer1:{
    justifyContent:'space-around',
    flexDirection:'row',
    marginTop:15,
    marginBottom:15,
    marginLeft:15,
    marginRight:15,
  },
  buttonInput:{
    borderColor:'#4F200D',
    borderWidth:2.5,
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:50,
    shadowColor: '#B3B3B3', 
    shadowOffset: { height: 2, width: 2 }, 
    shadowOpacity: 1, 
    shadowRadius: 1, 
    backgroundColor:'#FDDBB1',
  },
  inputContainer1:{
    flexDirection:'row',
    justifyContent:'center',
    width:260,
  },
  inputContainer2:{
    flexDirection:'row',
    justifyContent:'center',
    width:65,
  },
  inputContainer3:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:5,
    height:20,
  },
  inputText1:{
    fontFamily:'Inter-Bold',
    fontSize:25,
    color:'#7A3E3E',
  },
  inputText2:{
    fontFamily:'Inter-Bold',
    fontSize:15,
    color:'#7A3E3E',
    width:80,
    justifyContent:'center'
  },
  resetPswButton:{
    color:"#B04759", 
    fontWeight:'600', 
    fontSize:14,
  },
})
