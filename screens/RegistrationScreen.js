import { StyleSheet, Text, TouchableOpacity, Platform, Pressable, View, Image} from 'react-native'
import React, { useState, useCallback } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

SplashScreen.preventAutoHideAsync();

const RegistrationScreen = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [show, setShow] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  const toggleDatePicker = () => {
    setShow(!show);
  }

  const OnChange = ({type}, selectedDate) => {
    if (type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(fDate(currentDate))
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmDateIOS = () => {
    setDateOfBirth(fDate(date));
    toggleDatePicker();
  }

  const fDate = (rawDate) => {
    let tempDate = new Date(rawDate);
    return tempDate.getDate() +
    '/' +
    (tempDate.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    tempDate.getFullYear();
  }

  

  /*const showMode = (currentMode) => {
    setShow(true);
  };

  function handleDOBpressed() {
    showMode('date')
  }
  */


 
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

  registerUser = async (userName, dateOfBirth, email, password, confirmPassword) => {
    const error = getError(userName, dateOfBirth, email, password, confirmPassword)
    if (Object.keys(error).length) {
      setShowError(true)
      setError(showError && error)
      console.log(error)
    } else {
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
        console.log(error.message)
      })
    })
    .catch((error => {
      if (error.code == 'auth/email-already-in-use') {
        alert('The email address is already in use by another account.')
      } 
      console.log(error.message)
    }))
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
    <SafeAreaView style={{flex:1}}>
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

      <View style={styles.inputContainer}>
        <Fontisto 
          name='date' 
          size={20} 
          color='#8C8383'
          style={styles.icon}
        />

        {show && (
          <DateTimePicker
            mode='date'
            display='default'
            value={date}
            onChange={OnChange}
            style={{height:170, marginTop:-10}}
            //styles={styles.dateTimeContainer}
          />
        )}

        {show && Platform.OS === "ios" && (
          <View style = {{flex:1, flexDirection:"row", justifyContent: "space-around"}}>
            <TouchableOpacity onPress={confirmDateIOS}>
              <Text style={styles.inputDate}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {!show && ( 
          <Pressable
            onPress = {toggleDatePicker}
          >
            <TextInput 
              style={styles.input}
              placeholder="Date of Birth (MM/DD/YYYY)"
              placeholderTextColor={"#B7B7B7"}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              editable={false}
              onPressIn={toggleDatePicker}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.errorContainer}>
          <Text 
          style={styles.error}>
          {error.dateOfBirth}
          </Text>
      </View>

      <View 
        style={styles.inputContainer}
        behavior='padding'>
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
          behavior='padding'>
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
          onPress={() => registerUser(userName, dateOfBirth, email, password, confirmPassword)}
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
    marginLeft:12,
    marginBottom:20
  },
  logoImage:{
    resizeMode:'contain',
    width:305,
    height:60,
  },
  registerText:{
    marginLeft:20,
    marginBottom:30,
  },
  text:{
    fontFamily:'Inter-SemiBold',
    fontSize: 33,
    fontWeight: '500',
    color: '#000000',
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
  icon:{
    marginRight:5
  },
  input:{
    flex:1,
    paddingVertical:0
  },
  inputDate:{
    flex:1,
    marginLeft:"-110%",
    marginTop:"130%",
    alignItems:"center",    
    width:150,
  },
  errorContainer:{
    marginTop:8,
    marginLeft:20,
  },
  error:{
    fontSize: 14,
    color:'red',
  },
  buttonContainer:{
    marginLeft:20,
    marginRight:20,
    marginTop:20,
  },
  button:{
    backgroundColor:'#FFBC11',
    width:350,
    padding:18,
    borderRadius:10,
    alignItems:'center',
  },
  buttonInput:{
    fontFamily:'Inter-ExtraBold',
    color:'white',
    fontWeight:'700',
    fontSize:18,
  },
  login:{
    fontFamily:'Inter-SemiBold',
    fontSize:15,
    flexDirection:'row', 
    justifyContent:'center', 
    marginTop:20,
  },
  loginText:{
    fontFamily:'Inter-ExtraBold',
    fontSize:15,
    color:'#FFBC11',
    fontWeight:'600'
  },
  dateTimeContainer: {
    marginTop:-120,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
})