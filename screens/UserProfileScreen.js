import { Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { firebase } from '../config'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Line from '../Line'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo';

SplashScreen.preventAutoHideAsync();

const UserProfileScreen = () => {
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [navigation])
  )

  const [user, setUser] = useState();
  const {uid} = firebase.auth().currentUser;

  const getUser = async() => {
    try {
      const documentSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      const userData = documentSnapshot.data();
      setUser(userData);
    } catch {
      console.log("get data")
    }
  };

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
    <ScrollView
      style={{flex:1}}
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingBottom:850}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    
    <TouchableOpacity
      onPress={() => {navigation.navigate('Background')}}>
      <Image
        style={{
          width:400,
          height:200
        }}
        source={{uri: user ? user.background || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Background.png' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Background.png'}} />
    </TouchableOpacity>
    <View style={{
      position:'absolute',
      top:145,
      alignItems:'center',
      justifyContent:'center',
    }}>
      <Image 
        style={{
          height: 135,
          width: 135,
          borderRadius: 75,
          marginBottom:10,
        }}
        source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}} />
        <Text style={{
          fontFamily:'Inter-SemiBold',
          fontSize:24,
          color:'#4F200D',
          marginBottom:10,
        }}>
        {user ? user.userName || 'User' : 'User'}
          </Text>
          <Text style={{
            fontFamily:'Inter-Medium',
            alignItems:'center',
            fontSize:13,
            color:'#544C4C',
            marginBottom:5,
          }}>
          {user ? user.occupation || 'no occupation' : ''}
          </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
            marginBottom:10,
          }}
        >
          <MaterialIcons name="location-pin" size={24} color="#544C4C" />
          <Text
            style={{
              fontFamily:'Inter-Medium',
              fontSize:13,
              color:'#544C4C'
            }}
          >
          {user ? user.city || 'city' : ''}, {user ? user.country || 'country' : ''}
          </Text>
        </View>

        <Text style={{
          fontFamily:'Inter-Medium',
          alignItems:'center',
          fontSize:13,
          color:'#544C4C',
          marginBottom:10,
        }}>
        {user ? user.bio || 'no bio added' : ''}
        </Text>

        
        <View
          style={{
            paddingVertical: 8,
            flexDirection: "row",
            justifyContent:'space-around',
          }}
        >

        <TouchableOpacity onPress={() => navigation.navigate('Visited')}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding:10,
              marginRight:25,
            }}
          >
            <Text
              style={{
                fontFamily:'Inter-SemiBold',
                fontSize:24,
                color:'#4F200D',
                lineHeight:30,
                marginBottom:5,
              }}
            >
              0
            </Text>
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize:14,
                color:'#544C4C'
              }}
            >
              Places
            </Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PCL')}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding:10,
              marginRight:25,
            }}
          >
            <Text
              style={{
                fontFamily:'Inter-SemiBold',
                fontSize:24,
                color:'#4F200D',
                lineHeight:30,
                marginBottom:5,
              }}
            >
              0
            </Text>
            
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize:14,
                color:'#544C4C'
              }}
            >
              Collections
            </Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('My Reviews')}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding:10,
            }}
          >
            <Text
              style={{
                fontFamily:'Inter-SemiBold',
                fontSize:24,
                color:'#4F200D',
                lineHeight:30,
                marginBottom:5,
              }}
            >
              0
            </Text>
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize:14,
                color:'#544C4C'
              }}
            >
              Reviews
            </Text>
          </View>
          </TouchableOpacity>
        </View>
        
        <Line/>

        <Text style={{
          width:360,
          fontFamily:'Inter-SemiBold',
          fontSize:20,
          color:'#4F200D',
          marginBottom:20,
        }}>
          Collections
        </Text>
        
        
        <ScrollView 
        style={{
          marginLeft:30,
          width:400,
          marginBottom:20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.navigate('PCL')}>
        <View style={{marginLeft:30, height:180}}>
          <View 
            style={{
              width:160,
              height:160,
              borderRadius:20,
              top:0,
              right:8,
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: 0 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
          <View 
            style={{
              width:160,
              height:160,
              borderRadius:20,
              position:'absolute',
              top:5,
              right:15,
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: 0 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
          <View  
            style={{
              width:160,
              height:160,
              borderRadius:20,
              position:'absolute',
              top:10,
              right:22,
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: 0 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4
            }}
          />
        </View>
        </TouchableOpacity>
        </ScrollView>

        <Text style={{
          width:360,
          fontFamily:'Inter-SemiBold',
          fontSize:20,
          color:'#4F200D',
          marginBottom:20,
        }}>
          Reviews
        </Text>
        
        <ScrollView 
        style={{
          marginLeft:30,
          width:400,
          marginBottom:20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.navigate('My Reviews')}>
        <View style={{marginLeft:30, height:180}}>
        <View 
            style={{
              width:160,
              height:160,
              borderRadius:20,
              top:0,
              right:8,
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: 0 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
          <View 
            style={{
              width:160,
              height:160,
              borderRadius:20,
              position:'absolute',
              top:5,
              right:15,
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: 0 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
          <View  
            style={{
              width:160,
              height:160,
              borderRadius:20,
              position:'absolute',
              top:10,
              right:22,
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: 0 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4
            }}
          />
        </View>
        </TouchableOpacity>
        </ScrollView>
        
        </View>
        
    </ScrollView>
    
  )
}

export default UserProfileScreen

