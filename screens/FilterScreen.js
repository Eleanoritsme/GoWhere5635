import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const FilterScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.title}>
        <Text>Select Your Preferences</Text>
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
})