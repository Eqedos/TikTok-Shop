import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { ref as sref, onValue, update, DatabaseReference } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

type ReviewsProps = {
  productName: string;
};

type ReviewsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReviewForm'>;

const Reviews: React.FC<ReviewsProps> = ({ productName }) => {
  const navigation = useNavigation<ReviewsNavigationProp>();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const reviewsRef = sref(FIREBASE_DB, `products/${productName}/reviews`);
    onValue(reviewsRef, (snapshot) => {
      const reviewsData = snapshot.val();
      if (reviewsData) {
        const reviewsArray = Object.values(reviewsData);
        setReviews(reviewsArray);
      }
    });
  }, [productName]);

  const navigateToReviewForm = () => {
    navigation.navigate('ReviewForm', { productName });
  };
  

  const handleLike = (review: any) => {
    const reviewRef = sref(FIREBASE_DB, `products/${productName}/reviews/${review.id}`); // Use id instead of key
    const updatedLikes = review.likes + 1;
  
    // Use the 'update' method to update the likes count
    update(reviewRef, { likes: updatedLikes })
      .then(() => {
        // Update the local state with the updated likes count
        const updatedReviews = reviews.map((r) => {
          if (r.id === review.id) {  // Use id instead of key
            return { ...r, likes: updatedLikes };
          }
          return r;
        });
        setReviews(updatedReviews);
      })
      .catch((error) => {
        console.log('Error updating likes:', error);
      });
};
  
  

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={20}
          color={i <= rating ? 'gold' : 'gray'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Reviews for {productName}</Text>
      </View>
      <View style={styles.content}>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <View style={styles.reviewBox}>
              <View style={styles.reviewTextContainer}>
                <Text style={styles.authorText}>Author: {review.author}</Text>
                <Text style={styles.ratingText}>Rating: {renderStars(review.rating)}</Text>
                <Text style={styles.reviewText}>Review: {review.text}</Text>
              </View>
              <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(review)}>
                <Icon name="thumbs-up" size={20} color="gray" />
                <Text style={styles.likeCount}>{review.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={navigateToReviewForm}>
        <Icon name="plus" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  reviewContainer: {
    width: '100%',
    marginBottom: 10,
  },
  reviewBox: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewTextContainer: {
    flex: 1,
  },
  authorText: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Reviews;
