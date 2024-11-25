import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native'
import React, { useState, useCallback } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

SplashScreen.preventAutoHideAsync();

const RegistrationScreen = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [occupation, setOccupation] = useState(null)
  const [country, setCountry] = useState(null)
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)
  const [bio, setBio] = useState(null)
  const [background, setBackground] = useState('https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png')
  const [image, setImage] = useState('https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg')

  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [show, setShow] = useState(false);
  
  
  const OnChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      '/' +
      (tempDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      tempDate.getFullYear();
    setDateOfBirth(fDate);
    setDateSelected(true);
  };

  const showMode = (currentMode) => {
    setShow(true);
  };

  function handleDOBpressed() {
    showMode('date')
  }

 
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState({})

  const getError = (userName, dateOfBirth, email, password, confirmPassword) => {
    const error = {}
    if (!userName) {
      error.userName = "Please enter the user name"
    } else if (userName.length < 6) {
      error.userName = "The length should not be less than 6 chatacters"
    }
    if (!dateOfBirth || dateOfBirth.includes('Date of Birth (MM/DD/YYYY)')) {
      error.dateOfBirth = "Please enter the date of birth"
    }
    if (!email) {
      error.email = "Plase enter your email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.email = "Please enter a valid email address"
    }
    if (!password) {
      error.password = "Please enter the password"
    } else if (password.length < 8) {
      error.password = "The length should not be less than 8 characters"
    }
    if (!confirmPassword) {
      error.confirmPassword = "Please confirm the password"
    } else if (password.length < 8 || password !== confirmPassword) {
      error.confirmPassword = "Please enter the same password as above"
    }
    return error
  }

  const registerUser = async (userName, dateOfBirth, email, password, confirmPassword, occupation, country, state, city, bio, background, image) => {
    const error = getError(userName, dateOfBirth, email, password, confirmPassword)
    if (Object.keys(error).length) {
      setShowError(true)
      setError(showError && error)
      console.log(error)
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch((error => {
        if (error.code == 'auth/email-already-in-use') {
          alert('The email address is already in use by another account.')
        } 
        console.log(error.message);
      }))
    .then(() => {
      firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url:'https://gowhere5635.firebaseapp.com',
      })
      .then(() => {
        alert('Verification email sent!');
        navigation.navigate('Login')
      })
      .catch((error) => {
        alert(error.message)
      })
      .then(() => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        .set({
          userName,
          dateOfBirth,
          occupation,
          country,
          state,
          city,
          bio,
          email,
          background,
          image
        })
        console.log(firebase.auth().currentUser.emailVerified)
      })
      .catch((error) => {
        console.log(error.message)
      })
    })
    
  }
}

  const navigation = useNavigation()

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
    style={{flex:1}}
    enableAutomaticScroll
    extraScrollHeight={50}
    keyboardVerticalOffset={70}
    >
    <StatusBar barStyle={'dark-content'} />
    <SafeAreaView style={{flex:1, top:hp('2%')}}>
    {/* LoginPage Logo */}
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/misc/LogoC.png')} />
      </View>

    {/* Register Text */}
    <View style={styles.registerText} onLayout={onLayoutRootView}>
      <Text style={styles.text}>
        Register
      </Text>
    </View>
    
    {/* Register Keyboard */}
      <View 
        style={styles.inputContainer}
        behavior='padding'>
        <AntDesign 
          name='user' 
          size={20} 
          color='#8C8383'
          style={styles.icon}
        />
        <TextInput
          style={styles.input} 
          placeholder='User Name'
          placeholderTextColor={"#B7B7B7"}
          onChangeText={(userName) => setUserName(userName)}
          autoCorrect={false}
          keyboardType='default'
        />    
      </View> 

      <View style={styles.errorContainer}>
          <Text 
          style={styles.error}>
          {error.userName}
          </Text>
      </View>

      <View style={styles.inputContainer}
      behavior='padding'>
        <Fontisto 
          name='date' 
          size={20} 
          color='#8C8383'
          style={styles.icon}
        />
        <TextInput
          style={styles.input} 
          placeholder='Date Of Birth (DD/MM/YYYY)'
          placeholderTextColor={"#B7B7B7"}
          onChangeText={(dateOfBirth) => setDateOfBirth(dateOfBirth)}
          autoCorrect={false}
          keyboardType='default'
        /> 
      </View>

      <View style={styles.errorContainer}>
          <Text 
          style={styles.error}>
          {error.dateOfBirth}
          </Text>
      </View>

      <View 
        style={styles.inputContainer}
        behavior='padding'
      >
        <Fontisto 
          name='email' 
          size={20} 
          color='#8C8383'
          style={styles.icon}
        />
        <TextInput 
          style={styles.input}
          placeholder='Email ID'
          placeholderTextColor={"#B7B7B7"}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
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
          behavior='padding'
        >
          <Ionicons
            name='ios-lock-closed-outline' 
            size={20} 
            color='#8C8383'
            style={styles.icon}
          />
          <TextInput
            style={styles.input} 
            placeholder='Password'
            placeholderTextColor={"#B7B7B7"}
            onChangeText={(password) => setPassword(password)}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.errorContainer}> 
          <Text 
          style={styles.error}>
          {error.password}
          </Text>
        </View>

        <View 
          style={styles.inputContainer}
          behavior='padding'
        >
          <Ionicons
            name='ios-lock-closed-outline' 
            size={20} 
            color='#8C8383'
            style={styles.icon}
          />
          <TextInput
            style={styles.input} 
            placeholder='Confirm Password'
            placeholderTextColor={"#B7B7B7"}
            onChangeText={(password) => setConfirmPassword(password)}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
          />
          </View>

        <View style={styles.errorContainer}>
          <Text 
          style={styles.error}>
          {error.confirmPassword}
          </Text>
        </View>

        {/* Conduct Register */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {registerUser(userName, dateOfBirth, email, password, confirmPassword, occupation, country, state, city, bio, background, image)}}
          style={styles.button}
        >
          <Text style={styles.buttonInput}>Register</Text>
        </TouchableOpacity>
      </View> 

      {/* LogIn */}
      <View 
        style={styles.login}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Login')}}>
        <Text 
          style={styles.loginText}> Login
        </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAwareScrollView>
  )
}

