import { Text, TouchableOpacity, View, Image, TextInput, Alert, ScrollView, StatusBar } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
    <StatusBar barStyle={'dark-content'} />
    <View style={{
    position:'absolute',
    transform: [{ translateX: 0}, { translateY: -480 }],
    }}>
    <TouchableOpacity
      onPress={() => {navigation.navigate('Background')}}>
      <Image
      style={{
        height: hp('41.46%'),
        width: wp('100%'),
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
      }}
      source={{uri: user ? user.background || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png'}} />
    </TouchableOpacity>
    </View>

    <View style={{
      position:'absolute',
      top: hp('18.96%'),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    }}>
        <TouchableOpacity
      onPress={() => {navigation.navigate('Edit Profile')}}>
      <Image 
        style={{
          height: wp('34.62%'),
          width: wp('34.62%'),
          borderRadius: 75,
          marginBottom: hp('2.37%'),
        }}
        source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}} />
        </TouchableOpacity>
        <Text style={{
          fontFamily:'Inter-SemiBold',
          fontSize: wp('6.15%'),
          color:'#4F200D',
          marginBottom: hp('2.37%'),
        }}>
        {user ? user.userName || 'User' : 'User'}
          </Text>
          <Text style={{
            fontFamily:'Inter-Medium',
            alignItems:'center',
            fontSize: wp('3.33%'),
            color:'#544C4C',
            marginBottom: hp('1.18%'),
          }}>
          {user ? user.occupation || 'no occupation' : 'no occupation'}
          </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: hp('0.71%'),
            alignItems: "center",
            marginBottom: hp('2.37%'),
          }}
        >
          <MaterialIcons name="location-pin" size={wp('6.15%')} color="#544C4C" />
          <Text
            style={{
              fontFamily:'Inter-Medium',
              fontSize: wp('3.33%'),
              color:'#544C4C'
            }}
          >
          {user ? user.city || 'city' : 'city'}, {user ? user.country || 'country' : 'country'}
          </Text>
        </View>

        <Text style={{
          width: wp('76,92%'),
          textAlign: 'center',
          fontFamily: 'Inter-Medium',
          alignItems: 'center',
          fontSize: wp('3.33%'),
          color: '#544C4C',
          marginBottom: hp('1.18%'),
        }}>
        {user ? user.bio || 'no bio added' : 'no bio added'}
        </Text>

        
        <View
          style={{
            paddingVertical: hp('0.95%'),
            flexDirection: "row",
            justifyContent:'space-around',
          }}
        >

        <TouchableOpacity onPress={() => navigation.navigate('Visited')}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding: hp('1.18%'),
              marginRight: wp('6.41%'),
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: wp('6.15%'),
                color: '#4F200D',
                lineHeight: hp('3.55%'),
                marginBottom: hp('0.59%'),
              }}
            >
              {placeNum}
            </Text>
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize: wp('3.59%'),
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
              padding: hp('1.18%'),
              marginRight: wp('6.41%'),
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: wp('6.15%'),
                color: '#4F200D',
                lineHeight: hp('3.55%'),
                marginBottom: hp('0.59%'),
              }}
            >
              {collectionNum}
            </Text>
            
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize: wp('3.59%'),
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
              padding: hp('1.18%'),
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: wp('6.15%'),
                color: '#4F200D',
                lineHeight: hp('3.55%'),
                marginBottom: hp('0.59%'),
              }}
            >
              {reviewNum}
            </Text>
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize: wp('3.59%'),
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
          width: wp('92.31%'),
          fontFamily:'Inter-SemiBold',
          fontSize: wp('5.13%'),
          color: '#4F200D',
          marginBottom: hp('2.37%'),
        }}>
          Collections
        </Text>
        
        
        <ScrollView 
        style={{
          flex:1,
          marginLeft: wp('7.69%'),
          width: wp('100%'),
          marginBottom: hp('2.37%'),
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        >
        <TouchableOpacity  style={{flexDirection:'row'}} onPress={() => navigation.navigate('PCL')}>
        {collectionPhotos ? collectionPhotos.map((image_url, index) => (
      <View key={index} style={{marginLeft: wp('5.13%'), height: hp('21.33%'), width: wp('2.56%')}}>
      <View style={{
            shadowColor: '#000000', 
            shadowOffset: { height: 4, width: -4 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 4,
      }}>
        <Image
          style={{
            position:'absolute',
            width: wp('41.03%'),
            height: wp('41.03%'),
            borderRadius:20,
            backgroundColor:'#E2E2E2',
          }}
          source={{ uri: image_url}}
        />
        </View>
      </View>
    )) :
    <TouchableOpacity onPress={() => navigation.navigate('PCL')}>
        <View style={{ marginLeft: wp('10.26%'), height: hp('21.33%') }}>
        <View 
            style={{
              width: wp('41.03%'),
              height: wp('41.03%'),
              borderRadius:20,
              top:0,
              right: wp('5.64%'),
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: -4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
          <View 
            style={{
              width: wp('41.03%'),
              height: wp('41.03%'),
              borderRadius:20,
              position:'absolute',
              top: hp('0.59%'),
              right: wp('3.85%'),
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: -4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4, 
            }}
          />
          <View  
            style={{
              width: wp('41.03%'),
              height: wp('41.03%'),
              borderRadius:20,
              position:'absolute',
              top: hp('1.18%'),
              right: wp('2.05%'),
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: -4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
        </View>
        </TouchableOpacity>
  }
  </TouchableOpacity>
        </ScrollView>

        <Text style={{
         width: wp('92.31%'),
          fontFamily:'Inter-SemiBold',
          fontSize: wp('5.13%'),
          color: '#4F200D',
          marginBottom: hp('2.37%'),
        }}>
          Reviews
        </Text>
        
        <ScrollView 
        style={{
          flex:1,
          marginLeft: wp('7.69%'),
          width: wp('100%'),
          marginBottom: hp('2.37%'),
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        >
        <TouchableOpacity  style={{flexDirection:'row'}} onPress={() => navigation.navigate('My Reviews')}>
        {reviewPhotos? reviewPhotos.map((image_url, index) => (
      <View key={index} style={{marginLeft: wp('5.13%'), height: hp('21.33%'), width: wp('2.56%')}}>
      <View style={{
            shadowColor: '#000000', 
            shadowOffset: { height: 4, width: -4 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 4,
      }}>
        <Image
          style={{
            position:'absolute',
            width: wp('41.03%'),
            height: wp('41.03%'),
            borderRadius: 20,
            backgroundColor: '#E2E2E2',
          }}
          source={{ uri: image_url}}
        />
        </View>
      </View>
    )) :
    <TouchableOpacity onPress={() => navigation.navigate('My Reviews')}>
      <View style={{ marginLeft: wp('10.26%'), height: hp('21.33%') }}>
        <View 
            style={{
              width: wp('41.03%'),
              height: wp('41.03%'),
              borderRadius: 20,
              top:0,
              right: wp('5.64%'),
              backgroundColor: '#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: -4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
            }}
          />
          <View 
            style={{
              width: wp('41.03%'),
              height: wp('41.03%'),
              borderRadius:20,
              position:'absolute',
              top: hp('0.59%'),
              right: wp('3.85%'),
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: -4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4, 
            }}
          />
          <View  
            style={{
              width: wp('41.03%'),
              height: wp('41.03%'),
              borderRadius:20,
              position:'absolute',
              top: hp('1.18%'),
              right: wp('2.05%'),
              backgroundColor:'#E2E2E2',
              shadowColor: '#000000', 
              shadowOffset: { height: 4, width: -4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 4,
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
