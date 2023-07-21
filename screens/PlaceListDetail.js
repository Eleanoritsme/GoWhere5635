import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    <ScrollView onLayout={onLayoutRootView} style={{flex:1}} showsVerticalScrollIndicator={false}>
    <StatusBar barStyle={'dark-content'} />
    <SafeAreaView onLayout={onLayoutRootView}>
    <View style={{
      marginBottom: hp('10.66%'),
      flexDirection: 'row',
      left: wp('5.13%'),
      }}>
      <Text style={{
        alignSelf: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: wp('5.13%'),
        width: wp('38.46%'),
        top: hp('1.18%'),
        marginLeft: wp('2.56%'),
      }}>{business.name}</Text>

      <Image style={{
        position: 'absolute',
        width: wp('41.79%'),
        height: hp('13.15%'),
        borderRadius: 10,
        left: wp('48.72%'),
        bottom: hp('-6.92%')  
      }} source={{uri: business ? business.image_url || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'
       : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'}}/>
      </View>

      <View style={{
        left: wp('5.13%'),
        flexDirection: 'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
          height: wp('7.69%'),
          width: wp('7.69%'),
        }}
        source={require('../assets/images/misc/LocationGreen.png')} />
        <Text style={{fontFamily:'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf: 'center',
          width: wp('76.92%')
        }}>
          {address}
        </Text>
      </View>
      <View style={{
        left: wp('5.13%'),
        flexDirection:'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
          height: wp('7.69%'),
          width: wp('7.69%'),
        }}
        source={require('../assets/images/misc/PhoneGreen.png')} />
        <Text style={{fontFamily:'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf:'center'}}>
          {business.phone}
        </Text>
      </View>
      <View style={{
        left: wp('5.13%'),
        flexDirection:'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
          height: wp('7.69%'),
          width: wp('7.69%'),
        }}
        source={require('../assets/images/misc/PriceGreen.png')} />
        <Text style={{
          fontFamily: 'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf: 'center',
        }}>
          {filterPrice}
        </Text>
      </View>
      <View style={{
        marginBottom: hp('5.92%'),
      }}>
      <TouchableOpacity 
      onPress={() => {navigation.navigate('Review', {business: business})}}
      style={{
        left: wp('5.13%'),
        flexDirection: 'row',
        marginBottom: hp('1.18%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
          height: wp('7.69%'),
          width: wp('7.69%'),
        }}
        source={require('../assets/images/misc/RatingGreen.png')} />
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf:'center',
        }}>
          See Reviews
        </Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity 
      style={{
        top: hp('3.55%'),
        width: wp('93.59%'),
        height: hp('7.11%'),
        backgroundColor: '#264223',
        alignSelf: 'center',
        borderRadius: 14,
        justifyContent: 'center',
        marginBottom: hp('2.37%'),
      }}
      onPress={() => {saveToCollection(); }}>
      <Text style={{
        alignSelf: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: wp('4.36%'),
        lineHeight: 22,
        color: '#FFFFFF'
      }}>Save to Collection List</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top: hp('3.55%'),
        width: wp('93.59%'),
        height: hp('7.11%'),
        backgroundColor: '#264223',
        alignSelf: 'center',
        borderRadius: 14,
        justifyContent: 'center',
      }}
      onPress={() => {checkReviewed()}}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        color:'#FFFFFF',
        fontSize: wp('4.36%'),
        lineHeight:22,
      }}>Write a review</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
  )
}

export default PlaceListDetail