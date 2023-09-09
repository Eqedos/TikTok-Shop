import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from '@firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

type ProductDetailsFormProps = NativeStackScreenProps<RootStackParamList, 'ProductDetailsForm'>;

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({ route }) => {
  const { productName } = route.params;

  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");

  const pickImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      
      // Fetch the blob
      const responseBlob = await fetch(sourceUri);
      const blob = await responseBlob.blob();

      const storageReference = storageRef(FIREBASE_STORAGE, `products/${productName}/${index}`);

      // Upload the blob to Firebase
      const snapshot = await uploadBytes(storageReference, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      setImages(prev => {
        const newImages = [...prev];
        newImages[index] = downloadURL;
        return newImages;
      });
    }
  };

  const handleSubmit = async () => {
    const productData = {
      imageUrls: images,
      price: parseFloat(price),
      description,
      dimensions,
      weight: parseFloat(weight),
      quantity: parseInt(quantity),
    };

    const productRef = ref(FIREBASE_DB, `products/${productName}/details`);
    set(productRef, productData);
    // Navigate back or show a success message
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Product Details</Text>
      <View style={styles.iconContainer}>
        <MaterialIcons name="image" size={24} color="white" />
        <Button title="Pick Image 1" onPress={() => pickImage(0)} />
        {images[0] && <Text style={styles.uploadedText}>Image 1 uploaded</Text>}
      </View>
      <View style={styles.iconContainer}>
        <MaterialIcons name="image" size={24} color="white" />
        <Button title="Pick Image 2" onPress={() => pickImage(1)} />
        {images[1] && <Text style={styles.uploadedText}>Image 2 uploaded</Text>}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Dimensions"
        value={dimensions}
        onChangeText={setDimensions}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity Available"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadedText: {
    color: 'white',
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
});

export default ProductDetailsForm;
