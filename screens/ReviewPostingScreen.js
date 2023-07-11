import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaView } from 'react-native-safe-area-context'

import CheckSquare from '../CheckSquareComponent'
import Entypo from 'react-native-vector-icons/Entypo'
import StarRating from 'react-native-star-rating-widget'


const ReviewPostingScreen = () => {
  const navigation = useNavigation()
  const [yes, setYes] = useState(false);
  const [no, setNo] = useState(false);
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5])

  const starFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png'
  const starOutline = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'

  const CustomRatingBar = () => {
    return (
      <View style={{
        justifyContent:'center',
        flexDirection:'row',
        marginTop:30,
        backgroundColor:'#FFFFFF',
        borderRadius:40,
        height:60,
        width:280,
        alignItems:'center',        
        marginLeft:25,
        position:'absolute',
        top:270,
        shadowColor: '#D8D8D8', 
        shadowOffset: { height: 1, width: 0 }, 
        shadowOpacity: 1, 
        shadowRadius: 6, 
      }}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}
                style={{
                marginRight:10,
                }}
              >
                <Image 
                  style={{
                    width:40,
                    height:40,
                    resizeMode:'cover'
                  }}
                  source={
                    item <= defaultRating ? {uri: starFilled} : {uri: starOutline}
                  } 
                />
                </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter-Medium.ttf'),
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
    <ScrollView>
    <View
    style={{
      flex:1
    }}
    onLayout={onLayoutRootView}>
      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:20,
        letterSpacing:1,
        lineHeight:30,
        marginBottom:15,
        marginTop:10,
        width:340,
        alignSelf:'center',
      }}>What’s your experience with this recommendation?</Text>
      <TextInput
      placeholder='Descriptions'
      style={{
        alignSelf:'center',
        height:159,
        width:340,
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        paddingHorizontal:10,
        paddingBottom:120,
        fontSize:16,
        fontFamily:'Inter-SemiBold',
        letterSpacing:1,
        lineHeight:30,
        marginBottom:15,
      }}> 
      </TextInput>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:20,
        letterSpacing:1,
        lineHeight:30,
        marginBottom:85,
        width:340,
        alignSelf:'center',
      }}>Overall</Text>
      <CustomRatingBar />

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:20,
        letterSpacing:1,
        lineHeight:30,
        marginBottom:15,
        width:340,
        alignSelf:'center',
      }}>Would you like to "star" it for the next visit?</Text>
      <View style={{
        flexDirection:'row',
        left:30,
        marginBottom:15,
      }}>
      <CheckSquare
        onPress={() => setYes(!yes)}
        isChecked={yes}
      />
        <Text style={{
          fontFamily:'Inter-ExtraBold',
          fontSize:18,
          letterSpacing:1,
          marginRight:60,
          alignSelf:'center',
        }}>Yes</Text>
        <CheckSquare
        onPress={() => setNo(!no)}
        isChecked={no}
      />
        <Text style={{
          fontFamily:'Inter-ExtraBold',
          fontSize:18,
          letterSpacing:1,
          alignSelf:'center',
        }}>No</Text>
      </View>

      <Text style={{
        fontFamily:'Inter-Bold',
        fontSize:20,
        letterSpacing:1,
        lineHeight:30,
        marginBottom:15,
        width:340,
        alignSelf:'center',
        marginTop:10,
      }}>Upload Photos (Optional)</Text>

      <View style={{
        flexDirection:'row',
        alignSelf:'center',
        marginBottom:20,
      }}>
      
      <TouchableOpacity style={{
        width:100,
        height:100,
        borderRadius:10,
        backgroundColor:'#FCFCFC',
        marginRight:10,
      }}>
      <Entypo name='plus' size={44} color='#C9C9C9' style={{left:28, top:28}}/>
      </TouchableOpacity>
      
      <TouchableOpacity style={{
        width:100,
        height:100,
        borderRadius:10,
        backgroundColor:'#FCFCFC',
        marginRight:10,
      }}>
      <Entypo name='plus' size={44} color='#C9C9C9' style={{left:28, top:28}}/>
      </TouchableOpacity>

      <TouchableOpacity style={{
        width:100,
        height:100,
        borderRadius:10,
        backgroundColor:'#FCFCFC',
        marginRight:10,
      }}>
      <Entypo name='plus' size={44} color='#C9C9C9' style={{left:28, top:28}}/>
      </TouchableOpacity>
      
      </View>

      <TouchableOpacity style={{
          backgroundColor:'#FFCE84',
          width:256,
          height:48,
          alignItems:'center',
          justifyContent:'center',
          borderRadius:10,
          alignSelf:'center',
        }}
          onPress={() => {navigation.navigate('Feedback')}}>
          <Text style={{
            fontFamily:'Inder-Regular',
            fontSize:20,
            color:'#4F200D'
          }}>Submit My Review</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

export default ReviewPostingScreen