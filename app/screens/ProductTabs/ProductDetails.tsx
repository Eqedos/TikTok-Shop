import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, get } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import Swiper from 'react-native-swiper';
import ConfettiCannon from 'react-native-confetti-cannon';
import { RootStackParamList } from '../../../App';
import { BarChart } from 'react-native-chart-kit';

interface ProductDetailsProps {
  productName: string;
}

type ProductDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetailsForm'>;

const ProductDetails: React.FC<ProductDetailsProps> = ({ productName }) => {
  const navigation = useNavigation<ProductDetailsNavigationProp>();

  const [productDetails, setProductDetails] = useState({
    imageUrls: [],
    price: '',
    description: '',
    dimensions: '',
    weight: '',
    quantity: '',
    discountedPrice: '',
    showDiscount: false,
  });

  const [averageProductDetails, setAverageProductDetails] = useState({
    price: '',
    dimensions: '',
    weight: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productsRef = ref(FIREBASE_DB, `products/${productName}/details`);
      const snapshot = await get(productsRef);
      const details = snapshot.val();
      if (details) {
        setProductDetails(details);
      }
    };

    const fetchAverageProductDetails = async () => {
      const averageProductRef = ref(FIREBASE_DB, `products/average/details`);
      const snapshot = await get(averageProductRef);
      const details = snapshot.val();
      if (details) {
        setAverageProductDetails(details);
      }
    };

    fetchProductDetails();
    fetchAverageProductDetails();
  }, [productName]);

  const revealDiscountedPrice = () => {
    setProductDetails((prevState) => ({
      ...prevState,
      showDiscount: true,
      discountedPrice: (prevState.price * 0.8).toFixed(2),
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>
            <Icon name="music" size={28} color="#fff" /> {productName}
          </Text>
        </View>
        <Swiper style={styles.imageContainer} showsPagination={false}>
          {productDetails.imageUrls.map((imageUrl, index) => (
            <Image key={index} source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
          ))}
        </Swiper>
        <View style={styles.priceContainer}>
          <TouchableOpacity style={styles.priceButton} onPress={revealDiscountedPrice}>
            <Text style={styles.priceButtonText}>
              {productDetails.showDiscount ? (
                <>
                  <Text style={[styles.strikethrough, { color: '#ff6f00' }]}>${productDetails.price}</Text>
                  {' '}
                  <Text style={styles.discountedPrice}>${productDetails.discountedPrice}</Text>
                </>
              ) : (
                `$${productDetails.price}`
              )}
            </Text>
          </TouchableOpacity>
        </View>
            <View style={styles.table}>
        <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Attribute</Text>
            <Text style={styles.tableHeaderCell}>Value</Text>
        </View>
        <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Dimensions:</Text>
            <Text style={styles.tableValue}>{productDetails.dimensions}</Text>
        </View>
        <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Weight:</Text>
            <Text style={styles.tableValue}>{productDetails.weight} kg</Text>
        </View>
        <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Quantity Available:</Text>
            <Text style={styles.tableValue}>{productDetails.quantity}</Text>
        </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{productDetails.description}</Text>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Comparison with Average Product</Text>
          <View style={styles.chartRow}>
            <BarChart
              data={{
                labels: ['Price', 'Average'],
                datasets: [
                  {
                    data: [
                      parseFloat(productDetails.price),
                      50  // This is the fixed value to which you are comparing
                    ],
                  },
                ],
              }}
              yAxisSuffix=''
              width={200}
              height={200}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: '#000',
                backgroundGradientFrom: '#000',
                backgroundGradientTo: '#000',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
            <BarChart
              data={{
                labels: ['Dimensions', 'Average'],
                datasets: [
                  {
                    data: [
                      parseFloat(productDetails.dimensions),
                      50  // This is the fixed value to which you are comparing
                    ],
                  },
                ],
              }}
              yAxisSuffix=''
              width={200}
              height={200}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: '#000',
                backgroundGradientFrom: '#000',
                backgroundGradientTo: '#000',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </View>
          <View style={styles.chartRow}>
          <BarChart
  data={{
    labels: ['Weight', 'Average'],
    datasets: [
      {
        data: [
          parseFloat(productDetails.weight),
          50  // This is the fixed value to which you are comparing
        ],
      },
    ],
  }}
  width={200}
  height={200}
  yAxisLabel=""
  yAxisSuffix=''
  chartConfig={{
    backgroundColor: '#000',
    backgroundGradientFrom: '#000',
    backgroundGradientTo: '#000',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  }}
  style={styles.chart}
/>
            <BarChart
              data={{
                labels: ['Quantity', 'Average'],
                datasets: [
                  {
                    data: [
                      parseFloat(productDetails.weight),
                      50  // This is the fixed value to which you are comparing
                    ],
                  },
                ],
              }}
              yAxisSuffix=''
              width={200}
              height={200}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#000',
                backgroundGradientFrom: '#000',
                backgroundGradientTo: '#000',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </View>
        </View>
      </ScrollView>
      {productDetails.showDiscount && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          explosionSpeed={500}
          fallSpeed={2000}
          fadeOut
        />
      )}
      <Button
        title="Edit Product Details"
        onPress={() => navigation.navigate('ProductDetailsForm', { productName })}
      />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // <-- Distribute space evenly between the two charts
    marginBottom: 20, // <-- Add a margin to space out the rows
    width: '100%', // <-- Make sure the row takes the full width available
},

  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#fff',
  },
  imageContainer: {
    marginBottom: 20,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  priceButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    color: '#ff6f00',
  },
  detailsContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 15,   // <-- Padding inside the card
    borderRadius: 10,   // <-- Rounded corners
    backgroundColor: '#f2f2f2',   // <-- Greyish background
    shadowColor: "#000",   // <-- Shadow for iOS
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,   // <-- Elevation for Android
    alignItems: 'center',
  },
  
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#000',   // <-- Updated color to black
  },
  
  value: {
    flex: 1,
    color: '#000',   // <-- Updated color to black
  },
  
  tableContainer: {
    marginBottom: 20,
  },
  
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#ff6f00',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  table: {
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 20,
},
tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#333',  // Give it a slightly different shade for differentiation
},
tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
},
tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#fff',
},
tableLabel: {
    flex: 1,
    padding: 10,
    color: '#fff',
    textAlign: 'center',
},
tableValue: {
    flex: 1,
    padding: 10,
    color: '#fff',
    textAlign: 'center',
},

});

export default ProductDetails;
