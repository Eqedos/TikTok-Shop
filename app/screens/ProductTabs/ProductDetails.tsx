// In ProductDetails.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import { ref, set } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';

interface ProductDetailsProps {
  productName: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productName }) => {

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
      <Button title="Add Product Details" onPress={addProductDetails} />
    </View>
  );
}

export default ProductDetails;
