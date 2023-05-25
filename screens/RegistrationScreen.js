import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../config'

import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { doc, setDoc } from "firebase/firestore"; 
import {db} from '../config';

const RegistrationScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Activity")
      }
    })
    return unsubscribe
  }, [])

  const handleSignup = () => {
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Registered with:', user.email);
    })
    .catch(error => alert(error.message))
  }

  let [fontsLoaded] = useFonts({
    "Roboto-Medium": require('../src/assets/fonts/Roboto-Medium.ttf'),
  });
  
  if (!fontsLoaded) {
    return <AppLoading />
  }

  /*Submit data to firebase
  function create() {
    // submit data
    setDoc(doc(db, "users"), {
      email: email,
      password: password,
    }).then( ()=> {
      console.log('data submitted');
    
    }).catch((error) => {
      console.log(error);
    });
  } 
  */

  return (
    <SafeAreaView style={{flex:1}}>
    {/* LoginPage Logo */}
      <View style={{alignItems:'center'}}>
        <Image
          style={{
          resizeMode:'contain',
          width:300,
          height:250}}
          source={require('../src/assets/images/misc/Logo.png')} />
      </View>

    {/* Register Text */}
    <View>
      <Text style={{
        fontFamily:'Roboto-Medium',
        fontSize: 35,
        fontWeight: '500',
        color: '#333',
        marginLeft:15,
        marginBottom:20,
      }}>
        Register
      </Text>
    </View>

    {/* Other Login Method Options */}
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
            marginBottom:20,
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
            marginBottom:20,
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
            marginBottom:20,
          }}>
          <Image 
          style={styles.TwitterImage}
          source={require('../src/assets/images/misc/TwitterLogo.png')} />
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
            marginBottom:25,
          }}>
          <AntDesign 
            name='user' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='User Name'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
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
            marginBottom:25,
          }}>
          <Fontisto 
            name='date' 
            size={20} 
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Date of Birth eg:04112000'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
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
            marginBottom:25,
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
            marginBottom:25,
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
            secureTextEntry={true}
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
            color='#8C8383'
            style={{marginRight:5}}
          />
          <TextInput 
            placeholder='Confirm Password'
            placeholderTextColor={"#B7B7B7"}
            style={{flex:1, paddingVertical:0}}
            secureTextEntry={true}
          />
        </View>
        {/* Conduct Register */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignup}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View> 
      </SafeAreaView>

      {/* Register test */}
      <View>
        <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}>
        <Text 
          style={{color:'#AD40AF', fontWeight:'600'}}> turn to act screen!
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