export default RegistrationScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  logo:{
    marginLeft: wp('3.08%'),
    marginBottom: hp('2.37%')
  },
  logoImage:{
    resizeMode: 'contain',
    width: wp('78.21%'),
    height: hp('7.11%'),
  },
  registerText:{
    marginLeft: wp('5.13%'),
    marginBottom: hp('3.55%'),
  },
  text:{
    fontFamily:'Inter-SemiBold',
    fontSize: wp('8.46%'),
    fontWeight: '500',
    color: '#000000',
  },
  inputContainer:{
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: hp('0.95%'),
    marginLeft: wp('5.13%'),
    marginRight: wp('5.13%'),
    marginTop: hp('3.55%'),
  },
  icon:{
    marginRight: wp('1.28%')
  },
  input:{
    flex: 1,
  },
  inputDate:{
    flex: 1,
    color: '#B7B7B7'
  },
  errorContainer:{
    marginTop: hp('0.95%'),
    marginLeft: wp('5.13%'),
  },
  error:{
    fontSize: wp('3.59%'),
    color:'red',
  },
  buttonContainer:{
    marginLeft: wp('5.13%'),
    marginRight: wp('5.13%'),
    marginTop: hp('2.37%')
  },
  button:{
    backgroundColor: '#FFBC11',
    width: wp('89.74%'),
    padding: wp('4.62%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonInput:{
    fontFamily: 'Inter-ExtraBold',
    color: 'white',
    fontWeight: '700',
    fontSize: wp('4.62%'),
  },
  login:{
    fontFamily: 'Inter-SemiBold',
    fontSize: wp('3.85%'),
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: hp('2.37%'),
  },
  loginText:{
    fontFamily: 'Inter-ExtraBold',
    fontSize: wp('3.85%'),
    color: '#FFBC11',
    fontWeight: '600'
  },
})