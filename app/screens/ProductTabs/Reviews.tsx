import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App'; // Adjust this path according to your project structure.

type ReviewsProps = {
  productName: string;
};

type ReviewsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReviewForm'>;

const Reviews: React.FC<ReviewsProps> = ({ productName }) => {
  const navigation = useNavigation<ReviewsNavigationProp>();

  const navigateToReviewForm = () => {
    navigation.navigate('ReviewForm', { productName });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Reviews for {productName}</Text>
      <Button title="Add Review" onPress={navigateToReviewForm} />
    </View>
  );
}

export default Reviews;
