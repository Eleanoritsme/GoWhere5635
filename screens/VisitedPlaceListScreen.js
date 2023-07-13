import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { firebase } from '../config'
import MasonryList from "@react-native-seoul/masonry-list"
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'


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
        source={{ uri: item.image_url }}></Image>
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.collectionAddress}>{item.address}</Text>

      {/* <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={() => {handleReviewPress(item); navigation.navigate("Review Posting")}}>
          <Image
            style={styles.reviewImage}
            source={require('../assets/images/misc/Review.png')}>
          </Image>

      </TouchableOpacity> */}
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

    <ScrollView style={{flex:1, paddingHorizontal: 10, paddingTop: 10}} onLayout={onLayoutRootView}>
    { visited ? (
      <MasonryList
        style={{alignSelf:"stretch"}}
        contentContainerStyle={{paddingHorizontal:1, alignSelf:"stretch"}}
        data={visited}
        renderItem={renderVisited}
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
      }}>You have not been to any places yet.</Text>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize:14,
        marginTop:10,
      }}>Go to find some good recommendations and have a try!</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}
        style={{
          marginTop:10,
          borderRadius:15,
          width:80,
          height:30,
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
    </ScrollView>
  )
}

export default VisitedPlaceListScreen
  const styles = StyleSheet.create({
    flatListContainer: {
      justifyContent: 'space-between',
    },
    collectionCard: {
      marginBottom:10,
      marginHorizontal:5,
      flex:0.5,
      backgroundColor: '#FFFCE1',
      borderRadius:15,
      // borderTopLeftRadius:55,
      // borderTopRightRadius:55,
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
      marginBottom:10,
      lineHeight:20,
    },
    reviewImage: {
      marginTop:10,
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

