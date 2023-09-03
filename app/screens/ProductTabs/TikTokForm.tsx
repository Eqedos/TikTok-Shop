import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ref, set, push } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from '@firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import * as ImagePicker from 'expo-image-picker';

type TikTokFormProps = NativeStackScreenProps<RootStackParamList, 'TikTokForm'>;

const TikTokForm: React.FC<TikTokFormProps> = ({ route }) => {
  const { productName } = route.params;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
                                    
  const handleVideo = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
  
      // Fetch the blob
      const responseBlob = await fetch(sourceUri);
      const blob = await responseBlob.blob();
  
      // Create a unique name for the video (using timestamp for this example)
      const uniqueVideoName = `${Date.now()}.mp4`;
  
      const storageReference = storageRef(FIREBASE_STORAGE, `products/${productName}/${uniqueVideoName}`);
  
      // Upload the blob to Firebase
      const snapshot = await uploadBytes(storageReference, blob);
  
      const downloadURL = await getDownloadURL(snapshot.ref);
      setVideoUrl(downloadURL);
    }
  };  

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1
    });
    handleVideo(result);
  };

  const recordVideo = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1
    });
    handleVideo(result);
  };

  const handleSubmit = async () => {
    const tiktokData = {
      videoUrl,
      likes: parseInt(likes),
      comments: comments.split(',').map(comment => ({ user: 'Anonymous', text: comment })),
      createdBy: FIREBASE_AUTH.currentUser?.uid || "Anonymous"
    };

    const tiktoksRef = ref(FIREBASE_DB, `products/${productName}/tiktoks`);
    const newTiktokRef = push(tiktoksRef);
    set(newTiktokRef, tiktokData);

    // Optional: Navigate back or show a success message
  };

  return (
    <View style={styles.container}>
      <Text>Upload a TikTok Video</Text>
      <Button title="Pick Video" onPress={pickVideo} />
      <Button title="Record Video" onPress={recordVideo} />
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
