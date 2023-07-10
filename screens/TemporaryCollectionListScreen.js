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

const TemporaryCollectionListScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf')
  });

  const [collections, setCollections] = useState([]);

  useEffect (() => {
    const userId= firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId)
    .collection('Star List')
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
      <View style={styles.title}>
        <Text style={styles.titleText}>
          TCL
        </Text>
      </View> 
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text style={styles.resetPswButton}>
            back //后期转化为一个小尖头
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        {collections.map((business) => (
          <View style={styles.businessContainer}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.businessAddress}>{business.address}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Review")}>
              <Text style = {{
                textDecorationLine:'underline',
                fontFamily:'Inter-Regular',
                fontSize:12,
                textAlign:'center',
                marginBottom:30,
              }}> Reviews </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

export default TemporaryCollectionListScreen

const styles = StyleSheet.create({
  title:{
    marginLeft:20,
    marginTop:20,
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    fontSize: 35,
  },
  subTitle:{
    marginTop:20,
    marginLeft:20,
    marginBottom:10,
  },
  subtitleText:{
    fontFamily:'Inter-Bold',
    fontSize:20
  },
  buttonContainer:{
    justifyContent:'space-around',
    flexDirection:'row',
    marginBottom:15,
    marginLeft:15,
    marginRight:15,
  },
  buttonContainer1:{
    justifyContent:'space-around',
    flexDirection:'row',
    marginTop:15,
    marginBottom:15,
    marginLeft:15,
    marginRight:15,
  },
  buttonInput:{
    borderColor:'#4F200D',
    borderWidth:2.5,
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:50,
    shadowColor: '#B3B3B3', 
    shadowOffset: { height: 2, width: 2 }, 
    shadowOpacity: 1, 
    shadowRadius: 1, 
    backgroundColor:'#FDDBB1',
  },
  inputContainer1:{
    flexDirection:'row',
    justifyContent:'center',
    width:260,
  },
  inputContainer2:{
    flexDirection:'row',
    justifyContent:'center',
    width:65,
  },
  inputContainer3:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:5,
    height:20,
  },
  inputText1:{
    fontFamily:'Inter-Bold',
    fontSize:25,
    color:'#7A3E3E',
  },
  inputText2:{
    fontFamily:'Inter-Bold',
    fontSize:15,
    color:'#7A3E3E',
    width:80,
    justifyContent:'center'
  },
  resetPswButton:{
    color:"#B04759", 
    fontWeight:'600', 
    fontSize:14,
  },


  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
  titleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  backButtonContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  resetPswButton: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  businessContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  businessCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 2,
  },
  businessName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 5,
  },
  businessAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#808080',
  },
  reviewLink: {
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});

