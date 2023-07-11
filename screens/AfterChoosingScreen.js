import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const AfterChoosingScreen = ({route}) => {
  const { business} = route.params;
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

  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
  });


  const [description, setDescription] = useState(null)
  const [rating, setRating] = useState(null)
  const [saveForNext, setSaveForNext] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [userName, setUserName] = useState(null)
  
  const handleReviewPress = () => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId).get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const userName =  JSON.stringify(userData.userName)
        setUserName(userName)
      }
    }).then(() => {
    
    db.collection('users').doc(userId).collection(' Review List')
    .add({
      business: business.name,
      description: description,
      rating: rating,
      savefornextvisit: saveForNext,
      photo: photo,
      uid: userId,
      username: userName
    })
    .then(() => {
      console.log('Restaurant saved to Firebase!');
    })
    .catch((error) => {
      console.error('Error saving restaurant to Firebase:', error);
    });
})
.catch((error) => {
  console.error('Error retrieving user data:', error);
});
};
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        top:200,
      }}
      onLayout={onLayoutRootView}>
      <Image
          source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}}
          style={{
            left:130,
            marginLeft:20,
            width:90,
            height:90,
            borderRadius:400 / 2,
            marginBottom:50,
          }}
      />
      <Text style={{
        fontFamily:'Inter-ExtraBold',
        fontSize: 32,
        textAlign:'center',
        letterSpacing:1,
        lineHeight:50,
        marginBottom:80,
      }}>Enjoy Your Time! :)</Text>
      <TouchableOpacity onPress={() => {handleReviewPress();navigation.navigate('Review Posting')}}>
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize:20,
          letterSpacing:-0.41,
          textAlign:'center',
          marginBottom:30,
        }}>Write a review</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize:20,
          letterSpacing:-0.41,
          textAlign:'center',
          marginBottom:30,
        }}>Go to user profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}>
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize:20,
          letterSpacing:-0.41,
          textAlign:'center',
          marginBottom:30,
        }}>Choose an activity again</Text>
      </TouchableOpacity>

      
    </SafeAreaView>
  )
}

export default AfterChoosingScreen