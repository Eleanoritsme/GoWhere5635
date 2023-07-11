import { StyleSheet, Text, View, Alert, Image} from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'



const DetailScreen = ({route}) => {
  const { business} = route.params;
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
      .where('address', '==', address)
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
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId).collection('Collection List')
    .add({
      name: business.name,
      address: address,
      phone: business.phone,
      price: business.price,
      image_url: business.image_url,
      uid: userId
    })
    .then(() => {
      console.log('Place has been chosen and saved to collection list!');
    })
    .catch((error) => {
      console.error('Error saving place to collection list:', error);
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
      }}>
      marginBottom:90,
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
          top:10,
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
          top:10,
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
        width:150,
        top:10,
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
          {filterPrice}
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
        height:60,
        backgroundColor:'#92BDFF',
        alignSelf:'center',
        borderRadius:14,
        justifyContent:'center',
        marginBottom:20,
      }}
      onPress={() => {saveToCollection(); Alert.alert(
        'Saved Successfully', 
        'The place now can be found on the collection list!',
        [
          {text: 'OK', style: 'cancel', onPress: () => {}},
          {text: 'Go to Collection List', onPress: () => {navigation.navigate('PCL')}},
        ]
        )}}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:17,
        lineHeight:22,
      }}>Save to Collection List</Text>
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
        marginBottom:20,
      }}

      onPress={() => {saveToCollection(); Alert.alert(
        'Saved Successfully', 
        'The place now can be found on the collection list!',
        [
          {text: 'OK', style: 'cancel', onPress: () => {}},
          {text: 'Go to Collection List', onPress: () => {navigation.navigate('PCL')}},
        ]
        )}}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:17,
        lineHeight:22,
      }}>Save to Collection List</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top:30,
        width:365,
        height:60,
        backgroundColor:'#92BDFF',
        alignSelf:'center',
        borderRadius:14,
        justifyContent:'center',
      }}
      onPress={() => {chooseThis(); navigation.navigate('After Choosing',{business: business})}}>
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
