import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useFocusEffect } from '@react-navigation/native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

SplashScreen.preventAutoHideAsync();

const ActivityScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      getUser();
      removeAll();
    }, [navigation])
  )

  const [selectedCategory, setSelectedCategory] = useState('')

  const navigation = useNavigation()

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
  });

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

  const removeAll = () => {
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userId).collection("Star List")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Delete the document from the star list
        doc.ref.delete()
          .then(() => {
            console.log('Star list cleared!');
          })
          .catch((error) => {
            console.error('Error clearing Star List:', error);
          });
      });
    })
    .catch((error) => {
      console.error('Error querying saved places in star list:', error);
    });
  }

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
            Looking for?
          </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
          <Image
            source={{uri: user ? user.image || 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg' : 'https://raw.githubusercontent.com/Eleanoritsme/Orbital-Assets/main/Default_pfp.jpg'}}
            style={{
              marginLeft:wp('10.26%'),
              width:wp('23.08%'),
              height:wp('23.08%'),
              borderRadius:200,
              bottom:wp('1.28%'),
            }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => 
            {setSelectedCategory("cafe+free+wifi");
              navigation.navigate('Filter', {selectedCategory});
              }}
            style={styles.buttonInput}>
            <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Study</Text>
            <Image style={styles.inputImage}
            source={require('../assets/images/misc/Study.png')}/>
            </View>
          </TouchableOpacity> 
          </View>

          <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => 
            { setSelectedCategory("cafe+free+wifi");
              navigation.navigate('Filter', {selectedCategory})}}
            style={styles.buttonInput}>
            <View style={styles.inputContainer}>
            <Image style={styles.inputImage}
            source={require('../assets/images/misc/Work.png')}/>
            <Text style={styles.inputText}>Work</Text>
            </View>
          </TouchableOpacity> 
          </View>

          <View
          style={styles.buttonContainer} onLayout={onLayoutRootView}>
          <TouchableOpacity
            onPress={() => 
            {setSelectedCategory('restaurants+cafe')
              navigation.navigate('Filter', {selectedCategory})}}
              style={styles.buttonInput}>
            <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Eat</Text>
            <Image style={styles.inputImage}
            source={require('../assets/images/misc/Eat.png')}/>
            </View>
          </TouchableOpacity> 
          </View> 
      </SafeAreaView>
    </ScrollView>
  )
}



const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const scaleFactor = 0.1;

const styles = StyleSheet.create({
  title:{
    flexDirection: 'row',
    marginTop: hp('2.37%'),
    marginLeft: wp('6.41%'),
    marginBottom: hp('4.74%'),
    width: wp('65.9%'),
    height: hp('9.36%'),
  },
  titleText:{
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1,
    marginTop: hp('1.78%'),
    fontSize: wp('8.21%'),
  },
  buttonContainer:{
    alignItems: 'center',
    marginBottom: hp('3.55%'),
  },
  buttonInput:{
    borderColor: '#212A3E',
    borderWidth: 2.5,
    borderRadius: 20,
    shadowColor: '#BBAAAA', 
    shadowOffset: { height: 4, width: 0 }, 
    shadowOpacity: 1, 
    shadowRadius: 1, 
    backgroundColor: '#FFF4E5',
    width: wp('89.74%'),
    height: hp('20.5%'),
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('5.13%'),
    marginRight: wp('5.13%'),
  },
  inputImage:{
    width: wp('36.15%'),
    height: hp('20.39%'),
    resizeMode: 'contain',
  },
  inputText:{
    fontFamily: 'Inter-ExtraBold',
    fontSize: wp('9.23%'),
    letterSpacing: 1,
    textAlign: 'center',
    color: '#00060C',
    height: hp('5.92%'),
    width: wp('32.31%'),
    marginLeft: wp('5.13%'),
    marginRight: wp('5.13%'),
  }
})

export default ActivityScreen