import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar, Button } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../config'

const Separator = () => <View style={{
  top: 180,
  borderBottomColor: 'rgba(60,60,67,0.36)',
  borderBottomWidth:0.5,
  width:400,
  }} />;

const BackgroudSettingScreen = () => {
  const navigation = useNavigation();
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
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

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted'); 
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
    getUser();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality:1,
    });

    
    if (!result.canceled) {
      setImage(result.assets);
    }
  };

  if (hasGalleryPermission === false){
    return <Text>No access to internal storage.</Text>
  }

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality:1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (hasCameraPermission === false){
    return <Text>No access to the camera.</Text>
  }
  // const actionItems = [
  //   {
  //     id: 1,
  //     label: 'Take Photo',
  //     onPress: () => {
  //     }
  //   },
  //   {
  //     id: 2,
  //     label: 'Choose from Album',
  //     onPress: () => pickImage()
  //   },
  //   {
  //     id: 3,
  //     label: 'Save Photo',
  //     onPress: () => {
  //     }
  //   },
  // ];
  // const [actionSheet, setActionSheet] = useState(false);
  // const closeActionSheet = () => setActionSheet(false);


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
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{
        justifyContent:'center', 
        alignSelf:'center'
      }}
      onLayout={onLayoutRootView}>
      <Image style={{
          top:50,
          height: 250,
          width: 400
        }}
        source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/WholeBackground.png'}}  />
        
        <View style={{
          position:'absolute',
          top:350,
          alignSelf:'center'
        }}>
        <TouchableOpacity 
        style={{
          alignItems:'center',
          justifyContent:'center',
          top:180
        }}
        onPress={() => takePhoto()}
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
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </TouchableOpacity>
        
        <Separator />
        
        <TouchableOpacity 
        style={{
          alignItems:'center',
          justifyContent:'center',
          top:180
        }}
        onPress={() => pickImage()}>
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
        onPress={() => {}}>
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
    </>
  );
};

export default BackgroudSettingScreen;