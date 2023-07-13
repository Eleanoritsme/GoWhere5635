import { StyleSheet, Text, View, Alert, Image} from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const PlaceListDetail = ({route}) => {
  const { business } = route.params;
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
  });
  
  let address = '';
  if (business.address) {
    address += business.address;
  } else {
    if (business.location.address1) {
      address += business.location.address1;
    }
    if (business.location.address2) {
      address += ` ${business.location.address2}`;
    }
    if (business.location.address3) {
      address += ` ${business.location.address3}`;
    }
  }
  
  const priceMapping = {
    "$": '$0-10',
    "$$": '$10-30',
    "$$$": '$30-50',
    "$$$$": '$50++',
  };
  
  const filterPrice = priceMapping[business.price];

  const [results, setResults] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const userId= firebase.auth().currentUser.uid;
    const unsubscribe = db.collection('users').doc(userId)
    .collection('Star List').onSnapshot((snapshot) => {
      const businessData = snapshot.docs.map((doc) => doc.data());
      setResults(businessData);
    });

    return () => unsubscribe();
  }, []);
  console.log('Result' + JSON.stringify(results))

  const [checkFilled, setCheckedFilled] = useState(false)

  useEffect(() => {
    const sameBusiness = results.some((item) => item.phone === business.phone);
    setCheckedFilled(sameBusiness)
  }, [results, business]);
  console.log('check:' + checkFilled)
  if (business.phone === ''){
    business.phone = 'contact not available'
  }



  const saveToCollection = () => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
  
    // Query the collection list to find a matching document
    db.collection('users').doc(userId).collection('Collection List')
      .where('name', '==', business.name)
      .where('phone', '==', business.phone)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // No matching document found, save the item to the collection list
          db.collection('users').doc(userId).collection('Collection List')
            .add({
              name: business.name,
              address: address,
              phone: business.phone,
              price: business.price,
              image_url: business.image_url,
              uid: userId,
            })
            .then(() => {
              console.log('Place has been chosen and saved to the collection list!');
            })
            .catch((error) => {
              console.error('Error saving place to the collection list:', error);
            });
            Alert.alert(
              'Saved Successfully', 
              'The place now can be found on the collection list!',
              [
                {text: 'OK', style: 'cancel', onPress: () => {}},
                {text: 'Go to Collection List', onPress: () => {navigation.navigate('PCL')}},
              ]
              )
        } else {
          // A matching document already exists
          Alert.alert(
            'Oh no!',
            'Place is already saved in the collection list!',
            [
              {text: 'OK', style: 'cancel', onPress: () => {}},
              {text: 'Go to Collection List', onPress: () => {navigation.navigate('PCL')}},
            ]
          )
          console.log('Place is already saved in the collection list.');
        }
      })
      .catch((error) => {
        console.error('Error querying the collection list:', error);
      });
  };

  const checkReviewed = () => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
  
    db.collection('users').doc(userId).collection('Review List')
      .where('business', '==', business.name)
      .where('phone', '==', business.phone)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          navigation.navigate('Review Posting', { business: business });
        } else {
          Alert.alert(
            'Oh no!',
            'You have already posted a review for this place.',
            [
              { text: 'OK', style: 'cancel', onPress: () => {} },
              { text: 'Go to My Reviews', onPress: () => { navigation.navigate('My Reviews') } },
            ]
          );
          console.log('You have already posted a review for this place.');
        }
      })
      .catch((error) => {
        console.error('Error querying the review list:', error);
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
    <SafeAreaView onLayout={onLayoutRootView}>
    <View style={{
      marginBottom:90,
      flexDirection:'row',
      left:20,
      }}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:20,
        width:150,
        top:10,
        marginLeft:10,
      }}>{business.name}</Text>

      <Image style={{
        position:'absolute',
        width:163,
        height:111,
        borderRadius:10,
        left:190,
        bottom:-50  
      }} source={{uri: business ? business.image_url || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'
       : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'}}/>
      </View>

      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
          height:30,
          width:30,
        }}
        source={require('../assets/images/misc/LocationGreen.png')} />
        <Text style={{fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
          width:300}}>
          {address}
        </Text>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
          height:30,
          width:30,
        }}
        source={require('../assets/images/misc/PhoneGreen.png')} />
        <Text style={{fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center'}}>
          {business.phone}
        </Text>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
          height:30,
          width:30,
        }}
        source={require('../assets/images/misc/PriceGreen.png')} />
        <Text style={{
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          {filterPrice}
        </Text>
      </View>
      <View style={{
        marginBottom:50,
      }}>
      <TouchableOpacity 
      onPress={() => {navigation.navigate('Review', {business: business})}}
      style={{
        left:20,
        flexDirection:'row',
        marginBottom:10,
      }}>
        <Image style={{
          marginRight:10,
          height:30,
          width:30,
        }}
        source={require('../assets/images/misc/RatingGreen.png')} />
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          See Reviews
        </Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity 
      style={{
        top:30,
        width:365,
        height:60,
        backgroundColor:'#264223',
        alignSelf:'center',
        borderRadius:14,
        justifyContent:'center',
        marginBottom:20,
      }}
      onPress={() => {saveToCollection(); }}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:17,
        lineHeight:22,
        color:'#FFFFFF'
      }}>Save to Collection List</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top:30,
        width:365,
        height:60,
        backgroundColor:'#264223',
        alignSelf:'center',
        borderRadius:14,
        justifyContent:'center',
      }}
      onPress={() => {checkReviewed()}}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        color:'#FFFFFF',
        fontSize:17,
        lineHeight:22,
      }}>Write a review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default PlaceListDetail