import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../config'

import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Activity")
      }
    })
    return unsubscribe
  }, [])

  const handleLogin = () => {
    auth
    .signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);
    })
    .catch(error => alert(error.message))
  }

  let [fontsLoaded] = useFonts({
    "Roboto-Medium": require('../src/assets/fonts/Roboto-Medium.ttf'),
  });
  
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <SafeAreaView style={{flex:1}}>
    {/* LoginPage Logo */}
      <View 
        style={{
          alignItems:'center',
          marginTop:40,
          marginBottom:30,
          }}>
        <Image
          style={styles.LogoImage}
          source={require('../src/assets/images/misc/Registration.jpeg')} />
      </View>

    {/* Login Text */}
    <View>
      <Text style={{
        fontFamily:'Roboto-Medium',
        fontSize: 35,
        fontWeight: '500',
        color: '#333',
        marginLeft:15,
        marginBottom:30,
      }}>
        Login
      </Text>
    </View>

    {/* Login Keyboard */}
      <SafeAreaView
        style={styles.container}
        behavior='padding'
      >
        {/* <View style={styles.inputContainer}>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
        </View> */}
        <View 
          style={{
            flexDirection:'row',
            borderBottomColor:'#ccc',
            borderBottomWidth:1,
            paddingBottom:8,
            marginLeft:20,
            marginRight:20,
            marginBottom:25,
          }}>
          <MaterialIcons 
            name='alternate-email' 
            size={20} 
            color='#666'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Email ID'
            style={{flex:1, paddingVertical:0}}
            keyboardType='email-address'
          />
        </View> 

        <View 
          style={{
            flexDirection:'row',
            borderBottomColor:'#ccc',
            borderBottomWidth:1,
            paddingBottom:8,
            marginLeft:20,
            marginRight:20,
          }}>
          <Ionicons
            name='ios-lock-closed-outline' 
            size={20} 
            color='#666'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Password'
            style={{flex:1, paddingVertical:0}}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={() => {}}>
            <Text style={{color:"#AD40AF", fontWeight:'600', fontSize:14}}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>

        {/* Conduct Login */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text 
            style={{
            fontSize:14,
            textAlign:'center', 
            color:'#666',
            marginTop:20,
            marginBottom:40
            }}>
          Or, login with
          </Text>
        </View>
      </SafeAreaView>

      {/* Other Login Options */}
      <View
        style={{
          justifyContent:'space-around',
          flexDirection:'row'
        }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderColor:'#ddd',
            borderWidth:2,
            borderRadius:10,
            paddingHorizontal:30,
            paddingVertical:5,
          }}>
          <Image 
          style={styles.GoogleImage}
          source={require('../src/assets/images/misc/GoogleLogo.png')} />
        </TouchableOpacity> 

        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderColor:'#ddd',
            borderWidth:2,
            borderRadius:10,
            paddingHorizontal:30,
            paddingVertical:5,
          }}>
          <Image 
          style={styles.FacebookImage}
          source={require('../src/assets/images/misc/FacebookLogo.png')} />
        </TouchableOpacity> 

        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderColor:'#ddd',
            borderWidth:2,
            borderRadius:10,
            paddingHorizontal:30,
            paddingVertical:5,
          }}>
          <Image 
          style={styles.TwitterImage}
          source={require('../src/assets/images/misc/TwitterLogo.png')} />
        </TouchableOpacity> 
      </View>

      {/* Register */}
      <View 
        style={{
        flexDirection:'row', 
        justifyContent:'center', 
        marginTop:20,
        marginBottom:30}}>
        <Text>New to the app?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
        <Text 
          style={{color:'#AD40AF', fontWeight:'600'}}> Register now!
        </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  inputContainer:{
    width:'80%'
  },
  input:{
    backgroundColor:'white',
    paddingHorizontal:15,
    paddingVertical:10,
    borderRadius:10,
    marginTop:5,
  },
  buttonContainer:{
    width:'60%',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
  },
  button:{
    backgroundColor:'#AD40AF',
    width:350,
    padding:18,
    borderRadius:10,
    alignItems:'center',
  },
  buttonOutline:{
    backgroundColor:'white',
    marginTop:5,
    borderColor: '#AD40AF',
    borderWidth:2,
  },
  buttonText:{
    color:'white',
    fontWeight:'700',
    fontSize:16,
  },
  buttonOutlineText:{
    color:'#AD40AF',
    fontWeight:'700',
    fontSize:16,
  },
  LogoImage:{
    width:300,
    height:300,
    resizeMode:'contain'
  },
  GoogleImage:{
    flexDirection:'row',
    justifyContent:'space-around',
    width:40,
    height:40,
  },
  FacebookImage:{
    flexDirection:'row',
    justifyContent:'space-around',
    width:40,
    height:40,
  },
  TwitterImage:{
    flexDirection:'row',
    justifyContent:'space-around',
    width:40,
    height:40,
  },
})
