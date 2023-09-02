import React from 'react';
import { View, Text } from 'react-native';
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
  const { productName } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 16, fontSize: 24 }}>{productName}</Text>
      <Tab.Navigator>
        <Tab.Screen name="Details" component={ProductDetails} />
        <Tab.Screen name="Reviews" component={Reviews} />
        <Tab.Screen name="TikTok" component={TikTok} />
      </Tab.Navigator>
    </View>
  );
}

export default ProductInfo;
