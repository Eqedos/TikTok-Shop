import React from 'react';
import { SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductDetails from './ProductTabs/ProductDetails';
import Reviews from './ProductTabs/Reviews';
import TikTok from './ProductTabs/TikTok';
import { RootStackParamList } from '../../App';

type ProductInfoRouteProp = RouteProp<RootStackParamList, 'ProductInfo'>;

const Tab = createBottomTabNavigator();

import Svg, { Path } from 'react-native-svg';

const TikTokIcon = ({ color = "#000000" }) => {
    return (
        <Svg width="30" height="30" viewBox="0 0 50 50">
            <Path fill={color} d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
        </Svg>
    );
};

const ProductInfo: React.FC = () => {
  const route = useRoute<ProductInfoRouteProp>();
  const { productName } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Details') {
              iconName = 'info-circle';
            } else if (route.name === 'Reviews') {
              iconName = 'star';
            } else if (route.name === 'TikTok') {
              return <TikTokIcon color={color} />;
            } else {
              iconName=''
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: 'black' },
          headerShown: false,
        })}
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
