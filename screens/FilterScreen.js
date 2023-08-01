import { StyleSheet, Text, View, ScrollView, Modal, Image, TouchableOpacity, StatusBar, Alert } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import axios from 'axios'
import * as Location from 'expo-location';
import CheckBox from '../CheckBoxComponent'
import { firebase } from '../config'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const FilterScreen = ({route}) => {
  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [navigation])
  )

  const {selectedCategory} = route.params;
  console.log(selectedCategory);
 
  const [timeText, setTimeText] = useState('')
 
  const OnChangeNow = () => {
    const currentDate = new Date
    let nTime = currentDate.getHours() + ' : ' + currentDate.getMinutes().toString().padStart(2, '0');
    setTimeText(nTime);
    console.log(nTime)
  }

  //Display current location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [userChosenLocation, setUserChosenLocation] = useState('');
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Access location denied');
        return;
      }
      

      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
      setLocation(location);
      console.log("Location:");
      console.log(location);

      
      const reverseGeocodeLocation = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
        params:{
          latlng: `${location.coords.latitude},${location.coords.longitude}`,
          key: 'AIzaSyDerNS1YLni4oQ0ikqY_zLnDcoqYzEaBCk' // Google Maps API key
          }
        });
        const { results } = reverseGeocodeLocation.data;
        if (results && results.length > 0) {
          const addressComponents = results[0].address_components;
          const route = addressComponents.find(component => component.types.includes('route'));
          const neighborhood = addressComponents.find(component => component.types.includes('neighborhood'));
          let streetname = '';
          if (route) {
            streetname = route.short_name
          } else if (!route && neighborhood) {
            streetname = neighborhood.short_name
          } else if (!route && !neighborhood) {
            streetname = 'No address found'
          }
          console.log('Address:', addressComponents);
          setPlaceName(streetname); 
        } else {
        console.error('Error retrieving address:', error);
        };
    })();
  }, []);
  
  let searchingText = 'Waiting..';
  if (errorMsg) {
    searchingText = errorMsg;
  } else {
    searchingText = placeName;
  }

  console.log("Searching:")
  console.log(placeName)

  //Display selected buttons
  //https://reactgo.com/react-change-button-color-onclick/
  const [priceButton, setPriceButton] = useState([]);
  const [now, setNow] = useState(false);
  const [otherTimePeriod, setOtherTimePeriod] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [typeTheLocation, setTypeTheLocation] = useState(false);
  const [price1, setPrice1] = useState(false);
  const [price2, setPrice2] = useState(false);
  const [price3, setPrice3] = useState(false);
  const [price4, setPrice4] = useState(false);

  const handleNowClicked = () => {
    setNow(true);
    setOtherTimePeriod(false);
  };

  const handleOtherClicked = () => {
    setNow(false);
    setOtherTimePeriod(true);
  };
  
  const handleCurrentClicked = () => {
    setNearMe(true);
    setTypeTheLocation(false);
  };

  const handleElseWhereClicked = () => {
    setNearMe(false);
    setTypeTheLocation(true);
    getCoordinates(userChosenLocation)
  }

  const handleButtonPress = (buttonNo) => {
    if (priceButton.includes(buttonNo)) {
      const buttonList = priceButton.filter((button) => button !== buttonNo)
      setPriceButton(buttonList.filter(value => typeof value === 'string'));
    } else {
      setPriceButton([...priceButton,buttonNo]);
    }
  }

  const priceMapping = {
    "0-10": '1',
    "10-30": '2',
    "30-50": '3',
    "50++": '4',
  };

  const priceSelected = priceButton.map((buttonNo) => priceMapping[buttonNo])
  console.log(priceSelected);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    getCoordinates(userChosenLocation);
  }, [userChosenLocation]);
  
  const getCoordinates = async (place) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: place,
          components: 'country:SG',
          key: 'AIzaSyDerNS1YLni4oQ0ikqY_zLnDcoqYzEaBCk' // Google Maps API key
        }
      });
      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setLatitude(lat);
        setLongitude(lng);
        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
        //console.log(results)
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      console.error('Error retrieving coordinates:', error);
    }
  };

  useEffect(() => {
    getCoordinates(userChosenLocation);
  }, [userChosenLocation]);


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

  console.log('here', userChosenLocation)
  console.log('here', timeText)
  const validTimeFormat = /^([0-1]?[0-9]|2[0-3])(\s?:\s?)([0-5][0-9])\s*$/

  const checkFilled = () => {
    if (timeText === '') {
      Alert.alert(
        'Warning',
        'Please select your preferred time.'
      )
    } else if (!validTimeFormat.test(timeText)) {
      Alert.alert('Warning', 
      'Please enter a valid time in the format HH:MM.'
      )
    } else if (userChosenLocation === '' || userChosenLocation === 'No address found' ) {
      Alert.alert(
        'Warning',
        'Please select your preferred location.'
      )
    } else if (!priceSelected.length) {
      Alert.alert(
        'Warning',
        'Please select your preferred prices.'
      )
    } else {
      navigation.navigate('Main', { selectedCategory:selectedCategory, price: priceSelected, time: timeText, location: userChosenLocation});
    }
  }
  const navigation = useNavigation()
  
  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inder-Regular": require('../assets/fonts/Inder-Regular.ttf')
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
    <ScrollView showsVerticalScrollIndicator={false}>    
    <StatusBar barStyle={'dark-content'} />
    <SafeAreaView>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Select Your Preferences
          </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
          <Image
            source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}}
            style={{
              marginLeft: wp('10.26%'),
              width: wp('23.08%'),
              height: wp('23.08%'),
              borderRadius: 200,
              bottom: hp('0.6%'),

            }}
            />
          </TouchableOpacity>
        </View>
        

        <View style={styles.subTitle}>
          <Text style={styles.subtitleText}>
            Time Range
          </Text>
        </View>

        <View
          style={styles.buttonContainerNow} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <CheckBox
            onPress={() => [handleNowClicked(), OnChangeNow()]}
            isChecked={now}/>            
          <Text style={styles.inputText}>Now</Text>
          </View>
        </View>

        <View
          style={styles.buttonContainerOtherTime} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <TextInput
            style={
              {marginLeft:wp('8.46%'),
              alignItems:'center',
              fontFamily:'Inder-Regular',
              fontSize:wp('5.13%'),
              color:'#4F200D',
            }}
            placeholder='Time HH:MM'
            placeholderTextColor="#4F200D" 
            autoCapitalize='none'
            autoCorrect={false}
            value={timeText}
            onChangeText={text => setTimeText(text)}
            onPressIn={handleOtherClicked}
            />
          </View>
        </View>

        <View style={styles.subTitle}>
          <Text style={styles.subtitleText}>
            Location Range
          </Text>
        </View>

        <View
          style={styles.buttonContainerLocation} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <CheckBox
            onPress={() => [handleCurrentClicked(), setUserChosenLocation(placeName)]}
            isChecked={nearMe}
          />
          <Text style={styles.inputText}>Near me: {searchingText}</Text>
          </View>
        </View>

        <View
          style={{
            width: wp('77%'),
            height: hp('5.8%'),
            backgroundColor: '#FFCE84',
            borderRadius: 10,
            marginBottom: hp('1.18%'),
            marginLeft: wp('10.25%'),
          }} onLayout={onLayoutRootView}>
            <TextInput 
            style={
              {flex: 1,
              fontFamily: 'Inder-Regular',
              fontSize: wp('5.13%'),
              color: '#4F200D',
              textAlign: 'center'
            }}
            placeholder='Type the Location'
            placeholderTextColor="#4F200D" 
            autoCapitalize='words'
            autoCorrect={false}
            value={userChosenLocation}
            onChangeText={text => setUserChosenLocation(text)}
            onPressIn={handleElseWhereClicked}
            />
        </View>

        <View style={styles.subTitle}>
          <Text style={styles.subtitleText}>
            Price Range
          </Text>
        </View>

        <View style={{flexDirection:'row'}}>
        <View
          style={styles.buttonContainerPrice} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <CheckBox
            onPress={() => [setPrice1(!price1),handleButtonPress('0-10')]}
            isChecked={price1}
          />
          <Text style={styles.inputText}>$0 - $10</Text>
          </View>
        </View>
          

        <View
        style={styles.buttonContainerPrice2} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <CheckBox
            onPress={() => [setPrice2(!price2),handleButtonPress('10-30')]}
            isChecked={price2}
          />
          <Text style={styles.inputText}>$10 - $30</Text>
          </View>
        </View>
      </View>

        
       <View
        style={{flexDirection:'row'}}>
        <View
        style={styles.buttonContainerPrice} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <CheckBox
            onPress={() => [setPrice3(!price3),handleButtonPress('30-50')]}
            isChecked={price3}
          />
          <Text style={styles.inputText}>$30 - $50</Text>
          </View>
        </View>

        <View
        style={styles.buttonContainerPrice2} onLayout={onLayoutRootView}>
          <View style={styles.group}>
          <CheckBox
            onPress={() => [setPrice4(!price4),handleButtonPress('50++')]}
            isChecked={price4}
          />
          <Text style={styles.inputText}>$50+++</Text>
          </View>
        </View>
      </View>
      
      

        <View
          style={styles.buttonContainerApply} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => 
              {checkFilled()}}
            style={
              {backgroundColor:'#FFCE84',
              width: wp('65.64%'),
              height: hp('5.69%'),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text style={styles.inputText}>See Recommendations!</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
    </ScrollView>
  )
}
                                            
  export default FilterScreen

