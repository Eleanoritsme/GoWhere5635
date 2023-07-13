import { Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { firebase } from '../config';
import * as SplashScreen from 'expo-splash-screen'
import Entypo from 'react-native-vector-icons/Entypo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-element-dropdown'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'

SplashScreen.preventAutoHideAsync();

const ProfileEditScreen = () => {
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [navigation])
  )
  const [countryData, setCountryData] = useState([])
  const [cityData, setCityData] = useState([])
  const [countryName, setCountryName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    var config = {
      method: 'get',
      url: 'https://api.countrystatecity.in/v1/countries',
      headers: {
        'X-CSCAPI-KEY': 'SHRPbWNoOTByRUI0ZjhZUGxkdDVHY1FaMk1SVnd3eGU5ZWtnZUY1VQ== '
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      var count = Object.keys(response.data).length;
      let countryArray = [];
      for (var i = 0; i < count; i++ ){
        countryArray.push({
          value: response.data[i].iso2,
          label: response.data[i].name,
        });
      }
      setCountryData(countryArray)
    })
    .catch(function (error) {
      console.log(error);
    });
  }, [])

  // const handleState = (countryCode) => {
  //   var config = {
  //     method: 'get',
  //     url: `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
  //     headers: {
  //       'X-CSCAPI-KEY': 'SHRPbWNoOTByRUI0ZjhZUGxkdDVHY1FaMk1SVnd3eGU5ZWtnZUY1VQ== '
  //     }
  //   };
    
  //   axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //     var count = Object.keys(response.data).length;
  //     let stateArray = [];
  //     for (var i = 0; i < count; i++ ){
  //       stateArray.push({
  //         value: response.data[i].iso2,
  //         label: response.data[i].name,
  //       });
  //     }
  //     setStateData(stateArray)
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });    
  // };

  const handleCity = (countryCode, stateCode) =>{
    var config = {
      method: 'get',
      url: `https://api.countrystatecity.in/v1/countries/${countryCode}/cities`,
      headers: {
        'X-CSCAPI-KEY': 'SHRPbWNoOTByRUI0ZjhZUGxkdDVHY1FaMk1SVnd3eGU5ZWtnZUY1VQ== '
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      var count = Object.keys(response.data).length;
      let cityArray = [];
      for (var i = 0; i < count; i++ ){
        cityArray.push({
          value: response.data[i].id,
          label: response.data[i].name,
        });
      }
      setCityData(cityArray)
    })
    .catch(function (error) {
      console.log(error);
    });    
  }

  const [user, setUser] = useState();
  const {uid} = firebase.auth().currentUser;

  const getUser = async () => {
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

  const handleUpdate = async() => {
    firebase.firestore().collection('users').doc(uid).update({
      userName: user.userName,
      dateOfBirth: user.dateOfBirth, 
      occupation: user.occupation, 
      country: countryName, 
      city: cityName, 
      bio: user.bio,
    })
    .then(() => {
      console.log('User data updated!');
      Alert.alert(
        'Changes Saved!',
        'Your profile has been updated successfully.',
        [
          {text: 'Back', onPress: () => {navigation.navigate('User Profile')}, style: 'cancel'}
        ]
      );
    })
  }

  

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
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
    <KeyboardAwareScrollView 
    style={{flex:1}}
    extraScrollHeight={120}
    keyboardVerticalOffset={70}
    enableResetScrollToCoords={false}
    >
    <ScrollView
      style={{flex:1}}
      contentContainerStyle={{alignContent:'flex-start', paddingBottom:60}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    <TouchableOpacity
      onPress={() => navigation.navigate('User Image')}
      style={{
        alignItems:'center',
        marginBottom:30,
      }}>
      <Image 
        style={{
          height: 135,
          width: 135,
          borderRadius: 75,
          marginTop:10,
        }}
        source={{uri: user ? user.image : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}} />
      <View style={{
        position:'absolute',
        contentContainerStyle:''
      }}>
        <Entypo name='camera' size={30} color='#FFBC11' style={{top:110, left:55}} />
      </View>
    </TouchableOpacity>
    <View
      style={{
        left:20
      }}>
      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>User Name</Text>
      <TextInput
      placeholder='User Name'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.userName : ''}
      autoCorrect={false}
      autoCapitalize='none'
      onChangeText={(text) => setUser({...user, userName:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Date Of Birth</Text>
      <TextInput
      placeholder='Date Of Birth'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.dateOfBirth : ''}
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, dateOfBirth:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Occupation</Text>
      <TextInput
      placeholder='Occupation'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.occupation : ''}
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, occupation:text})}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>
  
      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Country/Region</Text>
      <Dropdown
          style={[{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
          }, { borderColor: '#D3D3D3' }]}
          placeholderStyle={{fontSize: 14, color:"black", fontFamily:'Inter-Medium'}}
          selectedTextStyle={{fontSize: 14, fontFamily:'Inter-Medium'}}
          inputSearchStyle={ {
            height: 40,
            fontSize: 14,
            }}
          iconStyle={{
            width: 20,
            height: 20,
          }}
          data={countryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={user ? user.country : '...'}
          placeholderTextColor='#000000'
          searchPlaceholder="Search Country/Region"
          value={user ? user.country : country}
          onChange={item => {
            setCountry(item.value);
            handleCity(item.value);
            setCountryName(item.label);
          }}
        />

      {/* <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>State</Text>
      <Dropdown
          style={[{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
          }, { borderColor: '#D3D3D3' }]}
          placeholderStyle={{fontSize: 14, color:"black", fontFamily:'Inter-Medium'}}
          selectedTextStyle={{fontSize: 14, fontFamily:'Inter-Medium'}}
          inputSearchStyle={ {
            height: 40,
            fontSize: 14,
            }}
          iconStyle={{
            width: 20,
            height: 20,
          }}
          data={stateData}
          search
          maxHeight={300}
          labelField="label"
          valueField="black"
          placeholder={user ? user.state : '...'}
          searchPlaceholder="Search State"
          value={state}
          onChange={item => {
            setState(item.value);
            handleCity(country, item.value);
            setStateName(item.label);
          }}
        /> */}

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>City</Text>
      <Dropdown
          style={[{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
          }, { borderColor: '#D3D3D3' }]}
          placeholderStyle={{fontSize: 14, color:"black", fontFamily:'Inter-Medium'}}
          selectedTextStyle={{fontSize: 14, fontFamily:'Inter-Medium'}}
          inputSearchStyle={ {
            height: 40,
            fontSize: 14,
            }}
          iconStyle={{
            width: 20,
            height: 20,
          }}
          data={cityData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={user ? user.city : '...'}
          searchPlaceholder="Search City"
          value={city}
          onChange={item => {
            setCity(item.value);
            setCityName(item.label);
          }}
        />


      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Bio</Text>
     <TextInput
      placeholder='Bio'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.bio : ''}
      onChangeText={(text) => setUser({...user, bio:text})}
      autoCorrect={false}
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          paddingLeft:15,
          paddingHorizontal:10,
          fontFamily:'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Email</Text>
      <TouchableOpacity onPress={() => Alert.alert(
        'Warning',
       'You cannot change your email because it is your account number.')}>
      <Text
      fontSize={14}
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          marginBottom:30,
          padding:15,
          fontFamily:'Inter-Medium',
          color:'#949494',
        }}>
        {user ? user.email || 'N/A' : ''}
      </Text>
      </TouchableOpacity>

      
      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:16,
        marginBottom:11,
      }}>Password</Text>
      <TouchableOpacity onPress={() => Alert.alert(
        'Warning',
        'Are you sure to change the password?',
        [
          {text: 'Confirm', style: 'cancel', onPress: () => {navigation.navigate('Reset Password')}},
          {text: 'Cancel', style: 'destructive', onPress: () => console.log('Cancel Pressed')}
        ],
        { cancelable: false }
      )}>
      <Text
        style={{
          borderWidth:1,
          height:44,
          width:342,
          borderColor:'#D3D3D3',
          borderRadius:6,
          width:350,
          marginBottom:30,
          padding:10,
          paddingTop:15,
          alignItems:'center',
          color:'#544C4C'
        }}>
        ********
      </Text>
      </TouchableOpacity>
    </View>
    
      <TouchableOpacity style={{
          backgroundColor:'#FFBC11',
          borderRadius:6,
          alignSelf:'center',
          alignItems:'center',
          width:221,
          height:45,
          justifyContent:'center'
        }}
          onPress={handleUpdate}>
          <Text style={{
            fontFamily:'Inter-Medium',
            fontSize:20,
            color:'white'
          }}>Save Changes</Text>
        </TouchableOpacity>  
  </ScrollView>
  </KeyboardAwareScrollView>  
  )
}

export default ProfileEditScreen