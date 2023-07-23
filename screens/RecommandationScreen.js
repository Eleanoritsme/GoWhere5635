import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, StatusBar  } from 'react-native'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios'
import moment from 'moment';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const RecommandationScreen = ({route}) => {

  const {selectedCategory, price, time, location} = route.params;
  console.log(price)
  //console.log(time)
  console.log(location)

  const navigation = useNavigation()
  const [selectedLocationIcon, setSelectedLocationIcon] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocation = async() => {
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
      setUserLocation({ lat, lng });
  };

  useEffect(() => {
    getUserLocation();
  }, []);

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
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf')
  });
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  if (!userLocation) {
    return null; 
  }

  return (
    <SafeAreaView style={{flex:1}}>
    <StatusBar barStyle={'dark-content'} />
    <View style={{position:'absolute', top: wp('5%')}}>
    <View style={{flexDirection:'row', top: wp('20%')}}>
      <View style={styles.title} onLayout={onLayoutRootView}>
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
      <TouchableOpacity 
      onPress={() => {navigation.navigate('User Profile')}}>
          <Image
            source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}}
            style={{
              marginLeft: wp('22%'),
              width: wp('23.8%'),
              height: wp('23.8%'),
              borderRadius: 200,
            }}
            />
      </TouchableOpacity>
    </View>


      <View>
        <MapView 
          onLayout={onLayoutRootView}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map} 
          initialRegion={{ 
            latitude: userLocation ? userLocation.lat : 1.3353906, 
            longitude: userLocation ? userLocation.lng : 103.8497414, 
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
          height: hp('23.18%'),
          width: wp('92.31%'),
          top: hp('55.61%'),
          borderRadius: 10,
          backgroundColor: 'transparent'
        }}>
        <View
        onLayout={onLayoutRootView}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
      </View>
    </SafeAreaView>
  )
}

export default RecommandationScreen

const styles = StyleSheet.create({
  title:{
    flexDirection: 'column',
    marginLeft: wp('6.41%'),
    marginBottom: hp('2.37%'),
  },
  titleText:{
    fontFamily: 'Inter-ExtraBold',
    fontSize: wp('6.15%'),
    marginLeft: wp('12.82%'),
    marginTop: hp('1.18%'),
  },
  map: {
    top: hp('7.52%'),
    height: hp('70%'),
    alignSelf: 'center',
    width: wp('94.87%'),
    marginHorizontal: wp('2.56%'),
    marginTop: wp('3.55%'),
    borderRadius: 12,
  },
  bottomSheetContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: hp('8.29%'),
    borderRadius: 8,
    paddingHorizontal: wp('7.69%'),
    marginTop: hp('0.24%'),
  },
  FilterOptionButton: {
    width: wp('38.42%'),
    height: hp('2.96%'),
    alignItems: 'center',
    backgroundColor: '#B4DFFF',
    borderRadius: 20,
    marginBottom: hp('1.18%'),
    justifyContent: 'center',
  },
  FilterOptionButtonText: {
    fontFamily: 'Inder-Regular',
    fontSize: wp('3.85%'),
    color: '#000000',
  },
  starListContainer: {
    position: 'absolute',
    bottom: hp('54.2%'),
    right: 0,
    padding: hp('1.18%'),
    borderRadius: 12,
    zIndex: 1,
  },
  starIcon: {
    width: wp('15.38%'),
    height: wp('15.38%'),
  },
  inputText1:{
    width: wp('71.79%'),
    fontFamily: 'Inter-Bold',
    fontSize: wp('4.62%'),
    color: 'black',
    marginLeft: wp('2.56%'),
  },
  image:{
    justifyContent:'center',
    marginLeft: wp('2.56%'),
    height: wp('8.97%'),
    width: wp('8.97%')
  }
})
