import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

type RootStackParamList = {
  Login: undefined;
  Products: undefined;
  ProductInfo: { productName: string };
};

type ProductInfoRouteProp = RouteProp<RootStackParamList, 'ProductInfo'>;

const Tab = createMaterialTopTabNavigator();

const ProductDetails = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Product Details Screen</Text>
    </View>
  );
}

const Reviews = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Reviews Screen</Text>
    </View>
  );
}

const TikTok = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TikTok Screen</Text>
    </View>
  );
}

const ProductInfo: React.FC = () => {
  const route = useRoute<ProductInfoRouteProp>();
  // Removed the const for productName as it's not used anymore.

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: '#e6e6e6' },
        }}
      >
        <Tab.Screen name="Details" component={ProductDetails} />
        <Tab.Screen name="Reviews" component={Reviews} />
        <Tab.Screen name="TikTok" component={TikTok} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default ProductInfo;
