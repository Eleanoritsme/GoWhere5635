import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'

import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showError, setShowError] = useState(false)
  const [error, setError] = useState({})

  const getError = (email, password) => {
    const error = {}
    if (!email) {
      error.email = "Plase enter your email"
    } else if (!email.includes('@')) {
      error.email = "Please enter a valid email address"
    }
    if (!password) {
      error.password = "Please enter the password"
    } else if (password.length < 8) {
      error.password = "Incorrect password"
    }
    return error
  }

  const navigation = useNavigation()

  loginUser = async (email, password) => {
    const error = getError(email, password)
    if (Object.keys(error).length) {
      setShowError(true)
      setError(showError && error)
      console.log(error)
    } else {
      setError(false)
      setShowError(false)
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
      } catch (error) {
        alert(error.message)
      }
    }
  }


  let [fontsLoaded] = useFonts({
    "Roboto-Medium": require('../assets/fonts/Roboto-Medium.ttf'),
  });
  
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <SafeAreaView style={{flex:1}}>
    {/* LoginPage Logo */}
      <View>
        <Image
          style={styles.Logo}
          source={require('../assets/images/misc/Logo.png')} />
      </View>

    {/* Login Text */}
    <View>
      <Text style={styles.LoginText}>
        Login
      </Text>
    </View>

    {/* Login Keyboard */}
      <SafeAreaView
        style={styles.container}
        behavior='padding'
      >
        <View style={styles.inputContainer}>
          <MaterialIcons 
            name='alternate-email' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Email ID'
            placeholderTextColor="#B7B7B7" 
            style={styles.input}
            autoCapitalize='none'
            autoCorrect={false}
            // value={email}
            onChangeText={(email) => setEmail(email)}
            keyboardType='email-address'
          />
          {error.email && 
          <Text 
          style={{
            fontSize: 14,
            color:'red',
            marginTop:4,
          }}>
          {error.email}
          </Text>}
        </View> 

        <View 
          style={styles.inputContainer}>
          <Ionicons
            name='ios-lock-closed-outline' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Password'
            placeholderTextColor="#B7B7B7" 
            style={styles.input}
            autoCapitalize='none'
            autoCorrect={false}
            // value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={() => {}}>
            <Text style={{color:"#B04759", fontWeight:'600', fontSize:14}}>Forgot Password?</Text>
          </TouchableOpacity>
          {error.password && 
          <Text 
          style={{
            fontSize: 14,
            color:'red',
            marginTop:4,
          }}>
          {error.password}
          </Text>}
        </View>

        {/* Conduct Login */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => loginUser(email, password)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom:30}}>
          <Text style={{
            fontSize:14,
            textAlign:'center', 
            color:'#666',
            marginBottom:30,
            }}>
          OR
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
          source={require('../assets/images/misc/GoogleLogo.png')} />
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
          source={require('../assets/images/misc/FacebookLogo.png')} />
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
          source={require('../assets/images/misc/TwitterLogo.png')} />
        </TouchableOpacity> 
      </View>

      {/* Register */}
      <View 
        style={{
        flexDirection:'row', 
        justifyContent:'center', 
        marginTop:20,
        marginBottom:30}}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
        <Text 
          style={{color:'#B04759', fontWeight:'600'}}> Sign up now!
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
  Logo:{
    width:400,
    height:350,
    resizeMode:'contain'
  },
  LoginText: {
    fontFamily:'Roboto-Medium',
    fontSize: 35,
    fontWeight: '500',
    color: '#333',
    marginLeft:20,
    marginBottom:20,
  },
  inputContainer:{
    flexDirection:'row',
    borderBottomColor:'#ccc',
    borderBottomWidth:1,
    paddingBottom:8,
    marginLeft:20,
    marginRight:20,
    marginTop:30,
  },
  input:{
    flex:1, 
    paddingVertical:0,
  },
  buttonContainer:{
    width:'60%',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    marginBottom:25,
  },
  button:{
    backgroundColor:'#B04759',
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
