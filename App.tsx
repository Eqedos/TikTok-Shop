import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { User, onAuthStateChanged } from 'firebase/auth';

import Login from './app/screens/Login';
import Products from './app/screens/Products';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true); // To handle the intermediate state

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
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
          {user ? (
              <InsideStack.Navigator initialRouteName="products">
                  <InsideStack.Screen name="products" component={Products} options={{ headerShown: false }}/>
              </InsideStack.Navigator>
          ) : (
              <Stack.Navigator initialRouteName="Login">
                  <Stack.Screen 
                      name="Login" 
                      component={Login} 
                      options={{ headerShown: false }}
                  />
              </Stack.Navigator>
          )}
      </NavigationContainer>
  );
}

