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

  //const [collections, setCollections] = useState([])
  const [collections, setCollections] = useState([]);
  
  useEffect (() => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Collection List')
    .get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        // Access the document data
        setCollections(data);
        //console.log('Document:', data);  
      console.log('Collections:' + JSON.stringify(collections))
    })
    .catch((error) => {
      console.error('Error fetching documents from Firestore:', error);
    });
  }, [])

  console.log(collections)

  const renderCollections = ({ item }) => (
    <TouchableOpacity style={styles.collectionCard} onPress={() => navigation.navigate("Details", {business: item})}>
      <Image></Image>
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.collectionAddress}>{item.address}</Text>
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
    /*<ScrollView
      style={{flex:1}}
      contentContainerStyle={{alignContent:'flex-start', paddingBottom:60}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    */
    
    <View style={{flex:1, paddingHorizontal: 10, paddingTop: 10}}>
    {collections ? (
      <MasonryList
        style={{alignSelf:"stretch"}}
        contentContainerStyle={{paddingHorizontal:1, alignSelf:"stretch"}}
        data={collections}
        renderItem={renderCollections}
        numColumns={2}
        
      />) : (
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
      }}>You have not collected any places yet</Text>
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
      }}>Go to  </Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Activity')}}>
      <Image
        source={require('../assets/images/misc/Star.png')} />
      </TouchableOpacity>
      <Text style={{
        color:'#949494',
        fontFamily:'Inter-Regular',
        fontSize:14,
      }}>  some good places!</Text>
      </View>
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
    //width: 200,
    flex:0.5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  collectionName: {
    //width:170,
    //height: 200,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    marginBottom:5,
  },
  collectionAddress: {
    //width:160,
    //height: 200,
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#808080',
  },
});