import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import CheckBox from '../CheckBoxComponent'


const FilterScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inder-Regular": require('../assets/fonts/Inder-Regular.ttf')
  });
  
  const [now, setNow] = useState(false);
  const [otherTimePeriod, setOtherTimePeriod] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [typeTheLocation, setTypeTheLocation] = useState(false);
  const [price1, setPrice1] = useState(false);
  const [price2, setPrice2] = useState(false);
  const [price3, setPrice3] = useState(false);
  const [price4, setPrice4] = useState(false);
  const [price5, setPrice5] = useState(false);
  const [price6, setPrice6] = useState(false);

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
      <View style={styles.title}>
        <Text style={styles.titleText}>
          Select Your Preferences
        </Text>
        <TouchableOpacity onPress={() => {navigation.navigate('User Profile')}}>
        <Image
          source={require('../assets/images/users/Default_pfp.jpg')} 
          style={{
            marginLeft:40,
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
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setNow(!now)}
        isChecked={now}
      />
        <Text style={styles.inputText}>Now</Text>
        </View>
      </View>

      <View
        style={styles.buttonContainer1} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setOtherTimePeriod(!otherTimePeriod)}
        isChecked={otherTimePeriod}
      />
        <Text style={styles.inputText}>Other Time Period</Text>
        </View>
      </View>

      <View style={styles.subTitle}>
        <Text style={styles.subtitleText}>
          Location Range
        </Text>
      </View> 

      <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setNearMe(!nearMe)}
        isChecked={nearMe}
      />
        <Text style={styles.inputText}>Near Me</Text>
        </View>
      </View>

      <View
        style={styles.buttonContainer1} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <TextInput 
        placeholder='Type the Location'
        placeholderTextColor={'#4F200D'}
        style={{
          marginLeft:33,
          alignItems:'center',
          fontFamily:'Inder-Regular',
          fontSize:20,
          color:'#4F200D',
        }}></TextInput>
        </View>
      </View>


      <View style={styles.subTitle}>
        <Text style={styles.subtitleText}>
          Price Range
        </Text>
      </View> 

      <View style={{flexDirection:'row'}}>
      <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setPrice1(!price1)}
        isChecked={price1}
      />
        <Text style={styles.inputText}>$0-10  </Text>
        </View>
      </View>

      <View
        style={styles.buttonContainer2} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setPrice2(!price2)}
        isChecked={price2}
      />
        <Text style={styles.inputText}>$10-20</Text>
        </View>
      </View>
      </View>

      <View style={{flexDirection:'row'}}>
      <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setPrice3(!price3)}
        isChecked={price3}
      />
        <Text style={styles.inputText}>$20-30</Text>
        </View>
      </View>
      

      <View
        style={styles.buttonContainer2} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setPrice4(!price4)}
        isChecked={price4}
      />
        <Text style={styles.inputText}>$30-40</Text>
        </View>
      </View>
      </View>

      <View style={{flexDirection:'row'}}>
      <View
        style={styles.buttonContainer} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setPrice5(!price5)}
        isChecked={price5}
      />
        <Text style={styles.inputText}>$40-50</Text>
        </View>
      </View>

      <View
        style={styles.buttonContainer2} onLayout={onLayoutRootView}>
        <View style={styles.group}>
        <CheckBox
        onPress={() => setPrice6(!price6)}
        isChecked={price6}
      />
        <Text style={styles.inputText}>$50+++</Text>
        </View>
      </View>
      </View>

      <View style={{
        alignItems:'center',
        marginTop:20,
      }}
      onLayout={onLayoutRootView}>
        <TouchableOpacity style={{
          backgroundColor:'#FFCE84',
          width:256,
          height:48,
          alignItems:'center',
          justifyContent:'center',
          borderRadius:10,
        }}
          onPress={() => {navigation.navigate('Main')}}>
          <Text style={{
            fontFamily:'Inder-Regular',
            fontSize:20,
            color:'#4F200D'
          }}>See Recommendations!</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
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
    marginLeft:32,
    marginBottom:10,
  },
  subtitleText:{
    fontFamily:'Inter-Bold',
    fontSize:26,
    letterSpacing:0.5,
    color:'#4F200D'
  },
  buttonContainer:{
    width:140,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:40,
  },
  buttonContainer1:{
    width:230,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:40,
  },
  buttonContainer2:{
    width:140,
    backgroundColor:'#FFCE84',
    borderRadius:10,
    marginBottom:10,
    marginLeft:20,
    
  },
  inputContainer:{
    flexDirection:'row',
    justifyContent:'center',
  },
  inputText:{
    alignItems:'center',
    fontFamily:'Inder-Regular',
    fontSize:20,
    color:'#4F200D',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  group:{
    flexDirection:'row',
    marginTop:10,
    marginBottom:10,
  }
})