import { StyleSheet, Text, View,ScrollView, Modal} from 'react-native'
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

const FilterScreen = ({route}) => {
  const {selectedCategory} = route.params;
  const [category, setCategory] = useState(selectedCategory);

  console.log(selectedCategory);
  //const [selectedLocation, setSelectedLocation] = useState('');
  //const [selectedPriceRange, setSelectedPriceRange] = useState('');

  //For time picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState('Date')
  const [timeText, setTimeText] = useState('Time')

  const OnChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    //setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' 
    + tempDate.getFullYear().toString().slice(-2);
    let fTime = tempDate.getHours() + ' : ' + tempDate.getMinutes().toString().padStart(2, '0');
    if (mode === 'date') {
      setDateText(fDate);
    }
    else if (mode === 'time') {
      setTimeText(fTime);
    }
  }

  const OnChangeNow = () => {
    const currentDate = new Date
    setDate(currentDate);

    let nDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' 
    + currentDate.getFullYear().toString().slice(-2);
    let nTime = currentDate.getHours() + ' : ' + currentDate.getMinutes().toString().padStart(2, '0');
    setDateText(nDate);
    setTimeText(nTime);

    console.log(nDate + '(' + nTime + ')')
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }

  //Display current location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [placeName, setPlaceName] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
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
          const { street, city } = geocode[0]; // Destructure the street and city properties from the geocode object
          const address = street ? `${street}, ${city}` : city; // Concatenate street and city if available

          setPlaceName(address); // Set the place name to the street address or city
        }
      }
    })();
  }, []);

  let locationText = 'Waiting..';
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = placeName
  }



  

  //Display selected buttons
  const [isNowButtonPressed, setIsNowButtonPressed] = useState(false);
  const [isOtherButtonPressed, setOtherButtonPressed] = useState(false);
  const [isCurrentButtonPressed, setCurrentButtonPressed] = useState(false);
  const [isElseWhereButtonPressed, setElseWhereButtonPressed] = useState(false);
  const [priceButton, setPriceButton] = useState(['']);

  const handleNowButtonPress = () => {
    setIsNowButtonPressed(true);
    setOtherButtonPressed(false);
  };

  const handleOtherButtonPress = () => {
    setIsNowButtonPressed(false);
    setOtherButtonPressed(true);
  };
  
  const handleCurrentButtonPress = () => {
    setCurrentButtonPressed(true);
    setElseWhereButtonPressed(false);
  };

  const handleElseWhereButtonPress = () => {
    setCurrentButtonPressed(false);
    setElseWhereButtonPressed(true);
  }

  const handleButtonPress = (buttonNo) => {
    if (priceButton.includes(buttonNo)) {
      setPriceButton(priceButton.filter((button) => button !== buttonNo));
    } else {
      setPriceButton([...priceButton,buttonNo]);
    }
  }
  console.log(priceButton)

  const isButtonSelected = (buttonNo) => {
    return priceButton.includes(buttonNo);
  };

  const navigation = useNavigation()

  const[data, setData] = useState('');
  const [totalResults, setTotalResults] = useState(0);


  const getData = async () => {
    try {
      const response = await axios.get(
        'https://api.yelp.com/v3/businesses/search',
        {
          params: {
            term: {selectedCategory},
            latitude: 1.290270,
            longitude: 103.851959
          },
          headers: {
            Authorization: `Bearer ${'l2WdiWyvXyQZCQcc2XAGz6gn6LcrkK8Peix0d4sjZxpFOGu4E3by9096JwD0Wtp3RkWQ9-6emuXm1cKaivxwxozQZ-iHo0xR_DOL4eAvTQ02pVNINNMqknxBUgJ_ZHYx'}`
          },
        }
      );
      const jsonData = await response.data;
      setData(jsonData);
      setTotalResults(jsonData.total);
      navigation.navigate('Main', { recommendations: jsonData });
    } catch (error) {
      console.error('Error fetching Yelp data:', error);
    }
  };
  console.log(data);
  console.log(totalResults)

    
  


 /* /Filter data
  const XLSX = require('xlsx');
  const [group, setGroup] = useState('');
  const [activityLocation, setActivityLocation] = useState('');

  const filterDataFromExcel = (group, activityLocation) => {
    // Load the Excel workbook
    const workbook = XLSX.readFile('../testinglists.xlsx');
  
    // Assume the data is in the first sheet (index 0)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);

    /*const location = (place, address) => {
      if (place.toLowerCase() === activityLocation.toLowerCase()) {
        return true
      } else if (address.toLowerCase().includes(activityLocation)) {
        return true
      }
      return false;
    }


    const opened = (dataTime, userSelectedTime) => {
      if (dataTime !== 'Closed' && dataTime !== 'Open 24 Hours') {
        const [openingTime, closingTime] = dataTime.split(' - '); // Split the opening hours into opening and closing time
        const [openingHourString, openingMinuteString] = openingTime.split(':');
        const [closingHourString, closingMinuteString] = closingTime.split(':');

        const openingHour = parseInt(openingHourString); // Extract the opening hour from the opening time
        const closingHour = parseInt(closingHourString); // Extract the closing hour from the closing time
        const openingMinutes = parseInt(openingMinuteString); // Extract the opening hour from the opening time
        const closingMinutes = parseInt(closingMinuteString);
        const time12HourFormat = new Date("2000-01-01T" + userSelectedTime + "Z") .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const currentTime = new Date("2000-01-01T" + time12HourFormat + "Z");
        console.log(time12HourFormat);

        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        if (
          (currentHour > openingHour || (currentHour === openingHour && currentMinute >= openingMinutes)) &&
          (currentHour < closingHour || (currentHour === closingHour && currentMinute <= closingMinutes))
        ) {
          return true
          // The restaurant is currently open
        } else {
          return false
          // The restaurant is currently closed
        }
      } else if (dataTime === 'Closed') {
        return false;
      } else if (dataTime === "Open 24 hours") {
        return true
      }
    }

    // Filter the data based on the provided parameters
    const filteredData = jsonData.filter((item) => {
      //const currentDateStr = dateText; // Replace with your current date string
      //const currentDate = new Date(Date.parse(currentDateStr));
      //const openingDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      //const currentDay = openingDays[currentDate.getDay()];
      return (
        item.category === group 
        //item.place === activityLocation
        //item.currentDay === opened(item.currentDay, timeText)
      )
    });
    return filteredData;
  }
  */
  

  
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

  
  return (    
    <SafeAreaView>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Select Your Preferences
          </Text>
        </View>

        <View style={styles.subTitle}>
          <Text style={styles.subtitleText}>
            Time Range
          </Text>
        </View>

        <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPressIn={handleNowButtonPress}
            //activeOpacity={0.7}
            onPress={() => OnChangeNow()}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isNowButtonPressed && styles.buttonPressed]}>
            <View style={styles.inputContainer1}>
              <Text style={styles.inputText1}>Now</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => showMode('date')}
            onPressIn={handleOtherButtonPress}
            //存储选择 要添加一下 下面同理
            style={styles.buttonInput}>
            <View style={styles.inputContainer2}>
              <Text style={styles.inputText3}>{dateText}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showMode('time')}
            onPressIn={handleOtherButtonPress}
            //存储选择 要添加一下 下面同理
            style={styles.buttonInput}>
            <View style={styles.inputContainer2}>
              <Text style={styles.inputText3}>{timeText}</Text>
            </View>
          </TouchableOpacity>

          <Modal
            visible={show}
            transparent={true}
            animationType='slide'
          >
            <View style={styles.dateTimeContainer}>
              <DateTimePicker
                value={date}
                mode={mode}
                is24Hour={false}
                display="spinner"
                onChange={OnChange}
              />
              <TouchableOpacity onPress={() => setShow('false')}>
                <View>
                  <Text style={styles.closeButton}>OK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        <View style={styles.subTitle}>
          <Text style={styles.subtitleText}>
            Location Range
          </Text>
        </View>

        <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => {}}
            onPressIn={handleCurrentButtonPress}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isCurrentButtonPressed && styles.buttonPressed]}>
            <View style={styles.inputContainer1}>
              <Text style={styles.inputText1}>Near me : {placeName}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity style={styles.buttonInput}
            onPressIn={handleElseWhereButtonPress}>
            <View style={styles.inputContainer1}>
              <TextInput 
              style={styles.inputText1} 
              placeholder='Other Location'
              placeholderTextColor="#A45D40" 
              autoCapitalize='none'
              autoCorrect={false}
              value={location}
              onChangeText={text => setLocation(text)}
              onPressIn={handleElseWhereButtonPress}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.subTitle}>
          <Text style={styles.subtitleText}>
            Price Range
          </Text>
        </View>
        <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => handleButtonPress('0-10')}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isButtonSelected('0-10') && styles.buttonPressed]}>
            <View style={styles.inputContainer3}>
              <Text style={styles.inputText2}>$0 - $10</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonPress('10-20')}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isButtonSelected('10-20') && styles.buttonPressed]}>
            <View style={styles.inputContainer3}>
              <Text style={styles.inputText2}>$10 - $20</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonPress('20-30')}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isButtonSelected('20-30') && styles.buttonPressed]}>
            <View style={styles.inputContainer3}>
              <Text style={styles.inputText2}>$20 - $30</Text>
            </View>
          </TouchableOpacity>
        </View><View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => handleButtonPress('30-40')}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isButtonSelected('30-40') && styles.buttonPressed]}>
            <View style={styles.inputContainer3}>
              <Text style={styles.inputText2}>$30 - $40</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonPress('40-50')}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isButtonSelected('40-50') && styles.buttonPressed]}>
            <View style={styles.inputContainer3}>
              <Text style={styles.inputText2}>$40 - $50</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonPress('50++')}
            //存储选择 要添加一下 下面同理
            style={[styles.buttonInput, isButtonSelected('50++') && styles.buttonPressed]}>
            <View style={styles.inputContainer3}>
              <Text style={styles.inputText2}>$50 ---</Text>
            </View>
          </TouchableOpacity>
        </View><View
          style={styles.buttonContainer1} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => 
              {getData();
                 }}
            //存储选择 要添加一下 下面同理
            style={styles.buttonInput}>
            <View style={styles.inputContainer1}>
              <Text style={styles.inputText1}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
                }                
                

  export default FilterScreen

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
  buttonPressed: {
    backgroundColor: '#FBB956', // Darker color when pressed
  },
  inputContainer1:{
    flexDirection:'row',
    justifyContent:'center',
    width:275,
  },
  inputContainer2:{
    flexDirection:'row',
    justifyContent:'center',
    width:80,
    height:25
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
    width:83,
    justifyContent:'center'
  },
  inputText3:{
    fontFamily:'Inter-Bold',
    fontSize:16,
    color:'#7A3E3E',
    //width:80,
    justifyContent:'center'
  },
  dateTimeContainer: {
    flex:1,
    marginTop:'110%',
    //marginLeft: "10%",
    //marginRight: "10%",
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
})