import { Text, TouchableOpacity, View, Image, Alert, Platform } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { firebase } from '../config';
import * as SplashScreen from 'expo-splash-screen'
import Entypo from 'react-native-vector-icons/Entypo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

SplashScreen.preventAutoHideAsync();

const ProfileEditScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState();
  const {uid} = firebase.auth().currentUser;

  const getUser = async () => {
    try {
      const documentSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      const userData = documentSnapshot.data();
      setUser(userData);
    } catch {
      console.log("get data")
    }
  };

  const handleUpdate = async() => {
    firebase.firestore().collection('users').doc(uid).update({
      userName: user.userName,
      dateOfBirth: user.dateOfBirth, 
      occupation: user.occupation, 
      country: user.country, 
      city: user.city, 
      bio: user.bio,
    })
    .then(() => {
      console.log('User data updated!');
      Alert.alert(
        'Changes Saved!',
        'Your profile has been updated successfully.',
        [
          {text: 'Back', onPress: () => {navigation.navigate('User Profile')}, style: 'cancel'}
        ]
      );
    })
  }

  useEffect(() => {
    getUser();
  }, []);

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
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
    extraScrollHeight={120}
    keyboardVerticalOffset={70}
    enableResetScrollToCoords={false}
    >
    <ScrollView
      style={{flex:1}}
      contentContainerStyle={{alignContent:'flex-start', paddingBottom:60}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    <TouchableOpacity
      onPress={() => navigation.navigate('User Image')}
      style={{
        alignItems:'center',
        marginBottom:30,
      }}>
      <Image 
        style={{
          height: 135,
          width: 135,
          borderRadius: 75,
          marginTop:10,
        }}
        source={user ? user.background : require('../assets/images/users/Default_pfp.jpg')} />
      <View style={{
        position:'absolute',
        contentContainerStyle:''
      }}>
        <Entypo name='camera' size={30} color='#FFBC11' style={{top:110, left:55}} />
      </View>
    </TouchableOpacity>
    <View
      style={{
        left:20
      }}>
      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>User Name</Text>
      <TextInput
      placeholder='User Name'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.userName : ''}
      autoCorrect={false}
      autoCapitalize='none'
      onChangeText={(text) => setUser({...user, userName:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Date Of Birth</Text>
      <TextInput
      placeholder='Date Of Birth'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.dateOfBirth : ''}
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, dateOfBirth:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Occupation</Text>
      <TextInput
      placeholder='Occupation'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.occupation : ''}
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, occupation:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Country/Region</Text>
      <TextInput
      placeholder='Country/Region'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.country : ''}
      autoCapitalize='words'
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, country:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>City</Text>
      <TextInput
      placeholder='City'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.city : ''}
      onChangeText={(text) => setUser({...user, city:text})}
      autoCorrect={false}
      autoCapitalize='words'
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Bio</Text>
     <TextInput
      placeholder='Bio'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.bio : ''}
      onChangeText={(text) => setUser({...user, bio:text})}
      autoCorrect={false}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Email</Text>
      <TouchableOpacity onPress={() => Alert.alert(
        'Warning',
       'You cannot change your email because it is your account number.')}>
      <Text
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium',
          color:'#949494',
        }}>
        {user ? user.email || 'N/A' : ''}
      </Text>
      </TouchableOpacity>

      
      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Password</Text>
      <TouchableOpacity onPress={() => Alert.alert(
        'Warning',
        'Are you sure to change the password?',
        [
          {text: 'Confirm', style: 'cancel', onPress: () => {navigation.navigate('Reset Password')}},
          {text: 'Cancel', style: 'destructive', onPress: () => console.log('Cancel Pressed')}
        ],
        { cancelable: false }
      )}>
      <Text
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          width:350,
          marginBottom:30,
          padding:10,
          paddingTop:15,
          alignItems:'center',
          color:'#544C4C'
        }}>
        ********
      </Text>
      </TouchableOpacity>
    </View>
    
      <TouchableOpacity style={{
          backgroundColor:'#FFBC11',
          borderRadius:6,
          alignSelf:'center',
          alignItems:'center',
          width:221,
          height:45,
          justifyContent:'center'
        }}
          onPress={handleUpdate}>
          <Text style={{
            fontFamily:'Inter-Medium',
            fontSize:20,
            color:'white'
          }}>Save Changes</Text>
        </TouchableOpacity>  
  </ScrollView>
  </KeyboardAwareScrollView>
    

    
  )
}

export default ProfileEditScreen