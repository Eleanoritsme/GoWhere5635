import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const DetailScreen = () => {
  const navigation = useNavigation()
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
    <SafeAreaView>
    <View style={{
      flexDirection:'row',
      marginBottom:20,
      }}>
      <View style={{
        flexDirection:'row', 
        left:20,
      }}>
      <Image style={{
        alignSelf:'center',
        marginRight:10,
        width:30,
        height:30,
      }}
      source={require('../assets/images/misc/StarFilled.png')} />
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:28,
      }}>Name</Text>
      </View>
      <View 
      style={{
        left:90,
        width:163,
        height:111,
        backgroundColor:'#E2E2E2',
        borderRadius:10,
      }}></View>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Location.png')} />
        <Text>

        </Text>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Phone.png')} />
        <Text>
          
        </Text>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Peak.png')} />
        <Text style={{
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          Currently Under  Hour
        </Text>
      </View>
      <View style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Price.png')} />
        <Text style={{
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          $
        </Text>
      </View>
      <TouchableOpacity 
      onPress={() => {navigation.navigate('Review')}}
      style={{
        left:20,
        flexDirection:'row',
        marginBottom:60,
      }}>
        <Image style={{
          marginRight:10,
        }}
        source={require('../assets/images/misc/Rating.png')} />
        <Text style={{
          textDecorationLine:'underline',
          fontFamily:'Inter-Regular',
          fontSize:15,
          alignSelf:'center',
        }}>
          See Reviews
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{
        top:30,
        width:365,
        height:50,
        backgroundColor:'#92BDFF',
        alignSelf:'center',
        borderRadius:14,
        justifyContent:'center',
      }}
      onPress={() => {navigation.navigate('After Choosing')}}>
      <Text style={{
        alignSelf:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:17,
        lineHeight:22,
      }}>Choose this!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default DetailScreen

