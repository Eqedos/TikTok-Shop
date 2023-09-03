import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, push } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type ReviewFormProps = NativeStackScreenProps<RootStackParamList, 'ReviewForm'>;

const ReviewForm: React.FC<ReviewFormProps> = (props) => {
  const [author, setAuthor] = useState<string>('');
  const [text, setText] = useState<string>('');

  const productName = props.route.params.productName;

  const submitReview = async () => {
    if (author.trim() === '' || text.trim() === '') {
      alert('Both fields are required!');
      return;
    }

    const reviewData = {
      author,
      text
    };

    const reviewsRef = ref(FIREBASE_DB, `products/${productName}/reviews`);
    push(reviewsRef, reviewData);
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
  }
});

export default ReviewForm;
