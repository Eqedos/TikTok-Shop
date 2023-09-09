import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, push, update, set } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import Icon from 'react-native-vector-icons/FontAwesome';

type ReviewFormProps = NativeStackScreenProps<RootStackParamList, 'ReviewForm'>;

const ReviewForm: React.FC<ReviewFormProps> = (props) => {
  const [author, setAuthor] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const productName = props.route.params.productName;

  const submitReview = async () => {
    if (author.trim() === '' || text.trim() === '') {
      alert('Both fields are required!');
      return;
    }

    const reviewsRef = ref(FIREBASE_DB, `products/${productName}/reviews`);
    
    // Generate a new unique key
    const newKey = push(reviewsRef).key;

    // If the new key is null (although unlikely), handle this error gracefully
    if (!newKey) {
      console.error('Failed to generate a new key for the review.');
      return;
    }

    const newReviewRef = ref(FIREBASE_DB, `products/${productName}/reviews/${newKey}`);

    const reviewData = {
      id: newKey,
      author,
      text,
      rating,
      likes: 0
    };

    set(newReviewRef, reviewData); // Use set to add the data to the reference
};

  
  

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={30}
          color={i <= rating ? 'gold' : 'gray'}
          onPress={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text>Write a review for {productName}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Author"
        onChangeText={setAuthor}
        value={author}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your review..."
        multiline={true}
        numberOfLines={4}
        onChangeText={setText}
        value={text}
      />

      <View style={styles.ratingContainer}>
        <Text>Rating:</Text>
        {renderStars()}
      </View>

      <Button title="Submit Review" onPress={submitReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  }
});

export default ReviewForm;
