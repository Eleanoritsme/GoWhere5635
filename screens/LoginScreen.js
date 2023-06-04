import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useCallback } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

SplashScreen.preventAutoHideAsync();

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
    "Roboto-Medium": require('../assets/fonts/Roboto-Medium.ttf'),
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
    <SafeAreaView style={{flex:1}}>
    {/* LoginPage Logo */}
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/misc/Logo.png')} />
      </View>

    {/* Login Text */}
      <View style={styles.logInText} onLayout={onLayoutRootView}>
        <Text style={styles.text}>
          Login
        </Text>
      </View>

    {/* Login Keyboard */}
      <View 
      style={styles.inputContainer}
      behavior='padding'>
        <MaterialIcons 
          name='alternate-email' 
          size={20} 
          color='#8C8383'
          style={styles.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Email ID'
          placeholderTextColor="#B7B7B7" 
          autoCapitalize='none'
          autoCorrect={false}
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType='email-address'
        />
      </View>

        
      <View style={styles.errorContainer}>
        <Text 
          style={styles.error}>
          {error.email}
        </Text>
      </View>
      
      <View 
        style={styles.inputContainer}
        behavior='padding'>
        <Ionicons
          name='ios-lock-closed-outline' 
          size={20} 
          color='#8C8383'
          style={styles.icon}
        />
        <TextInput
          style={styles.input}  
          placeholder='Password'
          placeholderTextColor="#B7B7B7" 
          autoCapitalize='none'
          autoCorrect={false}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
        <View>
          <TouchableOpacity onPress={() => changePassword()}>
            <Text style={styles.resetPswButton}>
            Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.errorContainer}>
        <Text 
          style={styles.error}>
          {error.password}
        </Text>
      </View>

      {/* Conduct Login */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => loginUser(email, password)}
          style={styles.button}
        >
          <Text style={styles.buttonInput}>
          Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Register */}
      <View 
        style={styles.register}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
        <Text 
          style={styles.resgisterText}> Register now!
        </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  logo:{
    alignItems:'center'
  },
  logoImage:{
    width:400,
    height:350,
    resizeMode:'contain'
  },
  logInText:{
    marginLeft:20,
    marginBottom:30
  },
  text:{
    fontFamily:'Roboto-Medium',
    fontSize: 35,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer:{
    flexDirection:'row',
    borderBottomColor:'#ccc',
    borderBottomWidth:1,
    paddingBottom:8,
    marginLeft:20,
    marginRight:20,
    marginTop:40,
  },
  input:{
    flex:1,
    paddingVertical:0
  },
  resetPswButton:{
    color:"#B04759", 
    fontWeight:'600', 
    fontSize:14,
  },
  buttonContainer:{
    marginLeft:20,
    marginRight:20,
    marginTop:20,
  },
  button:{
    backgroundColor:'#B04759',
    width:350,
    padding:18,
    borderRadius:10,
    alignItems:'center',
  },
  register:{
    flexDirection:'row', 
    justifyContent:'center', 
    marginTop:20,
    marginBottom:30
  },
  resgisterText:{
    color:'#B04759',
    fontWeight:'600'
  },
  errorContainer:{
    marginTop:8,
    marginLeft:20,
  },
  error:{
    fontSize: 14,
    color:'red', 
  },
  icon:{
    marginRight:5
  },
  buttonInput:{
    color:'white',
    fontWeight:'700',
    fontSize:16,
  },
})
