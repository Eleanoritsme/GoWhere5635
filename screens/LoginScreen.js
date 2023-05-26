import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
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
      <View style={{
        alignItems:'center'
      }}>
        <Image
          style={{
            width:400,
            height:350,
            resizeMode:'contain'
          }}
          source={require('../assets/images/misc/Logo.png')} />
      </View>

    {/* Login Text */}
      <View style={{
        marginLeft:20,
        marginBottom:30
      }}>
        <Text style={{
          fontFamily:'Roboto-Medium',
          fontSize: 35,
          fontWeight: '500',
          color: '#333',
        }}>
          Login
        </Text>
      </View>

    {/* Login Keyboard */}
      <View 
      style={{
        flexDirection:'row',
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        paddingBottom:8,
        marginLeft:20,
        marginRight:20,
        marginTop:40,
      }}
      behavior='padding'>
        <MaterialIcons 
          name='alternate-email' 
          size={20} 
          color='#8C8383'
          style={{marginRight:5}}
        />
        <TextInput 
          placeholder='Email ID'
          placeholderTextColor="#B7B7B7" 
          autoCapitalize='none'
          autoCorrect={false}
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType='email-address'
        />
      </View>

        
      <View style={{
        marginTop:8,
        marginLeft:20,
      }}>
        <Text 
          style={{
            fontSize: 14,
            color:'red',
          }}>
          {error.email}
        </Text>
      </View>
      
      <View 
        style={{
          flexDirection:'row',
          borderBottomColor:'#ccc',
          borderBottomWidth:1,
          paddingBottom:8,
          marginLeft:20,
          marginRight:20,
          marginTop:40,
        }}
        behavior='padding'>
        <Ionicons
          name='ios-lock-closed-outline' 
          size={20} 
          color='#8C8383'
          style={{marginRight:5}}
        />
        <TextInput 
          placeholder='Password'
          placeholderTextColor="#B7B7B7" 
          style={{
            flex:1, 
          }}
          autoCapitalize='none'
          autoCorrect={false}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
        <View>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{
              color:"#B04759", 
              fontWeight:'600', 
              fontSize:14,
            }}>
            Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={{
        marginTop:8,
        marginLeft:20,
      }}>
        <Text 
          style={{
            fontSize: 14,
            color:'red', 
          }}>
          {error.password}
        </Text>
      </View>

      {/* Conduct Login */}
      <View style={{
        marginLeft:20,
        marginRight:20,
        marginTop:20,
      }}>
        <TouchableOpacity
          onPress={() => loginUser(email, password)}
          style={{
            backgroundColor:'#B04759',
            width:350,
            padding:18,
            borderRadius:10,
            alignItems:'center',
          }}
        >
          <Text style={{
            color:'white',
            fontWeight:'700',
            fontSize:16,
          }}>
          Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Register */}
      <View 
        style={{
        flexDirection:'row', 
        justifyContent:'center', 
        marginTop:20,
        marginBottom:30
        }}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
        <Text 
          style={{
            color:'#B04759',
            fontWeight:'600'}}> Register now!
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
})