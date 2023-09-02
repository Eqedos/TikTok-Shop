import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from '@firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';


type ProductDetailsFormProps = NativeStackScreenProps<RootStackParamList, 'ProductDetailsForm'>;

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({ route }) => {
  const { productName } = route.params;

  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

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
      description
    };

    const productRef = ref(FIREBASE_DB, `products/${productName}/details`);
    set(productRef, productData);
    // Navigate back or show a success message
  };

  return (
    <View style={styles.container}>
      <Text>Enter Product Details</Text>
      <Button title="Pick Image 1" onPress={() => pickImage(0)} />
      {images[0] && <Text>Image 1 uploaded</Text>}
      <Button title="Pick Image 2" onPress={() => pickImage(1)} />
      {images[1] && <Text>Image 2 uploaded</Text>}
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
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10
  }
});

export default ProductDetailsForm;
