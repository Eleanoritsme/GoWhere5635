import { StyleSheet, Text, View, Image, Alert, TextInput, TouchableOpacity, ScrollView, StatusBar  } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CheckSquare from '../CheckSquareComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const ReviewPostingScreen = ({ route }) => {
  const { business } = route.params;
  const [user, setUser] = useState();
  const { uid } = firebase.auth().currentUser;
  const getUser = async () => {
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

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const pickImage = async (slot) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [8, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleUpdatePhoto(slot, result.assets[0].uri);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>No access to the gallery.</Text>
  }

  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const [description, setDescription] = useState(null);
  const [saveForNext, setSaveForNext] = useState(false);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [photo4, setPhoto4] = useState(null);
  const [userName, setUserName] = useState(null);
  const [photoSlot, setPhotoSlot] = useState(null); // New state for photo slot

  const handleReviewPress = async () => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
  
    const reviewData = {
      business: business.name,
      phone: business.phone,
      description: description,
      rating: defaultRating,
      savefornextvisit: saveForNext,
      uid: userId,
      username: user.userName,
      userImage: user.image,
    };
  
    // Add photos to reviewData only if they are available
    if (photo1) reviewData.photo1 = photo1;
    if (photo2) reviewData.photo2 = photo2;
    if (photo3) reviewData.photo3 = photo3;
    if (photo4) reviewData.photo4 = photo4;
  
    // Add reviewData to Review List subcollection
    await db.collection('users').doc(userId).collection('Review List').add(reviewData);
    console.log('Review of the place saved to Review List!');
  
    // Add reviewData to Whole Review List collection
    await db.collection('Review List').add(reviewData);
    console.log('Review of the place saved to Whole Review List!');
  
    navigation.navigate('Feedback');
  };
  
  

  const navigation = useNavigation();
  const [yes, setYes] = useState(false);
  const [no, setNo] = useState(false);

  const handleYesPress = () => {
    setYes(true);
    setNo(false);
    setSaveForNext(true);
  };
  
  const handleNoPress = () => {
    setYes(false);
    setNo(true);
    setSaveForNext(false);
  };

  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const starFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starOutline = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  const CustomRatingBar = () => {
    return (
      <View style={{
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        height: hp('7.11%'),
        width: wp('71.79%'),
        alignItems: 'center',
        marginLeft: wp('7.69%'),
        shadowColor: '#D8D8D8',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
        marginBottom: hp('1.78%'),
      }}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}
                style={{
                  marginRight: wp('2.56%'),
                }}
              >
                <Image
                  style={{
                    width: wp('10.26%'),
                    height: wp('10.26%'),
                    resizeMode: 'cover'
                  }}
                  source={
                    item <= defaultRating ? { uri: starFilled } : { uri: starOutline }
                  }
                />
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  const handleUpdatePhoto = async (slot, uri) => {
    setPhotoSlot(slot); // Set the selected photo slot
    switch (slot) {
      case 1:
        setPhoto1(uri);
        break;
      case 2:
        setPhoto2(uri);
        break;
      case 3:
        setPhoto3(uri);
        break;
      case 4:
        setPhoto4(uri);
        break;
      default:
        break;
    }
  };

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
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
    <ScrollView showsVerticalScrollIndicator={false}>
    <StatusBar barStyle={'dark-content'} />
    <SafeAreaView style={{flex: 1, bottom: hp('2.37%')}} onLayout={onLayoutRootView}>
        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: wp('5.13%'),
          lineHeight: hp('3.55%'),
          marginBottom: hp('1.78%'),
          width: wp('84.62%'),
          alignSelf: 'center',
        }}>Share your experience of this place!</Text>
        <TextInput
          placeholder='Descriptions'
          style={{
            alignSelf: 'center',
            height: hp('18.84%'),
            width: wp('87.18%'),
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            paddingHorizontal: wp('3.85%'),
            paddingBottom: hp('14.22%'),
            fontSize: wp('4.1%'),
            fontFamily: 'Inter-Regular',
            letterSpacing: 0.5,
            lineHeight: hp('3.55%'),
            marginBottom: hp('1.78%'),
          }}
          onChangeText={(text) => setDescription(text)}
        >
        </TextInput>

        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: wp('5.13%'),
          letterSpacing: 0.5,
          lineHeight: hp('3.55%'),
          width: wp('84.62%'),
          marginBottom: hp('1.78%'),
          alignSelf: 'center',
        }}>Overall</Text>
        <CustomRatingBar />

        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: wp('5.13%'),
          letterSpacing: 0.5,
          lineHeight: hp('3.55%'),
          marginBottom: hp('1.78%'),
          width: wp('84.62%'),
          alignSelf: 'center',
        }}>Would you like to save it for the next visit?</Text>
        <View style={{
          flexDirection: 'row',
          left: wp('7.69%'),
          marginBottom: hp('1.78%'),
        }}>
          <CheckSquare
            onPress={() => {handleYesPress()}}
            isChecked={yes}
          />
          <Text style={{
            fontFamily: 'Inter-ExtraBold',
            fontSize: wp('4.62%'),
            letterSpacing: 1,
            marginRight: wp('15.38%'),
            alignSelf: 'center',
          }}>Yes</Text>
          <CheckSquare
            onPress={() => {handleNoPress()}}
            isChecked={no}
          />
          <Text style={{
            fontFamily: 'Inter-ExtraBold',
            fontSize: wp('4.62%'),
            letterSpacing: 1,
            alignSelf: 'center',
          }}>No</Text>
        </View>

        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: wp('5.13%'),
          letterSpacing: 0.5,
          lineHeight: hp('3.55%'),
          marginBottom: hp('1.78%'),
          width: wp('84.62%'),
          alignSelf: 'center',
          marginTop: hp('1.18%'),
        }}>Upload Photos (Optional)</Text>


        <ScrollView
          horizontal={true}
          style={{
            width: wp('82.05%'),
            flexDirection: 'row',
            alignSelf: 'center',
            marginBottom: hp('2.37%'),
          }}
          showsHorizontalScrollIndicator={false}
        >

          <TouchableOpacity style={{
            width: wp('25.64%'),
            height: wp('25.64%'),
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: wp('2.56%'),
          }}
            onPress={() => { pickImage(1); setPhotoSlot(1); }}>

            {photo1 ? (
              <Image
                style={{ width:  wp('25.64%'), height:  wp('25.64%'), borderRadius: 10 }}
                source={{ uri: photo1 }}
              />
            ) : (
              <Entypo name="plus" size={wp('11.28%')} color="#C9C9C9" style={{ left: wp('7.18%'), top: wp('7.18%') }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: wp('25.64%'),
            height: wp('25.64%'),
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: wp('2.56%'),
          }}
            onPress={() => { pickImage(2); setPhotoSlot(2); }}>

            {photo2 ? (
              <Image
                style={{ width:  wp('25.64%'), height:  wp('25.64%'), borderRadius: 10 }}
                source={{ uri: photo2 }}
              />
            ) : (
              <Entypo name="plus" size={wp('11.28%')} color="#C9C9C9" style={{ left: wp('7.18%'), top: wp('7.18%') }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: wp('25.64%'),
            height: wp('25.64%'),
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: wp('2.56%'),
          }}
            onPress={() => { pickImage(3); setPhotoSlot(3); }}>

            {photo3 ? (
              <Image
                style={{ width:  wp('25.64%'), height:  wp('25.64%'), borderRadius: 10 }}
                source={{ uri: photo3 }}
              />
            ) : (
              <Entypo name="plus" size={wp('11.28%')} color="#C9C9C9" style={{ left: wp('7.18%'), top: wp('7.18%') }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={{
             width: wp('25.64%'),
            height: wp('25.64%'),
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: wp('2.56%'),
          }}
            onPress={() => { pickImage(4); setPhotoSlot(4); }}>

            {photo4 ? (
              <Image
                style={{ width:  wp('25.64%'), height:  wp('25.64%'), borderRadius: 10 }}
                source={{ uri: photo4 }}
              />
            ) : (
              <Entypo name="plus" size={wp('11.28%')} color="#C9C9C9" style={{ left: wp('7.18%'), top: wp('7.18%') }} />
            )}
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity style={{
          backgroundColor: '#FFCE84',
          width: wp('65.64%'),
          height: hp('5.69%'),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          alignSelf: 'center',
        }}
          onPress={() => { handleReviewPress()}}>
          <Text style={{
            fontFamily: 'Inder-Regular',
            fontSize: wp('5.13%'),
            color: '#4F200D'
          }}>Submit My Review</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  )
}

export default ReviewPostingScreen;
