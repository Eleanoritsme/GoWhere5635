import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

const ActivityScreen = () => {

  const navigation = useNavigation()

  // const handleSignout = () => {
  //   auth
  //   .signOut()
  //   .then(() => {
  //     navigation.replace("Login")
  //   })
  //   .catch(error => alert(error.message))
  // }

  let [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
  });
  
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <SafeAreaView>
      <View style={{marginLeft:20, marginTop:20, marginBottom:40}}>
        <Text style={{
          fontFamily:'Inter-ExtraBold',
          fontSize: 50,}}>
          What are you looking for?
        </Text>
      </View>

      <View
        style={{
          justifyContent:'space-around',
          flexDirection:'row',
          marginBottom:20,
        }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderColor:'#212A3E',
            borderWidth:2.5,
            borderRadius:20,
            paddingHorizontal:50,
            shadowColor: '#B3B3B3', // IOS
            shadowOffset: { height: 2, width: 2 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            backgroundColor:'#FFCDD6',
          }}>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
          <Text style={{
            fontFamily:'Inter-ExtraBold',
            fontSize:36,
            color:'#002B5B'
          }}>Study  </Text>
          <Image style={{
            width:150,
            height:150,
            resizeMode:'contain',
          }}
          source={require('../assets/images/misc/Study.png')}/>
          </View>
        </TouchableOpacity> 
        </View>

        <View
        style={{
          justifyContent:'space-around',
          flexDirection:'row',
          marginBottom:20,
        }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderColor:'#212A3E',
            borderWidth:2.5,
            borderRadius:20,
            paddingHorizontal:50,
            shadowColor: '#B3B3B3', // IOS
            shadowOffset: { height: 2, width: 2 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            backgroundColor:'#FFCDD6',
          }}>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
          <Image style={{
            width:150,
            height:150,
            resizeMode:'contain',
          }}
          source={require('../assets/images/misc/Work.png')}/>
          <Text style={{
            fontFamily:'Inter-ExtraBold',
            fontSize:36,
            color:'#002B5B'
          }}>   Work</Text>
          </View>
        </TouchableOpacity> 
        </View>

        <View
        style={{
          justifyContent:'space-around',
          flexDirection:'row',
        }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderColor:'#212A3E',
            borderWidth:2.5,
            borderRadius:20,
            paddingHorizontal:50,
            shadowColor: '#B3B3B3', // IOS
            shadowOffset: { height: 2, width: 2 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            backgroundColor:'#FFCDD6',
          }}>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
          <Text style={{
            fontFamily:'Inter-ExtraBold',
            fontSize:36,
            color:'#002B5B'
          }}>Eat        </Text>
          <Image style={{
            width:150,
            height:150,
            resizeMode:'contain',
          }}
          source={require('../assets/images/misc/Eat.png')}/>
          </View>
        </TouchableOpacity> 
        </View>
    
    {/* <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignout}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View> */}
    </SafeAreaView>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    backgroundColor:'#0782F9',
    width:'60%',
    padding:15,
    borderRadius:10,
    alignItems:'center',
    marginTop:40,
  },
  buttonText:{
    color:'white',
    fontWeight:'700',
    fontSize:16,
  },
})