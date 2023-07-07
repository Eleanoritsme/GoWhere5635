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
  console.log(time)
  console.log(location)

  const navigation = useNavigation()
  const [selectedLocationIcon, setSelectedLocationIcon] = useState(null);
  const mapRef = useRef(null);
  const priceMapping = {
    "1": '$, ',
    "2": '$$, ',
    "3": '$$$, ',
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
        //console.log('Time'+ time)
        //console.log('lat' + lat)
        //console.log('long' + lng)
      } catch (error) {
        console.error('Error fetching Yelp data:', error);
      }
    };
    getData();
  }, [selectedCategory, price, time, location]);
  


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
      <View style={styles.title} >
        <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
        <Image
          source={require('../assets/images/users/Default_pfp.jpg')} 
          style={{
            marginLeft:"70%",
            marginTop:-20,
            width:90,
            height:90,
            borderRadius:400 / 2
          }}
        />
        </TouchableOpacity>
      </View>
      <View style={styles.FilterOptionContainer} onLayout={onLayoutRootView}>
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
        <View style={styles.bottomSheetContainer} onLayout={onLayoutRootView}>
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
                  {item.name}</Text>
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
    </SafeAreaView>
  );
};


export default RecommandationScreen

const styles = StyleSheet.create({
  map: {
    height: 500,
    marginHorizontal:10,
    marginTop:30,
    borderRadius:10
  },
  bottomSheetContainer: {
    position:'absolute',
    height:150,
    bottom:0,
    left:10,
    right:10,
    borderRadius:8,
    backgroundColor:'#eaeaea'
  },
  FilterOptionContainer: {
    marginBottom:-5,
    marginTop:-70,
    marginLeft:40,
  },
  FilterOptionButton: {
    width:150,
    height:25,
    alignItems: 'center',
    backgroundColor: '#B4DFFF',
    borderRadius: 20,
    marginBottom: 10,
  },
  FilterOptionButtonText: {
    fontFamily: 'Inder-Regular',
    fontSize: 15,
    color: '#000000',
  },
  bottomSheetContent: {
    flexDirection:'row',
    alignContent:'center',
    backgroundColor: 'white',
    height:100,
    borderRadius:8,
    paddingHorizontal:30,
    marginTop:2,
  },
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
  listContainer:{
    height:250,
    borderColor:'#4F200D',
    paddingVertical:10,
    paddingHorizontal:50,
    marginTop:1,
    backgroundColor:'#E2F7FF',
    shadowColor: '#000000',
    shadowOffset: { height: 2}, 
    shadowOpacity: 1, 
    shadowRadius: 1, 
  },
  listContainer1:{
    justifyContent:'space-around',
    flexDirection:'row',
    marginTop:20,
    marginBottom:15,
    marginLeft:15,
    marginRight:200,
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
    width:280,
    marginTop: 5,
    fontFamily:'Inter-Bold',
    fontSize:18,
    color:'black'
  },
  inputText2:{
    fontFamily:'Inter-Regular',
    fontSize:15,
    color:'#000000',
    width:220,
    marginTop: 10,
    marginLeft:-30,
    lineHeight:30
  },
  image:{
    //alignItems:'center',
    marginLeft:25,
    marginTop:10,
    height:40,
    width:40
  }
})