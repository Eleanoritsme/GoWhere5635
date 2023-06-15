import { View, Text, Image} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const RecommandationScreen = ({route}) => {
  const {recommendations} = route.params;

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {recommendations && recommendations.businesses && recommendations.businesses.map((item, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Image source={{ uri: item.image_url }} style={{ width: 100, height: 100 }} />
              <Text>{item.name}</Text>
              <Text>{item.location.address1}</Text>
              {/* Add more fields as needed */}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default RecommandationScreen