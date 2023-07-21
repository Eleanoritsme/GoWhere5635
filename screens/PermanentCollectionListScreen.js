import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'
import MasonryList from "@react-native-seoul/masonry-list"
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const PermanentCollectionListScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
  });

  const [collections, setCollections] = useState(null);

  useEffect (() => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Collection List')
    .get()
    .then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        const business = doc.data();
        return { ...business, checkFilled: true };
        //console.log('Document:', data);  
    })
    if (data.length !== 0) {
      setCollections(data);
    }
    console.log('Collections:' + JSON.stringify(collections))
  })
    .catch((error) => {
      console.error('Error fetching documents from Firestore:', error);
    });
  }, [])

  console.log(collections)


  const handleUncollectedBusiness= (item) => {
    const db = firebase.firestore();
    const userId= firebase.auth().currentUser.uid;
    // Query the saved restaurants collection and find the specific restaurant to remove
    db.collection('users').doc(userId)
      .collection('Collection List')
      .where('name', '==', item.name)
      .where('address', '==', item.address)
      .where('phone', '==', item.phone)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Delete the document from the collection
          doc.ref.delete()
            .then(() => {
              console.log('Restaurant removed from Firebase!');
              setCollections((prevBusinesses) =>
              prevBusinesses.map((business) => {
                if (business.phone === item.phone) {
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

  const addBackCollected = (item) => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Collection List')
    .add({
      name: item.name,
      address: item.address,
      phone: item.phone,
      price: item.price,
      image_url: item.image_url,
      uid:userId
    })
    .then(() => {
      console.log('Restaurant saved to Firebase!');
    }) 
    .catch((error) => {
      console.error('Error saving restaurant to Firebase:', error);
    });
  };
  

  const renderCollections = ({ item }) => (
    <TouchableOpacity style={styles.collectionCard} onPress={() => navigation.navigate("Details", { business: item })}>
      <Image style={styles.businessImage}
        source={{ uri: item.image_url || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/no-image.png' }}></Image>
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.collectionAddress}>{item.address}</Text>
      <TouchableOpacity style={{alignSelf:'flex-end'}}onPress={() => { handleUncollectedBusiness(item)}}>
        {item.checkFilled ? (
          <Image
            style={styles.heartImage}
            source={require('../assets/images/misc/HeartFilled.png')}></Image>) : (
          <TouchableOpacity onPress={() => {
            setCollections((prevItems) => prevItems.map((business) => business.phone === item.phone ? { ...business, checkFilled: true } : business
            )
            )
            addBackCollected(item)
          } }>
            {item.checkFilled ? (
              <Image
                style={styles.heartImage}
                source={require('../assets/images/misc/HeartFilled.png')}></Image>) : (
              <Image
                style={styles.heartImage}
                source={require('../assets/images/misc/HeartCorner.png')}></Image>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
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
    {collections ? (
      <MasonryList
        style={{alignSelf:"stretch"}}
        contentContainerStyle={{paddingHorizontal: wp('0.26%'), alignSelf: "stretch"}}
        data={collections}
        renderItem={renderCollections}
        showsVerticalScrollIndicator={false}
        numColumns={2}>
      </MasonryList>
      ) : (
      <View style={{
      height: hp('80%'),
      alignItems: 'center',
      justifyContent: 'center'
    }}> 
      <Text style={{
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
        color: '#949494',
        marginTop: hp('2.37%'),
        fontSize: wp('3.59%'),
      }}>You have not collected any places yet.</Text>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize: wp('3.59%'),
        marginTop: hp('1.18%'),
      }}>Go to save some good place!</Text>
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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  flatListContainer: {
    justifyContent: 'space-between',
  },
  collectionCard: {
    marginBottom: hp('0.5%'),
    marginHorizontal: wp('0.5%'),
    flex: 0.5,
    backgroundColor: '#FFF5E9',
    elevation: 2,
    paddingHorizontal: wp('2.56%'),
    paddingVertical: hp('1.78%'),
  },
  collectionName: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('3.85%'),
    marginBottom: hp('0.59%'),
  },
  collectionAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('2.82%'),
    color: 'black',
    lineHeight: hp('2.37%'),
  },
  heartImage: {
    marginBottom: hp('0.24%'),
    marginRight: wp('0.77%'),
    width: wp('6.41%'), 
    height: wp('6.41%'), 
  },
  businessImage: {
    width: wp('43.31%'),
    height: hp('13.03%'),
    borderRadius:15,
    marginTop: hp('-1%'),
    marginLeft: wp('-1%'),
    marginRight: wp('-1%'),
    marginBottom: hp('1%')
  }
});

export default PermanentCollectionListScreen
