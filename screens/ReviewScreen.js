import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import StarRating from 'react-native-star-rating-widget';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
    <Text style={styles.collectionName}>{item.username}</Text>
    </View>
    <StarRating
    enableSwiping={false}
    style={{
      position: 'absolute',
      top: hp('4.98%'),
      left: wp('17.95%'),
    }}
    starStyle={{
      marginLeft: wp('-1.28%')
    }}
    starSize={wp('5.13%')}
      rating={item.rating} />
    <Text style={styles.description}>{item.description}</Text>
    <ScrollView  horizontal={true} style={{ width: wp('76.92%'), flexDirection: 'row', marginLeft: wp('12.82%')}}>
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
      contentContainerStyle={{ alignContent: 'flex-start', paddingBottom: hp('7.11%') }}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
    <StatusBar barStyle={'dark-content'} />
      {reviewed.length > 0 ? (
        <FlatList
        style={{ alignSelf: 'stretch' }}
        contentContainerStyle={{ paddingHorizontal: wp('2.56%'), paddingBottom: hp('1.18%') }}
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
    marginTop: hp('2.37%'),
    fontSize: wp('3.59%'),
  },
  buttonContainer: {
    marginTop: hp('1.18%'),
    borderRadius: 20,
    width: wp('25.64%'),
    height: hp('4.74%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#949494',
  },
  buttonText: {
    fontFamily: 'Inter-Regular',
  },
  collectionCard: {
    marginBottom: hp('1.18%'),
    marginHorizontal: wp('1.28%'),
    backgroundColor: '#ECF1FF',
    borderRadius: 15,
    elevation: 2,
    paddingHorizontal: wp('2.56%'),
    paddingVertical: hp('1.78%'),
  },
  collectionName: {
    left: wp('2.05%'),
    top: hp('0.29%'),
    fontFamily: 'Inter-Medium',
    fontSize: wp('4.36%'),
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.59%'),
    left: wp('14.87%'),
    color: 'black',
    marginBottom: hp('1.18%'),
    marginTop: hp('0.59%'),
    lineHeight: hp('2.37%'),
  },
  businessImage: {
    width: wp('23.08%'),
    height: wp('23.08%'),
    borderRadius: 15,
    marginLeft: wp('2.56%'),
    marginBottom: hp('0.59%'),
  },
  userImage: {
    width: wp('12.82%'),
    height: wp('12.82%'),
    borderRadius: 25,
  }
});
