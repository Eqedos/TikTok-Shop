import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ref, push, set } from "firebase/database";
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
      Alert.alert('Error', 'Both fields are required!');
      return;
    }

    const reviewsRef = ref(FIREBASE_DB, `products/${productName}/reviews`);
    const newKey = push(reviewsRef).key;

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

    await set(newReviewRef, reviewData); // Use await to ensure the data is added to the reference

    // Display the success message
    Alert.alert('Success', 'Review added successfully!');
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={30}
          color={i <= rating ? '#FF0000' : '#CCCCCC'}
          onPress={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a review for {productName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Author"
        onChangeText={setAuthor}
        value={author}
        required
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your review..."
        multiline={true}
        numberOfLines={4}
        onChangeText={setText}
        value={text}
        required
      />

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating:</Text>
        {renderStars()}
      </View>

      <TouchableOpacity style={styles.button} onPress={submitReview}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    marginRight: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ReviewForm;
