import { Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { firebase } from '../config'
import ImageGrid from 'react-native-image-grid';
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Line from '../Line'
import { useFocusEffect } from '@react-navigation/native'

SplashScreen.preventAutoHideAsync();

const UserProfileScreen = () => {
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      getUser();
      getCounts();
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

  const [placeNum, setPlaceNum] = useState(0);
  const [collectionNum, setCollectionNum] = useState(0);
  const [reviewNum, setReviewNum] = useState(0);

  const [collectionPhotos, setCollectionPhotos] = useState([]);
  const [reviewPhotos, setReviewPhotos] = useState([]);

  const getCounts = async () => {
    try {
      const placesSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Place List').get();
      setPlaceNum(placesSnapshot.size);

      const collectionsSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Collection List').get();
      setCollectionNum(collectionsSnapshot.size);

      const reviewsSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Review List').get();
      setReviewNum(reviewsSnapshot.size);

      const collectionPhotos = collectionsSnapshot.docs.map(doc => doc.data().image_url);
      setCollectionPhotos(collectionPhotos);
      if (!collectionPhotos.length) {
        setCollectionPhotos(null);
      }

      const reviewPhotos = [];
    reviewsSnapshot.docs.forEach((doc) => {
      const reviewData = doc.data();
      if (reviewData.photo1) {
        reviewPhotos.push(reviewData.photo1);
      }
      if (reviewData.photo2) {
        reviewPhotos.push(reviewData.photo2);
      }
      if (reviewData.photo3) {
        reviewPhotos.push(reviewData.photo3);
      }
      if (reviewData.photo4) {
        reviewPhotos.push(reviewData.photo4);
      }
    });
    setReviewPhotos(reviewPhotos.length > 0 ? reviewPhotos : null);


    } catch {
      console.log("get counts error");
    }
  };

  useEffect(() => {
    getCounts();
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
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingBottom:1100}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    <View style={{
    position:'absolute',
    transform: [{ translateX: 0}, { translateY: -480 }],
    }}>
    <TouchableOpacity
      onPress={() => {navigation.navigate('Background')}}>
      <Image
      style={{
        height: 350,
        width: 400,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
      }}
      source={{uri: user ? user.background || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png'}} />
    </TouchableOpacity>
    </View>

    <View style={{
      position:'absolute',
      top:160,
      alignItems:'center',
      justifyContent:'center',
      zIndex:1,
    }}>
      <Image 
        style={{
          height: 135,
          width: 135,
          borderRadius: 75,
          marginBottom:20,
        }}
        source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}} />
        <Text style={{
          fontFamily:'Inter-SemiBold',
          fontSize:24,
          color:'#4F200D',
          marginBottom:20,
        }}>
        {user ? user.userName || 'User' : 'User'}
          </Text>
          <Text style={{
            fontFamily:'Inter-Medium',
            alignItems:'center',
            fontSize:13,
            color:'#544C4C',
            marginBottom:10,
          }}>
          {user ? user.occupation || 'no occupation' : 'no occupation'}
          </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
            marginBottom:20,
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
          {user ? user.city || 'city' : 'city'}, {user ? user.country || 'country' : 'country'}
          </Text>
        </View>

        <Text style={{
          width:300,
          textAlign:'center',
          fontFamily:'Inter-Medium',
          alignItems:'center',
          fontSize:13,
          color:'#544C4C',
          marginBottom:10,
        }}>
        {user ? user.bio || 'no bio added' : 'no bio added'}
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
              {placeNum}
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
              {collectionNum}
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
              {reviewNum}
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
        showsHorizontalScrollIndicator={false}
        >
        <TouchableOpacity  style={{flexDirection:'row'}} onPress={() => navigation.navigate('PCL')}>
        {collectionPhotos? collectionPhotos.map((image_url, index) => (
      <View key={index} style={{marginLeft:20, height:180}}>
        <Image
          style={{
            position:'absolute',
            width:160,
            height:160,
            borderRadius:20,
            backgroundColor:'#E2E2E2',
            shadowColor: '#000000', 
            shadowOffset: { height: 4, width: 0 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 4,
          }}
          source={{ uri: image_url}}
        />
      </View>
    )) :
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
  }
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
        showsHorizontalScrollIndicator={false}
        >
        <TouchableOpacity  style={{flexDirection:'row'}} onPress={() => navigation.navigate('My Reviews')}>
        {reviewPhotos? reviewPhotos.map((image_url, index) => (
      <View key={index} style={{marginLeft:20, height:180}}>
        <Image
          style={{
            position:'absolute',
            width:160,
            height:160,
            borderRadius:20,
            backgroundColor:'#E2E2E2',
            shadowColor: '#000000', 
            shadowOffset: { height: 4, width: 0 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 4,
          }}
          source={{ uri: image_url}}
        />
      </View>
    )) :
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
  }
  </TouchableOpacity>
        </ScrollView>
        
        </View>
        
    </ScrollView>
    
  )
}

export default UserProfileScreen
