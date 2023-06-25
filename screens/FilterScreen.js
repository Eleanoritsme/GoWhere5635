import { StyleSheet, Text, View,ScrollView, Modal, Image} from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import moment from 'moment';
import CheckBox from '../CheckBoxComponent'

const FilterScreen = ({route}) => {
  const {selectedCategory} = route.params;
  console.log(selectedCategory);

  //For time picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  //const [dateText, setDateText] = useState('Date')
  const [timeText, setTimeText] = useState('Choose Time')

  //https://www.youtube.com/watch?v=Imkw-xFFLeE&t=298s
  const OnChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    //setShow(Platform.OS === 'ios');
    //setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fTime = tempDate.getHours() + ' : ' + tempDate.getMinutes().toString().padStart(2, '0');
    setTimeText(fTime);
  }
  
    /*let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' 
    + tempDate.getFullYear().toString().slice(-2);
    let fTime = tempDate.getHours() + ' : ' + tempDate.getMinutes().toString().padStart(2, '0');
    if (mode === 'date') {
      setDateText(fDate);
    }
    else if (mode === 'time') {
      setTimeText(fTime);
    }
  }
  */

  const OnChangeNow = () => {
    const currentDate = new Date
    //setDate(currentDate);

    //let nDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' 
    //+ currentDate.getFullYear().toString().slice(-2);
    let nTime = currentDate.getHours() + ' : ' + currentDate.getMinutes().toString().padStart(2, '0');
    //setDateText(nDate);
    setTimeText(nTime);

    //console.log(nDate + '(' + nTime + ')')
    console.log(nTime)
  }

  const showMode = (currentMode) => {
    setShow(true);
    //setMode(currentMode);
  }


  //Display current location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [userChosenLocation, setUserChosenLocation] = useState('');

  //Reused from https://docs.expo.dev/versions/latest/sdk/location/
  useEffect(() => {
    (async () => {
      let { permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setErrorMsg('Access location denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const { street, city } = geocode[0]; 
          const address = street ? street : city; // add street and city if have

          setPlaceName(address); 
        }
      }
    })();
  }, []);


  let searchingText = 'Waiting..';
  if (errorMsg) {
    searchingText = errorMsg;
  }


  //Display selected buttons
  //https://reactgo.com/react-change-button-color-onclick/
  const [isNowClicked, setIsNowClicked] = useState(false);
  const [isOtherClicked, setOtherClicked] = useState(false);
  const [isCurrentClicked, setCurrentClicked] = useState(false);
  const [isElseWhereButtonPressed, setElseWhereClicked] = useState(false);
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
  //console.log(priceButton)

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

  const navigation = useNavigation()

  const[data, setData] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const getData = async () => {
    try {
      //Get the unix time for timeText
      const[hours, minutes] = timeText.split(":");
      const time = moment().hours(hours).minutes(minutes).unix();
      const response = await axios.get(
        'https://api.yelp.com/v3/businesses/search',
        {
          params: {
            term: selectedCategory,
            latitude: latitude,
            longitude: longitude,
            open_at: time,
            price: priceSelected.join(","),
            limit:50
          },
          headers: {
            Authorization: `Bearer ${'l2WdiWyvXyQZCQcc2XAGz6gn6LcrkK8Peix0d4sjZxpFOGu4E3by9096JwD0Wtp3RkWQ9-6emuXm1cKaivxwxozQZ-iHo0xR_DOL4eAvTQ02pVNINNMqknxBUgJ_ZHYx'}`
          },
        }
      );
      const jsonData = await response.data;
      setData(jsonData);
      setTotalResults(jsonData.total);
      console.log(time)
      navigation.navigate('Main', { recommendations: jsonData });
    } catch (error) {
      console.error('Error fetching Yelp data:', error);
    }
  }
  console.log(totalResults)
  //console.log(userChosenLocation)
  

  
  
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
    <SafeAreaView>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Select Your Preferences
          </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
          <Image
          source={require('../assets/images/users/Default_pfp.jpg')} 
          style={{
            marginLeft:20,
              width:90,
              height:90,
              borderRadius:400 / 2
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
          <CheckBox
            onPress={() => [handleOtherClicked(),showMode('time')]}
            isChecked={otherTimePeriod}
          />
            <Text style={styles.inputText}>{timeText}</Text>
          </View>

          <Modal
            visible={show}
            transparent={true}
            animationType='slide'
          >
            <View style={styles.dateTimeContainer}>
              <DateTimePicker
                value={date}
                mode='time'
                is24Hour={false}
                display="spinner"
                onChange={OnChange}
                
            />
              <CheckBox onPress={() => {setShow('false')}}/>
              <Text style={styles.inputText}>Confirm</Text>
            </View>
          </Modal>
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
            onPress={() => [handleCurrentClicked(),setUserChosenLocation(placeName)]}
            isChecked={nearMe}
          />
          <Text style={styles.inputText}>Near me: {searchingText}</Text>
          </View>
        </View>

        <View
          style={styles.buttonContainerLocation} onLayout={onLayoutRootView}>
          <View style={styles.group}>
            <TextInput 
            style={
              {marginLeft:33,
              alignItems:'center',
              fontFamily:'Inder-Regular',
              fontSize:20,
              color:'#4F200D',
            }}
            placeholder='Type the Location'
            placeholderTextColor="#4F200D" 
            autoCapitalize='none'
            autoCorrect={false}
            value={userChosenLocation}
            onChangeText={text => setUserChosenLocation(text)}
            onPressIn={handleElseWhereClicked}
            />
          </View>
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
              {getCoordinates(userChosenLocation);getData();
                 }}
            //存储选择 要添加一下 下面同理
            style={
              {backgroundColor:'#FFCE84',
              width:256,
              height:48,
              alignItems:'center',
              justifyContent:'center',
              borderRadius:10,
            }}>
            <Text style={styles.inputText}>See Recommendations!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
                                            
  export default FilterScreen

const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    marginTop:20,
    marginLeft:25,
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    letterSpacing:1,
    fontSize: 32,
  },
  subTitle:{
    marginTop:20,
    marginLeft:20,
    marginBottom:10,

  },
  subtitleText:{
    fontFamily:'Inter-Bold',
    fontSize:26,
    letterSpacing:0.5,
    color:'#4f200D'
  },
  group:{
    flexDirection:'row',
    marginTop:10,
    marginBottom:10,
  },
  buttonContainerNow:{
    width:140,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:40,
  },
  buttonContainerOtherTime:{
    width:230,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:40,
  },
  buttonContainerLocation:{
    width:250,
    flexDirection:'column',
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:40,
  },
  buttonContainerPrice:{
    width:160,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:40,
  },
  buttonContainerPrice2:{
    width:160,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:20,
  },
  buttonContainerApply:{
    alignItems:'center',
    marginTop:20,
  },
  inputText:{
    alignItems:'center',
    fontFamily:'Inder-Regular',
    fontSize:20,
    color:'#4F200D',
  },
  dateTimeContainer: {
    flex:1,
    marginTop:'110%',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
})