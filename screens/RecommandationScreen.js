import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { AntDesign } from 'react-native-vector-icons'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const RecommandationScreen = ({route}) => {
  const {recommendations} = route.params;

  const navigation = useNavigation()

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
      <ScrollView>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
        <Image
          source={require('../assets/images/users/Default_pfp.jpg')} 
          style={{
            marginLeft:"70%",
            width:90,
            height:90,
            borderRadius:400 / 2
          }}
          />
          </TouchableOpacity>
        </View>
        <View>
        {recommendations && recommendations.businesses && recommendations.businesses.map((item, index) => (
            <View key={index} style={styles.listContainer} onLayout={onLayoutRootView}>
              <TouchableOpacity>
                <Image source={{ uri: item.image_url }} style={styles.image}/>
                <Text style={styles.inputText1}>{item.name}</Text>
              </TouchableOpacity>
              <Text style={styles.inputText2}>
                {item.location.address1}
                {item.location.address2}
                {item.location.address3}
                {item.location.address3} </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default RecommandationScreen

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
    width:220,
    marginTop: -175,
    marginLeft: -30,
    fontFamily:'Inter-Bold',
    fontSize:20,
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
  resetPswButton:{
    color:"#B04759", 
    fontWeight:'600', 
    fontSize:14,
  },
  image:{
    borderRadius:10,
    marginLeft: '63%',
    marginTop:80,
    width: 160,
    height: 120,
  }
})