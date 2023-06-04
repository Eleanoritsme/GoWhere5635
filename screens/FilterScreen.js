import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'

const FilterScreen = () => {

  let [fontsLoaded] = useFonts({
    "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf')
  });
  
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <SafeAreaView>
      <View style={styles.title}>
        <Text style={styles.titleText}>
          Select Your Preferences
        </Text>
      </View>

      <View style={styles.option}>
        <Text style={styles.filterOptions}>
          Time Range
        </Text>
      </View>
    </SafeAreaView>

  )
}

export default FilterScreen

const styles = StyleSheet.create({
  title:{
    marginLeft:20,
    marginTop:20,
    marginBottom:40
  },
  titleText:{
    fontFamily:'Inter-ExtraBold',
    fontSize: 50,
  },
  filterOptions:{
    fontFamily:'Inter-Bold',
    fontSize: 50,
  }
})