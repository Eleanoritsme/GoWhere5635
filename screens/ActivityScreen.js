import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useFocusEffect } from '@react-navigation/native'

SplashScreen.preventAutoHideAsync();

const ActivityScreen = () => {

  useFocusEffect(
    React.useCallback(() => {
      getUser();
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
            Looking for?
          </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
          <Image
            source={require('../assets/images/users/Default_pfp.jpg')} 
            style={{
              marginLeft:40,
              width:90,
              height:90,
              borderRadius:400 / 2,
              bottom:8

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
            { setSelectedCategory('restaurants+cafe')
              navigation.navigate('Filter', {selectedCategory})}}
              style={styles.buttonInput}>
            <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Eat</Text>
            <Image style={styles.inputImage}
            source={require('../assets/images/misc/Eat.png')}/>
            </View>
          </TouchableOpacity> 
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  title:{
    flexDirection:'row',
    marginTop:20,
    marginLeft:25,
    marginBottom:40,
    width:257,
    height:79,
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    letterSpacing:1,
    marginTop:15,
    fontSize: 32,
  },
  buttonContainer:{
    alignItems:'center',
    marginBottom:30,
  },
  buttonInput:{
    borderColor:'#212A3E',
    borderWidth:2.5,
    borderRadius:20,
    shadowColor: '#BBAAAA', 
    shadowOffset: { height: 4, width: 0 }, 
    shadowOpacity: 1, 
    shadowRadius: 1, 
    backgroundColor:'#FFF4E5',
    width:350,
    height:173,
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:20,
    marginRight:20,
  },
  inputImage:{
    width:141,
    height:172,
    resizeMode:'contain',
  },
  inputText:{
    fontFamily:'Inter-ExtraBold',
    fontSize:36,
    letterSpacing:1,
    textAlign:'center',
    color:'#00060C',
    height:50,
    width:126,
    marginLeft:20,
    marginRight:20,
  }
})

