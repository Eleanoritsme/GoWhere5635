import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const RecommandationScreen = ({route}) => {
  const {recommendations} = route.params;

  const navigation = useNavigation()

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
        <View>
          {recommendations && recommendations.businesses && recommendations.businesses.map((item, index) => (
            <View key={index} style={{ marginBottom: 20}}>
              <Image source={{ uri: item.image_url }} style={{ width: 100, height: 100 }} />
              <Text>{item.name}</Text>
              <Text>{item.location.address1}</Text>
              <Text>{item.location.address2}</Text>
              <Text>{item.location.address3}</Text>
              <Text>{item.location.address3}</Text>
              <Text>{item.rating}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default RecommandationScreen