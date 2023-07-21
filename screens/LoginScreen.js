import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Dimensions, StatusBar, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useFocusEffect } from '@react-navigation/native'

SplashScreen.preventAutoHideAsync();

const LoginScreen = () => {
  useFocusEffect(
    React.useCallback(() => {

    }, [navigation])
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showError, setShowError] = useState(false)
  const [error, setError] = useState({})

  const getError = (email, password) => {
    const error = {}
    if (!email) {
      error.email = "Plase enter your email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
        await firebase.auth().signInWithEmailAndPassword(email, password);
        
        const user = firebase.auth().currentUser;
        if (user && user.emailVerified) {
          console.log('Email is verified');
          navigation.navigate('Activity');
        } else {
          Alert.alert(
            'Email is not verified',
            'Please check you email and complete the verification.',
            [
              {text: 'OK', style: 'cancel', onPress: () => {}},
            ])
        }
      } catch (error) {
        alert(error.message)
      }
    }
  }
  
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
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
    <KeyboardAwareScrollView 
    style={{flex:1, width:screenWidth, height:screenHeight}}
    enableAutomaticScroll
    extraScrollHeight={50}
    keyboardVerticalOffset={70}
    showsVerticalScrollIndicator={false}
    >
    <StatusBar barStyle={'dark-content'} />
    <SafeAreaView style={{flex:1, top:15,}}>
    <ScrollView>
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
            <TouchableOpacity onPress={() => navigation.navigate('Reset Password')}>
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
          <Text style={styles.registerText1}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
          <Text 
            style={styles.registerText}> Register now!
          </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAwareScrollView>
  )
}


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const scaleFactor = 0.1;

const styles = StyleSheet.create({
  logo:{
    alignItems:'center'
  },
  logoImage:{
    width: wp('100%'),
    height: hp('43%'),
    resizeMode:'contain'
  },
  logInText:{
    marginLeft:wp('5%'),
    marginBottom:hp('4%')
  },
  text:{
    fontFamily:'Inter-SemiBold',
    fontSize: wp('9%'),
    fontWeight: '500',
    color: '#333',
  },
  inputContainer:{
    flexDirection:'row',
    borderBottomColor:'#ccc',
    borderBottomWidth:1,
    paddingBottom:hp('0.9%'),
    marginLeft:wp('5.12%'),
    marginRight:wp('5.12%'),
    marginTop:wp('10.25%'),
  },
  input:{
    flex:1,
  },
  resetPswButton:{
    fontFamily:"Inter-Bold",
    color:"#FFBC11", 
    fontWeight:'600', 
    fontSize:wp('3.59%'),
  },
  buttonContainer:{
    marginLeft:wp('5.12%'),
    marginRight:wp('5.12%'),
    marginTop:hp('2.37'),
  },
  button:{
    backgroundColor:'#FFBC11',
    width:wp('90%'),
    padding:wp('5%'),
    borderRadius:10,
    alignItems:'center',
  },
  register:{
    flexDirection:'row', 
    justifyContent:'center', 
    marginTop:20,
    marginBottom:30
  },
  registerText:{
    fontFamily:"Inter-ExtraBold",
    fontSize:wp('3.84%'),
    color:'#FFBC11',
    fontWeight:'600'
  },
  registerText1:{
    fontFamily:"Inter-SemiBold",
    fontSize:wp('3.84%'),
    fontWeight:'600'
  },
  errorContainer:{
    marginTop:hp('0.94%'),
    marginLeft:wp('5.12%'),
  },
  error:{
    fontSize:wp('3.59%'),
    color:'red', 
  },
  icon:{
    marginRight:wp('2%')
  },
  buttonInput:{
    fontFamily:'Inter-ExtraBold',
    color:'white',
    fontWeight:'700',
    fontSize:wp('4.61'),
  },
})

export default LoginScreen