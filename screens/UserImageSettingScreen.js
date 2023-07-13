import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import { firebase } from '../config';
import * as SplashScreen from 'expo-splash-screen'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';



const Separator = () => <View style={{
  top: 180,
  borderBottomColor: 'rgba(60,60,67,0.36)',
  borderBottomWidth:0.5,
  width:400,
  }} />;

const UserImageSettingScreen = () => {
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [navigation])
  )

  const [user, setUser] = useState();
  const {uid} = firebase.auth().currentUser;

  const getUser = async () => {
    try {
      const documentSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      const userData = documentSnapshot.data();
      setUser(userData);
      setImage(userData?.image || null);
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

  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [8,3],
      quality: 1,
    });

    if (!result.canceled){
      setImage(result.assets[0].uri);
      handleUpdate(result.assets[0].uri);
    }
    
  };

  if (hasGalleryPermission === false){
    return <Text>No access to internal gallery.</Text>
  }

  const [hasCameraPermission, setHasCameraPermission] = useState(null)

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, [])

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [8, 3],
      quality: 1,
    });

    if (!result.canceled){
      setImage(result.assets[0].uri);
      handleUpdate(result.assets[0].uri);
    }
    
  };

  if (hasCameraPermission === false) {
    return <Text>No access to the camera.</Text>
  }

  const handleSavePhoto = async () => {
    try {
      const asset = await MediaLibrary.createAssetAsync(image);
      if (asset) {
        Alert.alert('Saved Successfully', 'Photo is saved to your album.')
        console.log('Photo saved successfully!');
      } else {
        Alert.alert('Failed to save', 'Photo failed to save to the album, please try again')
        console.log('Failed to save the photo.');
      }
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const handleUpdate = async(imageURI) => {
    firebase.firestore().collection('users').doc(uid).update({
      image: imageURI
    })
    .then(() => {
      console.log('User data updated!');
    })
  }

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
    <SafeAreaView
    onLayout={onLayoutRootView}
    style={{
      flex:1,
    }}>
    {image && <Image source={{uri: image}} style={{flex:1/2, top:80,}} />}
    <View style={{
          position:'absolute',
          top:370,
          alignSelf:'center'
        }}>
    <TouchableOpacity 
        style={{
          alignItems:'center',
          justifyContent:'center',
          top:180
        }}
        onPress={() => {takePhoto()}}
        >
          <Text style={{
            lineHeight:25,
            letterSpacing:0.38,
            fontSize:20,
            fontFamily:'Inter-Regular',
            color:'#007AFF',
            paddingVertical:20,
          }}>
          Take Photo
          </Text>
        </TouchableOpacity>
        
        <Separator />

    <TouchableOpacity 
        style={{
          alignItems:'center',
          justifyContent:'center',
          top:180
        }}
        onPress={() => {pickImage()}}>
          <Text style={{
            lineHeight:25,
            letterSpacing:0.38,
            fontSize:20,
            fontFamily:'Inter-Regular',
            color:'#007AFF',
            paddingVertical:20,
          }}>
          Choose from Album
          </Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity style={{
          alignItems:'center',
          justifyContent:'center',
          top:180,
        }}
        onPress={handleSavePhoto}>
          <Text style={{
            lineHeight:25,
            letterSpacing:0.38,
            fontSize:20,
            fontFamily:'Inter-Regular',
            color:'#007AFF',
            paddingVertical:20,
          }}>
          Save Photo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default UserImageSettingScreen;