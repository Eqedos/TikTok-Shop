import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ReviewThreadProps = {
  review: any; // Assuming the review object is passed as prop
};

const ReviewThread: React.FC<ReviewThreadProps> = ({ review }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.author}>Author: {review.author}</Text>
      <Text style={styles.text}>Review: {review.text}</Text>
      {/* You can add additional components for comments, replies, etc. here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default ReviewThread;
