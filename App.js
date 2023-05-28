import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ActivityScreen from './screens/ActivityScreen';
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { firebase } from './config';

WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

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
          headerShown: false
        }}>
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Register" component={RegistrationScreen} />
      </Stack.Navigator>
    );
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen options={{ contentStyle:{backgroundColor:"#FFE0E4"} }} name="Activity" component={ActivityScreen} />
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
  // const [request, response, promptAsync] = Facebook.useAuthRequest({
  //   clientId: "1465624523842264",
  // });

  // useEffect(() => {
  //   if(response && response.type === "success" && response.authentication) {
  //     (async () => {
  //       const userInfoResponse = await fetch(
  //         `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,picture.type(large)`
  //       );
  //       const userInfo = await userInfoResponse.json();
  //       setUser(userInfo);
  //       console.log(JSON.stringify(response, null, 2));
  //     })();
  //   }
  // }, [response])

  // const handlePressAsync = async () => {
  //   const result = await promptAsync();
  //   if (result.type !== "success") {
  //     alert("Uh oh, something went wrong");
  //     return;
  //   }
  // };


//   return (
//     // <View style={styles.container}>
//     //   {user ? (
//     //     <Profile user={user} />
//     //   ) : (
//     //     <Button
//     //       disabled={!request}
//     //       title="Sign in with Facebook"
//     //       onPress={handlePressAsync}
//     //     />
//     //   )}
//     // </View>
//     <NavigationContainer>
    
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false
//         }}>
//         <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Login" component={LoginScreen} />
//         <Stack.Screen options={{ contentStyle:{backgroundColor:"#F8F6F4"} }} name="Register" component={RegistrationScreen} />
//         <Stack.Screen options={{ contentStyle:{backgroundColor:"#FFE0E4"} }} name="Activity" component={ActivityScreen} />
        
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// function Profile({ user }) {
//   return (
//     <View style={styles.profile}>
//       <Image source={{ uri: user.picture.data.url }} style={styles.image} />
//       <Text style={styles.name}>{user.name}</Text>
//       <Text>ID: {user.id}</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});