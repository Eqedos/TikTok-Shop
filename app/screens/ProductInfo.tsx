import React from 'react';
import { SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ProductDetails from './ProductTabs/ProductDetails';
import Reviews from './ProductTabs/Reviews';
import TikTok from './ProductTabs/TikTok';
import { RootStackParamList } from '../../App';

type ProductInfoRouteProp = RouteProp<RootStackParamList, 'ProductInfo'>;

const Tab = createMaterialTopTabNavigator();

const ProductInfo: React.FC = () => {
  const route = useRoute<ProductInfoRouteProp>();
  const { productName } = route.params;

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
        <Tab.Screen 
          name="Details" 
          children={() => <ProductDetails productName={productName} />}
        />
        <Tab.Screen 
          name="Reviews" 
          children={() => <Reviews productName={productName} />}
        />
        <Tab.Screen 
          name="TikTok" 
          children={() => <TikTok productName={productName} />}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default ProductInfo;
