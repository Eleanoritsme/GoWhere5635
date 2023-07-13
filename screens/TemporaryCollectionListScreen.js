import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import MasonryList from "@react-native-seoul/masonry-list"
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { render } from 'react-dom'

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
      //setStarItem((prevItems) => [...prevItems, starredBusiness]);
      //setStarItem((prevItems) =>
        //prevItems.map((item) =>
          //item.phone === starredBusiness.phone ? { ...item, checkFilled: true } : item
        //)
      //;
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
        <View>
        {starItem && starItem.map((starredBusiness, index) => {
        return(
        <View key={index} style={styles.businessContainer}>
        <TouchableOpacity 
          styles={styles.businessCard}  
          onPress={() => navigation.navigate("Details", {business: starredBusiness})}>
          <TouchableOpacity 
          onPress={() => {
            handleUnstarredBusiness(starredBusiness)}}>
          {starredBusiness.checkFilled ? (
          <Image 
          style={{marginLeft: 340, marginTop: 20}} source={require('../assets/images/misc/StarFilled.png')}>
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
          style={{marginLeft: 340, marginTop: 20}} source={require('../assets/images/misc/StarFilled.png')}>
          </Image> ) : (
          <Image 
          style={{marginLeft: 340, marginTop: 20}} source={require('../assets/images/misc/StarCorner.png')}>
          </Image>
          )}
          </TouchableOpacity>
          )}
          </TouchableOpacity>
          <Text style={styles.businessName}>{starredBusiness.name}</Text>
          <Text style={styles.businessAddress}>{starredBusiness.address}</Text>
          <Image style={{
            position:'absolute',
            width:130,
            height:90,
            borderRadius:10,
            left:250,
            marginTop:65}} source = {{uri: starredBusiness.image_url}}></Image>
          <TouchableOpacity style={{top:10}} onPress={() => navigation.navigate("Review")}>
          <Text style = {{
            textDecorationLine:'underline',
            fontFamily:'Inter-Regular',
            fontSize:13,
            color: "#001F8E",
            textAlign:'left',
            marginLeft:12,
            paddingVertical:0
          }}> Reviews </Text>
          </TouchableOpacity>
          </TouchableOpacity>
          </View>
        )})}
        </View>
      </ScrollView>
  )
}

export default TemporaryCollectionListScreen

const styles = StyleSheet.create({
  title:{
    marginLeft:20,
    marginTop:5,
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    fontSize: 35,
  },
  resetPswButton: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  businessContainer: {
    backgroundColor: '#CEEDCE',
    marginBottom: 5,
    height:180,
  },
  businessCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    elevation: 2,
    padding: 10,
  },
  businessName: {
    marginLeft: 15,
    fontFamily: 'Inter-Bold',
    width:280,
    fontSize:20,
    marginBottom:20,
    marginTop:-30
  },
  businessAddress: {
    marginLeft: 15,
    width:170,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'black',
    marginBottom:30
  },
});