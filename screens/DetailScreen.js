import { StyleSheet, Text, View, Image} from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

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
  if (business.location.address1) {
    address += business.location.address1;
  }
  if (business.location.address2) {
    address += ` ${business.location.address2}`;
  }
  if (business.location.address3) {
    address += ` ${business.location.address3}`;
  }

  const [starFilled, setStarFilled] = useState(false);
  const [starredBusinesses, setStarredBusinesses] = useState([]);

  /*const handleStarPress = (phoneNo) => {
    if (starredBusiness.includes(phoneNo)) {
      const businessList = starredBusiness.filter((number) => number !== phoneNo)
      setStarredBusiness(businessList);
    } else {
      setStarredBusiness([...starredBusiness,phoneNo]);
    }
  }
  */

  //const starred = starredBusinesses.some((businessItem) => businessItem.phone === business.phone);
  console.log(starFilled)
  const handleStarIconPress = () => {
    /*const isStarred = starredBusinesses.some(
      (businessItem) => businessItem.phone === business.phone
    );
  
    if (isStarred) {
      // Remove the business from the starredBusinesses state
      const updatedStarredBusinesses = starredBusinesses.filter(
        (businessItem) => businessItem.phone !== business.phone
      );
      setStarredBusinesses(updatedStarredBusinesses);
      setStarFilled(false);
    } else {
      // Add the business to the starredBusinesses state
      setStarredBusinesses([...starredBusinesses, business]);
      setStarFilled(true);
    }
    */

    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('collectionlist')
    .add({
      name: business.name,
      address: address,
      phone: business.phone,
      uid: userId
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
    // Query the saved restaurants collection and find the specific restaurant to remove
    db.collection('collectionlist')
      .where('name', '==', business.name)
      .where('address', '==', address)
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

  /*useEffect(() => {
    AsyncStorage.setItem('starredBusinesses', JSON.stringify(starredBusinesses))
      .then(() => {
        console.log('Starred businesses saved to AsyncStorage!');
      })
      .catch((error) => {
        console.error('Error saving starred businesses to AsyncStorage:', error);
      });
  }, [starredBusinesses]);
  console.log('business:' + starredBusinesses)
  console.log('filled' + starFilled)

  useEffect(() => {
    AsyncStorage.getItem('starredBusinesses')
      .then((value) => {
        if (value) {
          const parsedValue = JSON.parse(value);
          setStarredBusinesses(parsedValue);
          const isStarred = parsedValue.some(
            (businessItem) => businessItem.phone === business.phone
          );
          setStarFilled(isStarred);
        }
      })
      .catch((error) => {
        console.error('Error loading starred businesses from AsyncStorage:', error);
      });
  }, []);
  */
  
  const [results, setResults] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db.collection('collectionlist').onSnapshot((snapshot) => {
      const businessData = snapshot.docs.map((doc) => doc.data());
      setResults(businessData);
    });

    return () => unsubscribe();
  }, []);
  console.log('Result' + JSON.stringify(results))
  //console.log(results[0])

  const [checkFilled, setCheckedFilled] = useState(false)

  useEffect(() => {
    const sameBusiness = results.some((item) => item.phone === business.phone);
    setCheckedFilled(sameBusiness)
  }, [results, business]);
  console.log('check:' + checkFilled)

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView>
    <View style={{
      flexDirection:'row',
      marginBottom:20,
      }}>
      <View style={{
        flexDirection:'row', 
        left:20,
      }}>
      {checkFilled ? (
        <TouchableOpacity
        style={{
          alignSelf:'center',
          marginRight:10,
          width:30,
          marginTop:40,
          height:30,
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
          alignSelf:'center',
          marginRight:10,
          width:30,
          marginTop:40,
          height:30,
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
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:20,
        width:180
      }}>{business.name}</Text>
      </View>
      <View 
      style={{
        left:90,
        width:163,
        height:111,
        backgroundColor:'#E2E2E2',
        borderRadius:10,
      }}></View>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Location.png')} />
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
        }}
        source={require('../assets/images/misc/Phone.png')} />
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
        }}
        source={require('../assets/images/misc/Price.png')} />
        <Text style={{
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          {business.price}
        </Text>
      </View>
      <TouchableOpacity 
      onPress={() => {navigation.navigate('Review')}}
      style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Rating.png')} />
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          See Reviews
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top:30,
        width:365,
        height:50,
        backgroundColor:'#92BDFF',
        alignSelf:'center',
        borderRadius:14,
        justifyContent:'center',
      }}
      onPress={() => {navigation.navigate('After Choosing')}}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:17,
        lineHeight:22,
      }}>Choose this!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default DetailScreen

