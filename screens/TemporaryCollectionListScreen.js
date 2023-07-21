import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const TemporaryCollectionListScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
  });

  const [starItem, setStarItem] = useState([]);

  useEffect (() => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Star List')
    .get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const business = doc.data();
          return { ...business, checkFilled: true };
        // Access the document data
        //console.log('Document:', data);  
      //console.log('starItem:' + JSON.stringify(starItem))
    })
    setStarItem(data);
    })
    .catch((error) => {
      console.error('Error fetching documents from Firestore:', error);
    });
  }, [])


  const handleUnstarredBusiness = (starredBusiness) => {
    const db = firebase.firestore();
    const userId= firebase.auth().currentUser.uid;
    // Query the saved restaurants collection and find the specific restaurant to remove
    db.collection('users').doc(userId)
      .collection('Star List')
      .where('name', '==', starredBusiness.name)
      .where('address', '==', starredBusiness.address)
      .where('phone', '==', starredBusiness.phone)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Delete the document from the collection
          doc.ref.delete()
            .then(() => {
              console.log('Restaurant removed from Firebase!');
              setStarItem((prevBusinesses) =>
              prevBusinesses.map((business) => {
                if (business.phone === starredBusiness.phone) {
                  return {...business, checkFilled: !business.checkFilled}
                }
                return business;//setUnstar(true)
              })
              )
            })
            .catch((error) => {
              console.error('Error removing restaurant from Firebase:', error);
            });
        });
      })
      .catch((error) => {
        console.error('Error querying saved restaurants:', error);
      });
  };

  const addBackStar = (starredBusiness) => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Star List')
    .add({
      name: starredBusiness.name,
      address: starredBusiness.address,
      phone: starredBusiness.phone,
      price: starredBusiness.price,
      image_url: starredBusiness.image_url,
      uid:userId
    })
    .then(() => {
      console.log('Restaurant saved to Firebase!');
    }) 
    .catch((error) => {
      console.error('Error saving restaurant to Firebase:', error);
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
      <ScrollView onLayout={onLayoutRootView}>      
      <StatusBar barStyle={'dark-content'} />
        <View>
        {starItem && starItem.map((starredBusiness, index) => {
        return(
        <View key={index} style={styles.businessContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Details", {business: starredBusiness})}>
          <Image style={{
            position:'absolute',
            width: wp('33.33%'),
            height: hp('10.66%'),
            borderRadius: 10,
            top: hp('6%'),
            left: wp('60%'),
          }} source = {{uri: starredBusiness.image_url}}></Image>
        <View style={{flexDirection:'row'}}>
        <Text style={styles.businessName}>{starredBusiness.name}</Text>
          <TouchableOpacity 
          onPress={() => {
            handleUnstarredBusiness(starredBusiness)}}>
          {starredBusiness.checkFilled ? (
          <Image 
          style={{ marginLeft: wp('9%'), marginTop: hp('0.65%') }} source={require('../assets/images/misc/StarFilled.png')}>
          </Image> ) : (
          <TouchableOpacity onPress={() => 
          {setStarItem((prevItems) =>
                prevItems.map((business) =>
                  business.phone === starredBusiness.phone ? { ...business, checkFilled: true } : business
                )
              );
            addBackStar(starredBusiness)}}>
          {starredBusiness.checkFilled ? (
          <Image 
          style={{marginLeft: wp('9%'), marginTop: hp('0.65%') }} source={require('../assets/images/misc/StarFilled.png')}>
          </Image> ) : (
          <Image 
          style={{ marginLeft: wp('9%'), marginTop: hp('0.65%') }} source={require('../assets/images/misc/StarCorner.png')}>
          </Image>
          )}
          </TouchableOpacity>
          )}
          </TouchableOpacity>
          </View>
          <Text style={styles.businessAddress}>{starredBusiness.address}</Text>
          {/* <TouchableOpacity style={{marginLeft: wp('3%')}} onPress={() => navigation.navigate("Review", {business: starredBusiness})}>
          <Text style = {{
            textDecorationLine:'underline',
            fontFamily:'Inter-Regular',
            fontSize: wp('3.33%'),
            color: "#001F8E",
          }}>Reviews</Text>
          </TouchableOpacity> */}
          </TouchableOpacity>
          </View>
        )})}
        </View>
      </ScrollView>
  )
}

export default TemporaryCollectionListScreen

const styles = StyleSheet.create({
  businessContainer: {
    backgroundColor: '#CEEDCE',
    marginBottom: hp('0.59%'),
    height: hp('21.33%'),
    borderRadius: 10,
    width: wp('97%'),
    alignSelf:'center',
    padding: wp('2.56%'),
  },
  businessName: {
    marginLeft: wp('3%'),
    fontFamily: 'Inter-Bold',
    width: wp('71.79%'),
    fontSize: wp('5.13%'),
    marginBottom: hp('2.37%'),
    marginTop: hp('0.65%')
  },
  businessAddress: {
    marginLeft: wp('3%'),
    width: wp('43.59%'),
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.59%'),
    color: 'black',
    marginBottom: hp('1.3%')
  },
});