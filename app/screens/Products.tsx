import React, { useRef } from 'react';
import { View, Text, Button, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';

type ProductsNavigationProp = StackNavigationProp<RootStackParamList, 'Products'>;

const Products = () => {
  const cardIndexRef = useRef(0);
  const cardHeightRef = useRef(0);

  const navigation = useNavigation<ProductsNavigationProp>();

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log('User signed out!');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const productData = [
    {
      id: 1,
      name: 'Camera',
      price: '\$19.99',
      image: require('../../assets/product1.jpeg'),
    },
    {
      id: 2,
      name: 'Watch',
      price: '\$24.99',
      image: require('../../assets/product2.jpeg'),
    },
    // Add more product data here...
    {
      id: 3,
      name: 'FaceWash',
      price: '\$14.99',
      image: require('../../assets/product3.jpeg'),
    },
    {
      id: 4,
      name: 'T-Shirts',
      price: '\$29.99',
      image: require('../../assets/product4.jpeg'),
    },
    {
      id: 5,
      name: 'PremPens',
      price: '\$9.99',
      image: require('../../assets/product5.jpeg'),
    },
    {
      id: 6,
      name: 'NoteBooks',
      price: '\$17.99',
      image: require('../../assets/product6.jpeg'),
    },
    {
      id: 7,
      name: 'Cute Bear',
      price: '\$12.99',
      image: require('../../assets/product7.jpeg'),
    },
    {
      id: 8,
      name: 'Slay Cap',
      price: '\$39.99',
      image: require('../../assets/product8.jpeg'),
    },
  ];
  

  const renderCard = ({ item, index }: { item: any, index: number }) => {
    let cardWidth: string;

    if (index % 2 === 0) { // If the card is on the left side
      cardWidth = Math.floor(Math.random() * (60 - 35 + 1) + 35) + "%";
      cardIndexRef.current = parseInt(cardWidth); // Store the width of the left card
    } else { // If the card is on the right side
      cardWidth = (95 - cardIndexRef.current) + "%"; // Subtracting left card width from total width
    }
    
    return (
      <Pressable
        style={[styles.card, { width: cardWidth, marginRight: 10 }]}
        onPress={() => navigation.navigate('ProductInfo', { productName: item.name })}
      >

        <Image source={item.image} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <Ionicons name="cart-outline" size={24} color="#FF2043" />
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/tiktok-shop-logo2.png')} style={styles.logo} />
      </View>
      <FlatList
        data={productData}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.content}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2022 Your Ecommerce Website. All rights reserved.</Text>
      </View>
      <View style={styles.signOutButtonContainer}>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#FF2043" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Center contents horizontally
    alignItems: 'center',     // Center contents vertically
    paddingHorizontal: 10,
    paddingTop: 10,           // Increased paddingTop for taller header
    paddingBottom: 10,       // Increased paddingBottom for taller header
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  
  
  content: {
    paddingTop: 20,
    width: '95%',             // set the total width for the content
    alignSelf: 'center',      // center the content horizontally
},

  card: {
    width: '48%',
    backgroundColor: '#FFF',
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#EAEAEA',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  cardPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  signOutButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  signOutButton: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Products;
