import { Text, TouchableOpacity, View, Image, Alert, ScrollView, TextInput, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { firebase } from '../config';
import * as SplashScreen from 'expo-splash-screen'
import Entypo from 'react-native-vector-icons/Entypo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-element-dropdown'
import axios from 'axios'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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

  const handleUpdate = async () => {
    const updatedData = {
      userName: user.userName,
      dateOfBirth: user.dateOfBirth,
      occupation: user.occupation,
      bio: user.bio,
    };
  
    if (countryName !== null) {
      updatedData.country = countryName;
    }
  
    if (cityName !== null) {
      updatedData.city = cityName;
    }
  
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .update(updatedData)
      .then(() => {
        console.log('User data updated!');
        Alert.alert(
          'Changes Saved!',
          'Your profile has been updated successfully.',
          [
            {
              text: 'Back',
              onPress: () => {
                navigation.navigate('User Profile');
              },
              style: 'cancel',
            },
          ]
        );
      })
      .catch((error) => {
        console.log('Error updating user data:', error);
      });
  };
  

  

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
    style={{flex: 1}}
    extraScrollHeight={hp('14.22%')}
    keyboardVerticalOffset={wp('17.95%')}
    enableResetScrollToCoords={false}
    >
    <StatusBar barStyle={'dark-content'} />
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{alignContent:'flex-start', paddingBottom:hp('7.11%')}}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    <TouchableOpacity
      onPress={() => navigation.navigate('User Image')}
      style={{
        alignItems: 'center',
        marginBottom: hp('3.55%'),
      }}>
      <Image 
        style={{
          height: wp('34.62%'),
          width: wp('34.62%'),
          borderRadius: 75,
          marginTop: hp('1.18%'),
        }}
        source={{uri: user ? user.image : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}} />
      <View style={{
        position:'absolute',
        contentContainerStyle:''
      }}>
        <Entypo name='camera' size={wp('7.69%')} color='#FFBC11' style={{top: hp('13.03%'), left: wp('14.1%')}} />
      </View>
    </TouchableOpacity>
    <View
      style={{
        left: wp('5.13%')
      }}>
      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>User Name</Text>
      <TextInput
      placeholder='User Name'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.userName : ''}
      autoCorrect={false}
      autoCapitalize='none'
      onChangeText={(text) => setUser({...user, userName:text})}
      fontSize={wp('3.59%')}
        style={{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily: 'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>Date Of Birth</Text>
      <TextInput
      placeholder='Date Of Birth'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.dateOfBirth : ''}
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, dateOfBirth:text})}
      fontSize={wp('3.59%')}
        style={{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily: 'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>Occupation</Text>
      <TextInput
      placeholder='Occupation'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.occupation : ''}
      autoCorrect={false}
      onChangeText={(text) => setUser({...user, occupation:text})}
      fontSize={wp('3.59%')}
        style={{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily: 'Inter-Medium'
        }}>
      </TextInput>
  
      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>Country/Region</Text>
      <Dropdown
        style={[{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily: 'Inter-Medium'
          }, { borderColor: '#D3D3D3' }]}
          placeholderStyle={{fontSize: wp('3.59%'), color:"black", fontFamily:'Inter-Medium'}}
          selectedTextStyle={{fontSize: wp('3.59%'), fontFamily:'Inter-Medium'}}
          inputSearchStyle={ {
            height: hp('4.74%'),
            fontSize: wp('3.59%'),
            }}
          iconStyle={{
            width: wp('5.13%'),
            height: wp('5.13%'),
          }}
          data={countryData}
          search
          maxHeight={hp('35.55%')}
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

      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>City</Text>
      <Dropdown
        style={[{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily: 'Inter-Medium'
          }, { borderColor: '#D3D3D3' }]}
          placeholderStyle={{fontSize: wp('3.59%'), color:"black", fontFamily:'Inter-Medium'}}
          selectedTextStyle={{fontSize: wp('3.59%'), fontFamily:'Inter-Medium'}}
          inputSearchStyle={ {
            height: hp('4.74%'),
            fontSize: wp('3.59%'),
            }}
          iconStyle={{
            width: wp('5.13%'),
            height: wp('5.13%'),
          }}
          data={cityData}
          search
          maxHeight={hp('35.55%')}
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
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>Bio</Text>
     <TextInput
      placeholder='Bio'
      placeholderTextColor={'#D3D3D3'}
      value={user ? user.bio : ''}
      onChangeText={(text) => setUser({...user, bio:text})}
      autoCorrect={false}
      fontSize={wp('3.59%')}
        style={{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          paddingLeft: wp('3.85%'),
          paddingHorizontal: wp('2.56%'),
          fontFamily: 'Inter-Medium'
        }}>
      </TextInput>

      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
      }}>Email</Text>
      <TouchableOpacity onPress={() => Alert.alert(
        'Warning',
       'You cannot change your email because it is your account number.')}>
      <Text
      fontSize={wp('3.59%')}
        style={{
          borderWidth: 1,
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          marginBottom: hp('3.55%'),
          padding: wp('3.85%'),
          fontFamily:'Inter-Medium',
          color:'#949494',
        }}>
        {user ? user.email || 'N/A' : ''}
      </Text>
      </TouchableOpacity>

      
      <Text style={{
        fontFamily: 'Inter-Bold',
        fontSize: wp('4.1%'),
        marginBottom: hp('1.3%'),
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
          height: hp('5.21%'),
          width: wp('87.69%'),
          borderColor: '#D3D3D3',
          borderRadius: 6,
          width: wp('89.74%'),
          marginBottom: hp('3.55%'),
          padding: hp('1.18%'),
          paddingTop: hp('1.78%'),
          alignItems: 'center',
          color: '#544C4C'
        }}>
        ***********
      </Text>
      </TouchableOpacity>
    </View>
    
      <TouchableOpacity style={{
          backgroundColor: '#FFBC11',
          borderRadius: 6,
          alignSelf: 'center',
          alignItems: 'center',
          width: wp('56.67%'),
          height: hp('5.33%'),
          justifyContent: 'center'
        }}
          onPress={handleUpdate}>
          <Text style={{
            fontFamily: 'Inter-Medium',
            fontSize: wp('5.13%'),
            color: 'white'
          }}>Save Changes</Text>
        </TouchableOpacity>  
  </ScrollView>
  </KeyboardAwareScrollView>  
  )
}

export default ProfileEditScreen
