import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ref, set } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';

interface ProductDetailsProps {
  productName: string;
}

type ProductDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetailsForm'>;

const ProductDetails: React.FC<ProductDetailsProps> = ({ productName }) => {
  const navigation = useNavigation<ProductDetailsNavigationProp>();

  const addProductDetails = async () => {
    const productData = {
      imageUrls: ["url1", "url2"],
      price: 100,
      description: "Sample description"
    };

    const productsRef = ref(FIREBASE_DB, `products/${productName}/details`);
    set(productsRef, productData);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Product Details Screen</Text>
      <Button title="Add Product Details" onPress={() => navigation.navigate('ProductDetailsForm', { productName })} />
    </View>
  );
}

export default ProductDetails;
