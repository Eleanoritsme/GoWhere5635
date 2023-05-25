import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'

import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';


const RegistrationScreen = () => {
  const [userName, setUserName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showError, setShowError] = useState(false)
  const [error, setError] = useState({})

  const getError = (email, password, confirmPassword) => {
    const error = {}
    if (!email) {
      error.email = "Plase enter your email"
    } else if (!email.includes('@')) {
      error.email = "Please enter a valid email address"
    }
    if (!password) {
      error.password = "Please enter the password"
    } else if (password.length < 8) {
      error.password = "The length of password should not less than 8 characters"
    }
    if (!confirmPassword) {
      error.confirmPassword = "Please confirm the password"
    } else if (password.length < 8 || password !== confirmPassword) {
      error.password = "Please enter the same password as above"
    }
    return error
  }

  registerUser = async (userName, dateOfBirth, email, password, confirmPassword) => {
    const error = getError(email, password, confirmPassword)
    if (Object.keys(error).length) {
      setShowError(true)
      setError(showError && error)
      console.log(error)
    } else {
    console.log('Registered');
    }

    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url:'https://gowhere5635.firebaseapp.com',
      })
      .then(() => {
        alert('Verification email sent!')
      }).catch((error) => {
        alert(error.message)
      })
      .then(() => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        .set({
          userName,
          dateOfBirth,
          email,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
    })
    .catch((error => {
      console.log(error.message)
    }))
  }

  const navigation = useNavigation()

  // useEffect(() => {
  //   const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       navigation.navigate("Login")
  //     }
  //   })
  //   return unsubscribe
  // }, [])



  let [fontsLoaded] = useFonts({
    "Roboto-Medium": require('../assets/fonts/Roboto-Medium.ttf'),
  });
  
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <SafeAreaView style={{flex:1}}>
    {/* LoginPage Logo */}
      <View style={{marginLeft:12, marginBottom:20}}>
        <Image
          style={{
          resizeMode:'contain',
          width:200,
          height:80}}
          source={require('../assets/images/misc/CornerLogo.png')} />
      </View>

    {/* Register Text */}
    <View>
      <Text style={{
        fontFamily:'Roboto-Medium',
        fontSize: 35,
        fontWeight: '500',
        color: '#333',
        marginLeft:12,
        marginBottom:20,
      }}>
        Register
      </Text>
    </View>
    
    {/* Other Login Method Options */}
    <View
        style={{
          justifyContent:'space-around',
          flexDirection:'row',
          marginBottom:30,
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

      <View>
          <Text 
            style={{
            fontSize:16,
            textAlign:'center', 
            color:'#666',
            marginBottom:30
            }}>
          OR
          </Text>
        </View>

    {/* Register Keyboard */}
      <SafeAreaView
        style={styles.container}
        behavior='padding'
      >
        <View 
          style={{
            flexDirection:'row',
            borderBottomColor:'#ccc',
            borderBottomWidth:1,
            paddingBottom:8,
            marginLeft:20,
            marginRight:20,
            marginBottom:40,
          }}>
          <AntDesign 
            name='user' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            style={{flex:1, paddingVertical:0}}
            placeholder='User Name'
            placeholderTextColor={"#B7B7B7"}
            onChangeText={(userName) => setUserName(userName)}
            autoCorrect={false}
            keyboardType='default'
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
            marginBottom:40,
          }}>
          <Fontisto 
            name='date' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Date of Birth'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
            onChangeText={(dateOfBirth) => setDateOfBirth(dateOfBirth)}
            autoCorrect={false}
            keyboardType='numbers-and-punctuation'
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
            marginBottom:40,
          }}>
          <Fontisto 
            name='email' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Email ID'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
            onChangeText={(email) => setEmail(email)}
            autoCapitalize='none'
            autoCorrect={false}
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
          style={{
            flexDirection:'row',
            borderBottomColor:'#ccc',
            borderBottomWidth:1,
            paddingBottom:8,
            marginLeft:20,
            marginRight:20,
            marginBottom:40,
          }}>
          <Ionicons
            name='ios-lock-closed-outline' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Password'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
            onChangeText={(password) => setPassword(password)}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
          />
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

        <View 
          style={{
            flexDirection:'row',
            borderBottomColor:'#ccc',
            borderBottomWidth:1,
            paddingBottom:8,
            marginLeft:20,
            marginRight:20,
            marginBottom:10,
          }}>
          <Ionicons
            name='ios-lock-closed-outline' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Confirm Password'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
            onChangeText={(password) => setPassword(password)}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
          />
          {error.confirmPassword && 
          <Text 
          style={{
            fontSize: 14,
            color:'red',
            marginTop:4,
          }}>
          {error.confirmPassword}
          </Text>}
        </View>
        {/* Conduct Register */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => registerUser(userName, dateOfBirth, email, password, confirmPassword)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View> 
      </SafeAreaView>

      {/* Register */}
      <View 
        style={{
        flexDirection:'row', 
        justifyContent:'center', 
        marginTop:20,
        marginBottom:30}}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Login')}}>
        <Text 
          style={{color:'#B04759', fontWeight:'600'}}> Login
        </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default RegistrationScreen

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
    backgroundColor:'#B04759',
    width:350,
    padding:18,
    borderRadius:10,
    alignItems:'center',
    marginBottom:30,
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