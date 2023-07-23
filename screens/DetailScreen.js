import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { ScrollView } from 'react-native-gesture-handler'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const DetailScreen = ({route}) => {
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

  console.log('here', business.location)
  /*const [image, setImage] = useState(null)
  if (business.image_url) {
    setImage(business.image_url)
  } else {business.image} {
    setImage(business.image)
  }
  */
  
  const priceMapping = {
    "$": '$0-10',
    "$$": '$10-30',
    "$$$": '$30-50',
    "$$$$": '$50++',
  };
  
  const filterPrice = priceMapping[business.price];

  const handleStarIconPress = () => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Star List')
    .add({
      name: business.name,
      address: address,
      phone: business.phone,
      price: business.price,
      image_url: business.image_url,
      uid:userId
    })
    .then(() => {
      console.log('Restaurant saved to Firebase!');
    })
    .catch((error) => {
      console.error('Error saving restaurant to Firebase:', error);
    });
  };

  const handleUnstarredRestaurant = () => {
    const db = firebase.firestore();
    const userId= firebase.auth().currentUser.uid;
    // Query the saved restaurants collection and find the specific restaurant to remove
    db.collection('users').doc(userId)
      .collection('Star List')
      .where('name', '==', business.name)
      .where('phone', '==', business.phone)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Delete the document from the collection
          doc.ref.delete()
            .then(() => {
              console.log('Restaurant removed from Firebase!');
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
  if (business.image_url === '') {
    business.image_url = 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'
  }

  const chooseThis = () => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId).collection('Place List')
    .add({
      name: business.name,
      address: address,
      phone: business.phone,
      price: business.price,
      image_url: business.image_url,
      uid: userId
    })
    .then(() => {
      console.log('Place has been chosen and saved to place list!');
    })
    .catch((error) => {
      console.error('Error saving place to place list:', error);
    });
  };

  const saveToCollection = () => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
  
    db.collection('users').doc(userId).collection('Collection List')
      .where('name', '==', business.name)
      .where('phone', '==', business.phone)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
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
  

  const removeAll = () => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId).collection("Star List")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Delete the document from the collection
        doc.ref.delete()
          .then(() => {
            console.log('Star list cleared!');
          })
          .catch((error) => {
            console.error('Error clearing Star List:', error);
          });
      });
    })
    .catch((error) => {
      console.error('Error querying saved places in star list:', error);
    });
  }


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}} onLayout={onLayoutRootView}>
    <StatusBar barStyle={'dark-content'} />

    <View style={{
      marginBottom: hp('10.66%'),
      }}>
      <View style={{
        flexDirection: 'row', 
        left: wp('5.13%'),
      }}>
      {checkFilled ? (
        <TouchableOpacity
        style={{
          alignSelf: 'center',
          marginRight: wp('2.56%'),
          width: wp('7.69%'),
          top: hp('1.18%'),
          height: hp('3.55%'),
        }}
        onPress={() => {
          setCheckedFilled(false)
          handleUnstarredRestaurant();
        }}>
        <Image 
        source={require('../assets/images/misc/StarFilled.png')}/>
      </TouchableOpacity>
      ) : (
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          marginRight: wp('2.56%'),
          width: wp('7.69%'),
          top: hp('1.18%'),
          height: hp('3.55%'),
        }}
        onPress={() => {
          setCheckedFilled(true);
          handleStarIconPress();
        }}>
        <Image 
        source={require('../assets/images/misc/StarCorner.png')}/> 
      </TouchableOpacity>
      )}
      <Text style={{
        alignSelf: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: wp('5.13%'),
        width: wp('38.46%'),
        top: hp('1.18%'),
      }}>{business.name}</Text>

      <Image style={{
        position: 'absolute',
        width: wp('41.79%'),
        height: hp('13.15%'),
        borderRadius: 10,
        left: wp('48.72%'),
        bottom: hp('-5.92%')
      }} source={{uri: business ? business.image_url || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'
       : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png'}}/>
      </View>
      </View>

      <View style={{
        left: wp('5.13%'),
        flexDirection:'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
        }}
        source={require('../assets/images/misc/Location.png')} />
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
        flexDirection: 'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
        }}
        source={require('../assets/images/misc/Phone.png')} />
        <Text style={{fontFamily:'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf: 'center'
        }}>
          {business.phone}
        </Text>
      </View>
      <View style={{
        left: wp('5.13%'),
        flexDirection: 'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
        }}
        source={require('../assets/images/misc/Price.png')} />
        <Text style={{
          fontFamily:'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf:'center',
        }}>
          {filterPrice}
        </Text>
      </View>
      <TouchableOpacity 
      onPress={() => {navigation.navigate('Review', {business: business})}}
      style={{
        left: wp('5.13%'),
        flexDirection: 'row',
        marginBottom: hp('7.11%'),
      }}>
        <Image style={{
          marginRight: wp('2.56%'),
        }}
        source={require('../assets/images/misc/Rating.png')} />
        <Text style={{
          textDecorationLine: 'underline',
          fontFamily: 'Inter-Regular',
          fontSize: wp('3.85%'),
          alignSelf: 'center',
        }}>
          See Reviews
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top: hp('3.55%'),
        width: wp('93.59%'),
        height: hp('7.11%'),
        backgroundColor: '#92BDFF',
        alignSelf: 'center',
        borderRadius: 14,
        justifyContent: 'center',
        marginBottom: hp('2.37%'),
      }}
      onPress={() => {saveToCollection()}}>
      <Text style={{
        alignSelf: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: wp('4.36%'),
      }}>Save to Collection List</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top: hp('3.55%'),
        width: wp('93.59%'),
        height: hp('7.11%'),
        backgroundColor: '#92BDFF',
        alignSelf: 'center',
        borderRadius: 14,
        justifyContent: 'center',
      }}
      onPress={() => {chooseThis(); removeAll(); navigation.navigate('After Choosing', {business: business})}}>
      <Text style={{
        alignSelf: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: wp('4.36%'),
      }}>Choose this!</Text>
      </TouchableOpacity>
      </SafeAreaView>
  )
}

export default DetailScreen