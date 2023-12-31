import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailsForm from './app/screens/ProductTabs/ProductDetailsForm'; // Adjust the path as necessary
import { User, onAuthStateChanged } from 'firebase/auth';
import { StatusBar, Platform } from 'react-native';

import Login from './app/screens/Login';
import Products from './app/screens/Products';
import ProductInfo from './app/screens/ProductInfo'; // Make sure to create this component and import it here
import { FIREBASE_AUTH } from './FirebaseConfig';
import TikTokForm from './app/screens/ProductTabs/TikTokForm';
import ReviewForm from './app/screens/ProductTabs/ReviewForm'; 
import { lockAsync, OrientationLock } from 'expo-screen-orientation';
import Constants from 'expo-constants';


export type RootStackParamList = {
    Login: undefined;
    Products: undefined;
    ProductInfo: { productName: string };
    ProductDetailsForm: { productName?: string };
    TikTokForm: { productName?: string };  // added this line
    ReviewForm: { productName: string };
    Profile: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true); // To handle the intermediate state

  useEffect(() => {
    async function changeScreenOrientation() {
        if (Platform.OS === 'android' && !Constants.isDevice) { // Ensure it's on an Android device
          await lockAsync(OrientationLock.ALL);
          StatusBar.setHidden(true);
        }
      }
      changeScreenOrientation();
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
          console.log("User state changed: ", user);
          if (user) {
              setUser(user);
          } else {
              setUser(null);
          }
          if (initializing) setInitializing(false); // Done initializing after the first check
      });

      // Cleanup subscription on unmount
      return unsubscribe;
  }, [initializing]);

  if (initializing) {
      return null; // or a loader if you want to show something during initialization
  }

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName={user ? "Products" : "Login"} screenOptions={{
    headerShown: false,
    statusBarHidden: true,  // Add this line
  }}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        
        {user ? (
            <React.Fragment>
                <Stack.Screen name="Products" component={Products} options={{ headerShown: false } }/>
                <Stack.Screen name="ProductInfo" component={ProductInfo} options={{ headerShown: false }}/>
                <Stack.Screen name="ProductDetailsForm" component={ProductDetailsForm} options={{ headerShown: false }}/>
                <Stack.Screen name="TikTokForm" component={TikTokForm} options={{ headerShown: false }}/>
                <Stack.Screen name="ReviewForm" component={ReviewForm} options={{ headerShown: false }}/>
            </React.Fragment>
        ) : null}
    </Stack.Navigator>
</NavigationContainer>

  );
}