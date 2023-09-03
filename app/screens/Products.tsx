import React from 'react';
import { View, Text, Button, StyleSheet, Pressable, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack'; // Import this for typing
import { RootStackParamList } from '../../App';
  
  type ProductsNavigationProp = StackNavigationProp<RootStackParamList, 'Products'>;
  

const Products = () => {
    const navigation = useNavigation<ProductsNavigationProp>(); // Use typing here

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            console.log('User signed out!');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.row}>
              {Array(6).fill(null).map((_, index) => (
                <Pressable 
                  key={index} 
                  style={({ pressed }) => [styles.card, pressed ? styles.pressedCard : {}]}
                  onPress={() => navigation.navigate('ProductInfo', { productName: `product${index + 1}` })}  // Add this line
                >
                  <Text style={styles.cardTitle}>{"Product " + (index + 1)}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Button title="Sign Out" onPress={handleSignOut} color="#FE2C55" />
        </View>
      );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        alignItems: 'center',
        paddingTop: 20,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    card: {
        width: '48%', // Adjusting width for two cards in a row
        height: 120,
        backgroundColor: '#000',
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FE2C55',
        borderWidth: 1,
        shadowColor: "#FE2C55",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    pressedCard: {
        backgroundColor: '#1C1C1E',
        borderColor: '#FFF',
    },
    cardTitle: {
        fontSize: 18,
        color: '#FFF',
    },
});

export default Products;