const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    marginTop: hp('2.37%'),
    marginLeft: wp('6.41%'),
  },
  titleText:{
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1,
    fontSize: wp('8.21%'),
  },
  subTitle:{
    marginTop: hp('2.37%'),
    marginLeft: wp('5.13%'),
    marginBottom: hp('1.18%'),

  },
  subtitleText:{
    fontFamily: 'Inter-Bold',
    fontSize: wp('6.67%'),
    letterSpacing: 0.5,
    color: '#4f200D'
  },
  group:{
    flexDirection: 'row',
    marginTop: hp('1.18%'),
    marginBottom: hp('1.18%'),
  },
  buttonContainerNow:{
    justifyContent:'center',
    width: wp('35.9%'),
    height: hp('5.8%'),
    backgroundColor: '#FFCE84',
    borderRadius: 10,
    paddingBottom: hp('-0.95%'),
    marginBottom: hp('1.18%'),
    marginLeft: wp('10.27%'),
  },
  buttonContainerOtherTime:{
    justifyContent:'center',
    width: wp('58.98%'),
    height: hp('5.8%'),
    backgroundColor: '#FFCE84',
    borderRadius: 10,
    paddingBottom: hp('-0.95%'),
    marginBottom: hp('1.18%'),
    marginLeft: wp('10.27%'),
  },
  buttonContainerLocation:{
    justifyContent:'center',
    width: wp('76.92%'),
    height: hp('5.8%'),
    flexDirection: 'column',
    backgroundColor: '#FFCE84',
    borderRadius: 10,
    paddingBottom: hp('-0.95%'),
    marginBottom: hp('1.18%'),
    marginLeft: wp('10.27%'),
  },
  buttonContainerPrice:{
    justifyContent:'center',
    width: wp('38.46%'),
    height: hp('5.8%'),
    backgroundColor: '#FFCE84',
    borderRadius: 10,
    paddingBottom: hp('-0.95%'),
    marginBottom: hp('1.18%'),
    marginLeft: wp('10.27%'),
  },
  buttonContainerPrice2:{
    justifyContent:'center',
    width: wp('38.46%'),
    height: hp('5.8%'),
    backgroundColor:'#FFCE84',
    borderRadius:10,
    paddingBottom: hp('-0.95%'),
    marginBottom: hp('1.18%'),
    marginLeft: wp('3.85%'),
  },
  buttonContainerApply:{
    justifyContent:'center',
    alignItems: 'center',
    marginTop: hp('5.92%'),
  },
  inputText:{
    textAlignVertical:'center',
    alignItems: 'center',
    fontFamily: 'Inder-Regular',
    fontSize: wp('5.13%'),
    color: '#4F200D',
  },
  dateTimeContainer: {
    flex: 1,
    marginTop: '110%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D0D0',
  },
})
