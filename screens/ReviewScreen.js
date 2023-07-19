import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import StarRating from 'react-native-star-rating-widget';

const ReviewScreen = ({route}) => {
  const {business} = route.params;
  const navigation = useNavigation();
  
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

  const [reviewed, setReviewed] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection('Review List')
      .where('business', '==', business.name)
      .where('phone', '==', business.phone)
      .onSnapshot((snapshot) => {
        const reviewData = snapshot.docs.map((doc) => doc.data());
        setReviewed(reviewData);
        console.log(reviewData)
      });

    return () => unsubscribe();
  }, []);

  const renderReviewed = ({ item }) => (
    <View style={styles.collectionCard}>
    <View style={{flexDirection:'row'}}>
    <Image style={styles.userImage} source={{ uri: item.userImage }} />
    <Text style={styles.collectionName}>{item.business}</Text>
    </View>
    <StarRating
    enableSwiping={false}
    style={{
      position:'absolute',
      top:42,
      left:70,
    }}
    starStyle={{
      marginLeft:-5
    }}
    starSize={20}
      rating={item.rating} />
    <Text style={styles.description}>{item.description}</Text>
    <ScrollView  horizontal={true} style={{width:300, flexDirection:'row', marginLeft:50}}>
    {Object.keys(item).map(key => {
        if (key.startsWith('photo')) {
          return <Image key={key} style={styles.businessImage} source={{ uri: item[key] }} />;
        }
        return null;
      })}
    </ScrollView>
    </View>
  );

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
    <View
      style={{ flex: 1 }}
      contentContainerStyle={{ alignContent: 'flex-start', paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
      {reviewed.length > 0 ? (
        <FlatList
        style={{ alignSelf: 'stretch' }}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
        data={reviewed}
        renderItem={renderReviewed}
      />
    ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>There are no reviews here yet.</Text>
        </View>
      )}
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    color: '#949494',
    marginTop: 20,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#949494',
  },
  buttonText: {
    fontFamily: 'Inter-Regular',
  },
  collectionCard: {
    marginBottom: 10,
    marginHorizontal: 5,
    backgroundColor: '#ECF1FF',
    borderRadius: 15,
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  collectionName: {
    left:8,
    top:5,
    fontFamily: 'Inter-Medium',
    fontSize: 17,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    left:58,
    color: 'black',
    marginBottom: 10,
    marginTop:5,
    lineHeight: 20,
  },
  businessImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginLeft:10,
    marginBottom: 5,
  },
  userImage: {
    width:50,
    height:50,
    borderRadius:25,
  }
});
