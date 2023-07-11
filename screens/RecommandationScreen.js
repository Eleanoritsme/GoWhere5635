import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios'
import moment from 'moment';

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const RecommandationScreen = ({route}) => {

  const {selectedCategory, price, time, location} = route.params;
  console.log(price)
  //console.log(time)
  console.log(location)

  const navigation = useNavigation()
  const [selectedLocationIcon, setSelectedLocationIcon] = useState(null);
  const mapRef = useRef(null);
  const priceMapping = {
    "1": '$ ',
    "2": '$$ ',
    "3": '$$$ ',
    "4": '$$$$',
  };

  const filterPrice = price.map((buttonNo) => priceMapping[buttonNo]);

  const[recommendations, setRecommendations] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const[hours, minutes] = time.split(":");
        const timing = moment().hours(hours).minutes(minutes).unix();
        const geocodingResponse = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: location,
              components: 'country:SG',
              key: 'AIzaSyDerNS1YLni4oQ0ikqY_zLnDcoqYzEaBCk' // Google Maps API key
            }
          }
        );
        const { results } = geocodingResponse.data;
        const { lat, lng } = results[0].geometry.location;
        //console.log('Location' + location)
        console.log('lat' + lat)
        console.log('lng' + lng)
        const response = await axios.get(
          'https://api.yelp.com/v3/businesses/search'
          , { 
            params: {
              term: selectedCategory,
              latitude: lat,
              longitude: lng,
              radius:2000,
              price: price.join(","),
              open_at: timing,
              limit:50,
            },
              headers: {
              Authorization: `Bearer ${'l2WdiWyvXyQZCQcc2XAGz6gn6LcrkK8Peix0d4sjZxpFOGu4E3by9096JwD0Wtp3RkWQ9-6emuXm1cKaivxwxozQZ-iHo0xR_DOL4eAvTQ02pVNINNMqknxBUgJ_ZHYx'}`
            },
          }
        );
        const jsonData = await response.data;
        setRecommendations(jsonData);
        console.log(recommendations)
      } catch (error) {
        console.error('Error fetching Yelp data:', error);
      }
    };
    getData();
  },[selectedCategory, price, time, location])

  const [user, setUser] = useState();
  const {uid} = firebase.auth().currentUser;

  const getUser = async() => {
    try {
      const documentSnapshot = await firebase.firestore().collection('users').doc(uid).get();
      const userData = documentSnapshot.data();
      setUser(userData);
    } catch {
      console.log("get data")
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  
  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf')
  });
  
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
    <TouchableOpacity 
      onPress={() => {navigation.navigate('User Profile')}}
      style={{
        top:25,
        left:235,
      }}>
          <Image
            source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}}
            style={{
              marginLeft:40,
              width:90,
              height:90,
              borderRadius:400 / 2,
              bottom:5,
            }}
            />
      </TouchableOpacity>
    <View style={{
      position:'absolute',
      top:50,
    }}>
      <Text style={styles.titleText}>
        Recommendations
      </Text>
    </View>
      <View style={styles.title} >
      <View onLayout={onLayoutRootView}>
        <View style={styles.FilterOptionButton}>
          <Text style={styles.FilterOptionButtonText}>
            {time}
          </Text>
        </View>
        <View style={styles.FilterOptionButton} onLayout={onLayoutRootView}>
          <Text style={styles.FilterOptionButtonText}>
            {location}
          </Text>
        </View>
        <View style={styles.FilterOptionButton} onLayout={onLayoutRootView}>
          <Text style={styles.FilterOptionButtonText}>
            {filterPrice}
          </Text>
        </View>
      </View>
      </View>

      <View>
        <MapView 
          onLayout={onLayoutRootView}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map} 
          initialRegion={{ 
            latitude:selectedLocationIcon ? selectedLocationIcon.latitude: 1.3353906, 
            longitude: selectedLocationIcon ? selectedLocationIcon.longitude: 103.8497414, 
            latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
          {recommendations && recommendations.businesses && recommendations.businesses.map((item, index) => (
            <Marker key={index} coordinate={{ 
              latitude: selectedLocationIcon ? selectedLocationIcon.latitude : item.coordinates.latitude, 
              longitude: selectedLocationIcon ? selectedLocationIcon.longitude : item.coordinates.longitude}} />
            ))}
        </MapView>
        
        <View style = {styles.starListContainer}>
          <TouchableOpacity
              //style={styles.starListContainer}
              onPress={() => {
                navigation.navigate("TCL")
              }}
            >
            <Image
              source={require('../assets/images/misc/Starlist.png')}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        </View>
        
        <View style={{
           alignSelf:'center',
          position:'absolute',
          height:170,
          width: 360,
          top:495,
          borderRadius:10,
          backgroundColor:'transparent'
        }}>
        <View
        onLayout={onLayoutRootView}>
          <ScrollView>
          {recommendations && recommendations.businesses &&
              recommendations.businesses.map((item, index) => (
                <View key={index} style={styles.bottomSheetContent} onLayout={onLayoutRootView}>
                  <Text style={styles.inputText1} 
                  onPress={() => {setSelectedLocationIcon(item.coordinates);
                    if (mapRef.current) {
                      mapRef.current.animateToRegion({
                      latitude: item.coordinates.latitude,
                      longitude: item.coordinates.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                    });
                    }
                  }}
                  >
                  {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {navigation.navigate("Details", {business: item})}}>
                    <Image 
                    style={styles.image}
                    source={require('../assets/images/misc/Locationred.png')}
                    />    
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
};


export default RecommandationScreen

const styles = StyleSheet.create({
  title:{
    position:'absolute',
    top:80,
    flexDirection:'row',
    marginTop:20,
    marginLeft:25,
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    fontSize: 24,
    marginLeft: 50,
    marginTop: 10,
  },
  map: {
    top:55,
    height: 580,
    alignSelf:'center',
    width:370,
    marginHorizontal:10,
    marginTop:30,
    borderRadius:12
  },
  bottomSheetContent: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    backgroundColor: 'white',
    height:70,
    borderRadius:8,
    paddingHorizontal:30,
    marginTop:2,
  },
  FilterOptionButton: {
    width:150,
    height:25,
    alignItems: 'center',
    backgroundColor: '#B4DFFF',
    borderRadius: 20,
    marginBottom: 10,
    justifyContent:'center',
  },
  FilterOptionButtonText: {
    fontFamily: 'Inder-Regular',
    fontSize: 15,
    color: '#000000',
  },
  starListContainer: {
    position: 'absolute',
    bottom:455,
    right:12,
    padding: 10,
    borderRadius: 12,
    zIndex:1,
  },
  starIcon: {
    width: 60,
    height: 60,
  },
  inputText1:{
    width:280,
    fontFamily:'Inter-Bold',
    fontSize:18,
    color:'black',
    marginLeft:10,
  },
  image:{
    justifyContent:'center',
    marginLeft:20,
    height:35,
    width:35
  }
})