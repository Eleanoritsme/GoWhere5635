import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { firebase } from '../config'
import MasonryList from "@react-native-seoul/masonry-list"
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

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
    <View style={{flex:1, paddingHorizontal: 10, paddingTop: 10}} onLayout={onLayoutRootView}>
    {collections ? (
      <MasonryList
        style={{alignSelf:"stretch"}}
        contentContainerStyle={{paddingHorizontal:1, alignSelf:"stretch"}}
        data={collections}
        renderItem={renderCollections}
        showsVerticalScrollIndicator={false}
        numColumns={2}>
      </MasonryList>
      ) : (
      <View style={{
      height:'100%',
      alignItems:'center',
      justifyContent:'center'
    }}> 
      <Text style={{
        textAlign:'center',
        fontFamily:'Inter-Regular',
        color:'#949494',
        marginTop:20,
        fontSize:14,
      }}>You have not collected any places yet.</Text>
      <View style={{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
      }}>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize:14,
      }}>Go to save some good place!</Text>
      </View>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}
        style={{
          marginTop:10,
          borderRadius:20,
          width:100,
          height:40,
          alignItems:'center',
          justifyContent:'center',
          borderWidth:1,
          borderColor:'#949494',
        }}>
        <Text>
        Have a try
        </Text>
      </TouchableOpacity>
    </View>)}
  </View>
  )
}

export default PermanentCollectionListScreen

const styles = StyleSheet.create({
  flatListContainer: {
    justifyContent: 'space-between',
  },
  collectionCard: {
    marginBottom:10,
    marginHorizontal:5,
    flex:0.5,
    backgroundColor: '#FFF5E9',
    borderTopLeftRadius:55,
    borderTopRightRadius:55,
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  collectionName: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    marginBottom:5,
  },
  collectionAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'black',
    lineHeight:20,
  },
  heartImage: {
    //position:'absolute',
    marginBottom:2,
    marginRight:3,
    width: 25, 
    height:25
  },
  businessImage: {
    width:165,
    height:110,
    borderRadius:15,
    // borderRadius:50,
    marginTop:-14,
    marginLeft:-5,
    alignContent:'center',
    marginBottom:5
  }
});

  /*const styles = StyleSheet.create({
    // ...
  
    collectionCard: {
      marginBottom: 10,
      marginHorizontal: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      elevation: 2,
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    heartContainer: {
      backgroundColor: 'transparent',
      padding: 10,
    },
    heartImage: {
      width: 25,
      height: 25,
    },
    businessImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    collectionDetailsContainer: {
      flex: 1,
    },
    collectionName: {
      fontFamily: 'Inter-Bold',
      fontSize: 15,
      marginBottom: 5,
    },
    collectionAddress: {
      fontFamily: 'Inter-Regular',
      fontSize: 10,
      color: '#808080',
    },
  });
  */