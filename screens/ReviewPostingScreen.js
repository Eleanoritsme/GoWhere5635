import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { firebase } from '../config';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CheckSquare from '../CheckSquareComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';

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
      username: user.userName
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
        marginTop: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        height: 60,
        width: 280,
        alignItems: 'center',
        marginLeft: 30,
        position: 'absolute',
        top: 270,
        shadowColor: '#D8D8D8',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
      }}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}
                style={{
                  marginRight: 10,
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
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
    <ScrollView>

      <View
        style={{
          flex: 1
        }}
        onLayout={onLayoutRootView}
      >
        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 20,
          lineHeight: 30,
          marginBottom: 15,
          marginTop: 15,
          width: 330,
          alignSelf: 'center',
        }}>Share your experience of this place!</Text>
        <TextInput
          placeholder='Descriptions'
          style={{
            alignSelf: 'center',
            height: 159,
            width: 340,
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingBottom: 120,
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            letterSpacing: 0.5,
            lineHeight: 30,
            marginBottom: 15,
          }}
          onChangeText={(text) => setDescription(text)}
        >
        </TextInput>

        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 20,
          letterSpacing: 0.5,
          lineHeight: 30,
          marginBottom: 95,
          width: 330,
          alignSelf: 'center',
        }}>Overall</Text>
        <CustomRatingBar />

        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 20,
          letterSpacing: 0.5,
          lineHeight: 30,
          marginBottom: 15,
          width: 330,
          alignSelf: 'center',
        }}>Would you like to save it for the next visit?</Text>
        <View style={{
          flexDirection: 'row',
          left: 30,
          marginBottom: 15,
        }}>
          <CheckSquare
            onPress={() => {handleYesPress()}}
            isChecked={yes}
          />
          <Text style={{
            fontFamily: 'Inter-ExtraBold',
            fontSize: 18,
            letterSpacing: 1,
            marginRight: 60,
            alignSelf: 'center',
          }}>Yes</Text>
          <CheckSquare
            onPress={() => {handleNoPress()}}
            isChecked={no}
          />
          <Text style={{
            fontFamily: 'Inter-ExtraBold',
            fontSize: 18,
            letterSpacing: 1,
            alignSelf: 'center',
          }}>No</Text>
        </View>

        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 20,
          letterSpacing: 0.5,
          lineHeight: 30,
          marginBottom: 15,
          width: 330,
          alignSelf: 'center',
          marginTop: 10,
        }}>Upload Photos (Optional)</Text>


        <ScrollView
          horizontal={true}
          style={{
            width: 300,
            flexDirection: 'row',
            alignSelf: 'center',
            marginBottom: 20,
          }}
          showsHorizontalScrollIndicator={false}
        >

          <TouchableOpacity style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: 10,
          }}
            onPress={() => { pickImage(1); setPhotoSlot(1); }}>

            {photo1 ? (
              <Image
                style={{ width: 100, height: 100, borderRadius: 10 }}
                source={{ uri: photo1 }}
              />
            ) : (
              <Entypo name="plus" size={44} color="#C9C9C9" style={{ left: 28, top: 28 }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: 10,
          }}
            onPress={() => { pickImage(2); setPhotoSlot(2); }}>

            {photo2 ? (
              <Image
                style={{ width: 100, height: 100, borderRadius: 10 }}
                source={{ uri: photo2 }}
              />
            ) : (
              <Entypo name="plus" size={44} color="#C9C9C9" style={{ left: 28, top: 28 }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: 10,
          }}
            onPress={() => { pickImage(3); setPhotoSlot(3); }}>

            {photo3 ? (
              <Image
                style={{ width: 100, height: 100, borderRadius: 10 }}
                source={{ uri: photo3 }}
              />
            ) : (
              <Entypo name="plus" size={44} color="#C9C9C9" style={{ left: 28, top: 28 }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            backgroundColor: '#FCFCFC',
            marginRight: 10,
          }}
            onPress={() => { pickImage(4); setPhotoSlot(4); }}>

            {photo4 ? (
              <Image
                style={{ width: 100, height: 100, borderRadius: 10 }}
                source={{ uri: photo4 }}
              />
            ) : (
              <Entypo name="plus" size={44} color="#C9C9C9" style={{ left: 28, top: 28 }} />
            )}
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity style={{
          backgroundColor: '#FFCE84',
          width: 256,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          alignSelf: 'center',
        }}
          onPress={() => { handleReviewPress()}}>
          <Text style={{
            fontFamily: 'Inder-Regular',
            fontSize: 20,
            color: '#4F200D'
          }}>Submit My Review</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

export default ReviewPostingScreen;
