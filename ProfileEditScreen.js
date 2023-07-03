import { Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { firebase } from '../config';
import * as SplashScreen from 'expo-splash-screen'
import Entypo from 'react-native-vector-icons/Entypo'



const ProfileEditScreen = () => {
  const navigation = useNavigation()
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

  // if (!fontsLoaded) {
  //   return null;
  // }

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
        'Your profile hass been updated successfully.'
      );
    })
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
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
        source={require('../assets/images/users/Default_pfp.jpg')} />
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
      placeholder={user ? user.userName || 'N/A' : ''}
      placeholderTextColor={'#544C4C'}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Date Of Birth</Text>
      <TextInput
      placeholder={user ? user.dateOfBirth || 'N/A' : ''}
      placeholderTextColor={'#544C4C'}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Occupation</Text>
      <TextInput
      placeholder={user ? user.occupation || 'N/A' : ''}
      placeholderTextColor={'#544C4C'}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Country/Region</Text>
      <TextInput
      placeholder={user ? user.country || 'N/A' : ''}
      placeholderTextColor={'#544C4C'}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>City</Text>
      <TextInput
      placeholder={user ? user.city || 'N/A' : ''}
      placeholderTextColor={'#544C4C'}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Bio</Text>
      <TextInput
      placeholder={user ? user.bio || 'N/A' : ''}
      placeholderTextColor={'#544C4C'}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Email</Text>
      <TouchableOpacity>
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
      <TouchableOpacity onPress={() => {navigation.navigate('Reset Password')}}>
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
          onPress={() => {handleUpdate}}>
          <Text style={{
            fontFamily:'Inter-Medium',
            fontSize:20,
            color:'white'
          }}>Save Changes</Text>
        </TouchableOpacity>
      

        
  </ScrollView>
    

    
  )
}

export default ProfileEditScreen