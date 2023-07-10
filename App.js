import { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from './screens/Header';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ActivityScreen from './screens/ActivityScreen';
import FilterScreen from './screens/FilterScreen';
import RecommendationScreen from './screens/RecommandationScreen';
import DetailScreen from './screens/DetailScreen';
import ReviewScreen from './screens/ReviewScreen';
import TemporaryCollectionListScreen from './screens/TemporaryCollectionListScreen';
import PermanentCollectionListScreen from './screens/PermanentCollectionListScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import ReviewPostingScreen from './screens/ReviewPostingScreen';
import UserOwnReviewsScreen from './screens/UserOwnReviewsScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import BackgroudSettingScreen from './screens/BackgroudSettingScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import UserImageSettingScreen from './screens/UserImageSettingScreen';
import PasswordResettingScreen from './screens/PasswordResettingScreen';
import * as WebBrowser from "expo-web-browser";
import { firebase } from './config';
import 'expo-dev-client';
import VisitedPlaceListScreen from './screens/VisitedPlaceListScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import ActionSheet from './ActionSheet';
import ActionSheetUpRightCorner from './ActionSheetUpRightCorner';
import AfterChoosingScreen from './screens/AfterChoosingScreen';
import * as ImagePicker from 'expo-image-picker';
import * as SplashScreen from 'expo-splash-screen';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function App() {
  const navigation = useNavigation();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const handleSignOut = () => {
    firebase.auth().signOut();
  }
  
  const actionItems = [
    {
      id: 1,
      label: 'Edit Profile',
      onPress: () => {navigation.navigate('Edit Profile'); setActionSheet(false)
      }
    },
    {
      id: 2,
      label: 'Log Out',
      onPress: () => {Alert.alert(
        'Warning',
        'Are you sure to log out?',
        [
          {text: 'Confirm', style: 'cancel', onPress: () => {handleSignOut()}},
          {text: 'Cancel', style: 'destructive', onPress: () => console.log('Cancel Pressed')}
        ]); setActionSheet(false)}
    },
  ];
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible:false
        }}>

        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown:false, contentStyle:{backgroundColor:"#F8F6F4"} }} />
        <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown:false, contentStyle:{backgroundColor:"#F8F6F4"} }} />
        <Stack.Screen 
        name="Reset Password" 
        component={PasswordResettingScreen}
        options={{ 
          headerTitle: () => <Header name='Reset Password' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible:false
      }}>
      <Stack.Screen 
        name="Activity" 
        component={ActivityScreen} 
        options={{ 
          headerShown: false, 
          contentStyle:{backgroundColor:"#F8F6F4"} 
        }}/>
      <Stack.Screen 
        name="Filter" 
        component={FilterScreen} 
        options={{ 
          headerShown: false, 
          contentStyle:{
            backgroundColor:"#FFF3E7"} 
        }} />
      <Stack.Screen 
        name="Main" 
        component={RecommendationScreen} 
        options={{
          headerTitle:'',
          headerTransparent:true,
          headerLeft: () => ( 
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#E2F7FF'
          },
          contentStyle:{
            backgroundColor:"#E2F7FF"
          }
        }}/>
      <Stack.Screen 
        name="Details" 
        component={DetailScreen} 
        options={{ 
          headerTitle: () => <Header name='Details' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      <Stack.Screen 
        name="Review" 
        component={ReviewScreen} 
        options={{ 
          headerTitle: () => <Header name='Name' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#E2EAFE'
          },
          contentStyle:{
            backgroundColor:"#ECF1FF"
          }
        }}/>
        <Stack.Screen 
        name="After Choosing" 
        component={AfterChoosingScreen} 
        options={{ 
          headerShown:false, 
          contentStyle:{
            backgroundColor:"#F8F6F4"
          } 
        }}/>
      <Stack.Screen 
        name="TCL" 
        component={TemporaryCollectionListScreen} 
        options={{ 
          contentStyle:{
            backgroundColor:"#E3F8D9"
          } 
        }}/>
      <Stack.Screen 
        name="PCL" 
        component={PermanentCollectionListScreen} 
        options={{ 
          headerTitle: () => <Header name='Collections' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      <Stack.Screen 
        name="User Profile" 
        component={UserProfileScreen} 
        options={{ 
          headerTitle: () => <Header name='' />,
          headerTransparent:true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setActionSheet(true)}>
                <Entypo name='dots-three-horizontal' size={24} color='#000' />
              </TouchableOpacity>
              <Modal
                isVisible={actionSheet}
                backdropOpacity={0}
                
                style={{
                  margin: 0,
                  justifyContent: 'flex-end'
                }}
              >
              <ActionSheet
                actionItems={actionItems}
                onCancel={closeActionSheet}
              />
              </Modal>
            </View>
          ),
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
        <Stack.Screen 
        name="Edit Profile" 
        component={ProfileEditScreen} 
        options={{ 
          headerTitle: () => <Header name='Edit Profile' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
        <Stack.Screen 
        name="Reset Password" 
        component={PasswordResettingScreen}
        options={{ 
          headerTitle: () => <Header name='Reset Password' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      <Stack.Screen 
        name="Background" 
        component={BackgroudSettingScreen} 
        options={{
          headerTitle: () => <Header name='Background' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            height:150,
            backgroundColor:'#F8F6F4',
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      <Stack.Screen 
        name="User Image" 
        component={UserImageSettingScreen} 
        options={{
          headerTitle: () => <Header name='Photo' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setActionSheet(true)}>
                <Entypo name='dots-three-horizontal' size={24} color='#000' />
              </TouchableOpacity>
              <Modal
                isVisible={actionSheet}
                style={{
                  margin: 0,
                  justifyContent: 'flex-end'
                }}
              >
              <ActionSheet
                actionItems={actionItems}
                onCancel={closeActionSheet}
              />
              </Modal>
            </View>
          ),
            headerStyle:{
              height:150,
              backgroundColor:'#F8F6F4',
            },
            
            contentStyle:{
              backgroundColor:"#F8F6F4"
            }
        }}/>
      <Stack.Screen 
        name="Feedback" 
        component={FeedbackScreen} 
        options={{ 
          headerShown:false, 
          contentStyle:{
            backgroundColor:"#F8F6F4"
          } 
        }}/>
      <Stack.Screen 
        name="Review Posting" 
        component={ReviewPostingScreen} 
        options={{ 
          headerTitle: () => <Header name='Post Reviews' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      <Stack.Screen 
        name="My Reviews" 
        component={UserOwnReviewsScreen} 
        options={{ 
          headerTitle: () => <Header name='My Reviews' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
      <Stack.Screen 
        name="Visited" 
        component={VisitedPlaceListScreen} 
        options={{ 
          headerTitle: () => <Header name='Places' />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerStyle:{
            backgroundColor:'#F8F6F4'
          },
          contentStyle:{
            backgroundColor:"#F8F6F4"
          }
        }}/>
    </Stack.Navigator>
  );
}

  export default () => {
    return (
      <NavigationContainer>
        <App />
      </NavigationContainer>
    )
  }
