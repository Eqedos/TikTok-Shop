import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from '@firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import * as ImagePicker from 'expo-image-picker';

type TikTokFormProps = NativeStackScreenProps<RootStackParamList, 'TikTokForm'>;

const TikTokForm: React.FC<TikTokFormProps> = ({ route }) => {
  const { productName } = route.params;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1
    });

    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      
      // Fetch the blob
      const responseBlob = await fetch(sourceUri);
      const blob = await responseBlob.blob();

      const storageReference = storageRef(FIREBASE_STORAGE, `tiktoks/${productName}`);

      // Upload the blob to Firebase
      const snapshot = await uploadBytes(storageReference, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      setVideoUrl(downloadURL);
    }
  };

  const handleSubmit = async () => {
    const tiktokData = {
      videoUrl,
      likes: parseInt(likes),
      comments: comments.split(',').map(comment => ({ user: 'Anonymous', text: comment }))
    };

    const tiktokRef = ref(FIREBASE_DB, `products/${productName}/tiktok`);
    set(tiktokRef, tiktokData);
    // Navigate back or show a success message
  };

  return (
    <View style={styles.container}>
      <Text>Upload a TikTok Video</Text>
      <Button title="Pick Video" onPress={pickVideo} />
      {videoUrl && <Text>Video uploaded</Text>}
      <TextInput
        style={styles.input}
        placeholder="Likes"
        keyboardType="numeric"
        value={likes}
        onChangeText={setLikes}
      />
      <TextInput
        style={styles.input}
        placeholder="Comments (comma separated)"
        value={comments}
        onChangeText={setComments}
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

export default TikTokForm;
