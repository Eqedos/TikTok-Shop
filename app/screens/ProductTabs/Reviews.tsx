import React from 'react';
import { View, Text, Button } from 'react-native';
import { ref, push } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';

type ReviewsProps = {
  productName: string;
};

const Reviews: React.FC<ReviewsProps> = ({ productName }) => {

  const addReview = async () => {
    const reviewData = {
      author: "John Doe",
      text: "This product is amazing!"
    };

    // Use the productName prop in the database reference
    const reviewsRef = ref(FIREBASE_DB, `products/${productName}/reviews`);
    push(reviewsRef, reviewData);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Reviews for {productName}</Text>
      <Button title="Add Review" onPress={addReview} />
    </View>
  );
}

export default Reviews;
