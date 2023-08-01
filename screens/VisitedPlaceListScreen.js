import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'
import MasonryList from "@react-native-seoul/masonry-list"
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const VisitedPlaceListScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf'),
  });

  const [visited, setVisited] = useState(null);

  //Retrieve data from firestore
  useEffect(() => {
    const db = firebase.firestore();
    const userId= firebase.auth().currentUser.uid;
    const unsubscribe = db.collection('users').doc(userId)
    .collection('Place List').onSnapshot((snapshot) => {
      const businessData = snapshot.docs.map((doc) => doc.data());
      if (businessData.length !== 0) {
        if (businessData.image_url === '') {
          businessData.image_url === 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png';
        }
        setVisited(businessData);
      }
    });
    return () => unsubscribe();
  }, []);
  console.log('Visited' + JSON.stringify(visited))

  
  const renderVisited = ({ item }) => (
    <TouchableOpacity style={styles.collectionCard} onPress={() => navigation.navigate("Place List Details", { business: item })}>
      <Image style={styles.businessImage}
        source={{ uri: item.image_url || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png' }}></Image>
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.collectionAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex:1, paddingHorizontal: wp('2.56%'), paddingTop: hp('1.18%')}} onLayout={onLayoutRootView}>
    <StatusBar barStyle={'dark-content'} />
    { visited ? (
      <MasonryList
        style={{alignSelf:"stretch"}}
        contentContainerStyle={{paddingHorizontal: wp('0.36%'), alignSelf: "stretch"}}
        data={visited}
        renderItem={renderVisited}
        showsVerticalScrollIndicator={false}
        numColumns={2}>
      </MasonryList>
      ) : (
    <View style={{
      height: hp('80%'),
      alignItems:'center',
      justifyContent:'center'
    }}>
      <Text style={{
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
        color: '#949494',
        marginTop: hp('2.37%'),
        fontSize: wp('3.59%'),
      }}>You have not been to any places yet.</Text>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize: wp('3.59%'),
        marginTop: hp('1.18%'),
      }}>Go to find some good recommendations and have a try!</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}
        style={{
          marginTop: hp('1.18%'),
          borderRadius: 20,
          width: wp('25.64%'),
          height: hp('4.74%'),
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#949494',
        }}>
        <Text>
        Have a try
        </Text>
      </TouchableOpacity>
    </View>)}
    </View>
  )
}

export default VisitedPlaceListScreen
  const styles = StyleSheet.create({
    flatListContainer: {
      justifyContent: 'space-between',
    },
    collectionCard: {
      marginBottom: hp('0.5%'),
      marginHorizontal: wp('0.5%'),
      flex: 0.5,
      backgroundColor: '#FFFDE9',
      borderRadius:15,
      elevation: 2,
      paddingHorizontal: wp('2.56%'),
      paddingVertical: hp('1.78%'),
    },
    collectionName: {
      fontFamily: 'Inter-Bold',
      fontSize: wp('3.85%'),
      marginBottom: hp('1%'),
    },
    collectionAddress: {
      fontFamily: 'Inter-Regular',
      fontSize: wp('2.82%'),
      color: 'black',
      marginBottom: hp('1.18%'),
      lineHeight: hp('2.37%'),
    },
    businessImage: {
      alignSelf:'center',
      width: wp('45%'),
      height: hp('14%'),
      borderRadius:15,
      marginTop: hp('-1.5%'),
      marginBottom: hp('1%')
    }
  });
