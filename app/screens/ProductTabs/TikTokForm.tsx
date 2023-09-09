import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ref, set, push } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from '@firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TikTokFormProps = NativeStackScreenProps<RootStackParamList, 'TikTokForm'>;

const TikTokForm: React.FC<TikTokFormProps> = ({ route }) => {
  const { productName } = route.params;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uniqueVideoName, setUniqueVideoName] = useState<string | null>(null); 
  const [likes, setLikes] = useState(0);
  const [commentsInput, setCommentsInput] = useState<string>(''); // new state for comments input
  
  const handleVideo = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      const responseBlob = await fetch(sourceUri);
      const blob = await responseBlob.blob();
      const generatedUniqueVideoName = `${Date.now()}.mp4`;
      setUniqueVideoName(generatedUniqueVideoName); 

      const storageReference = storageRef(FIREBASE_STORAGE, `products/${productName}/${generatedUniqueVideoName}`);
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
    if (commentsInput.trim() === '') {
      Alert.alert(
        'Empty Comments',
        'Please enter at least one comment before submitting.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ]
      );
      return;
    }

    const commentsArray = commentsInput.split(',')
                                       .map(comment => comment.trim())
                                       .filter(comment => comment) // remove any empty strings after trimming
                                       .map(comment => ({
                                         text: comment,
                                         user: FIREBASE_AUTH.currentUser?.uid || "Anonymous"
                                       }));

    const tiktokData = {
      videoUrl,
      uniqueVideoName, 
      likes,
      createdBy: FIREBASE_AUTH.currentUser?.uid || "Anonymous",
      comments: commentsArray
    };

    const tiktoksRef = ref(FIREBASE_DB, `products/${productName}/tiktoks`);
    const newTiktokRef = push(tiktoksRef);
    set(newTiktokRef, tiktokData);

    // Show a popup to notify the user
    Alert.alert(
      'Video Submitted',
      'Your TikTok video has been submitted successfully!',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require('./../../../assets/tiktok-shop-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Upload a TikTok Video</Text>

      {/* TextInput for comments */}
      <TextInput 
        style={styles.commentsInput}
        placeholder="Enter comments separated by commas"
        value={commentsInput}
        onChangeText={setCommentsInput}
      />

      {commentsInput.trim() === '' && (
        <Text style={styles.errorText}>Please enter at least one comment before submitting.</Text>
      )}

      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="video" size={40} color="#fff" onPress={pickVideo} />
        <Text style={styles.iconText}>Pick Video</Text>
      </View>

      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="camera" size={40} color="#fff" onPress={recordVideo} />
        <Text style={styles.iconText}>Record Video</Text>
      </View>

      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="check" size={40} color="#fff" onPress={handleSubmit} />
        <Text style={styles.iconText}>Submit</Text>
      </View>

      {videoUrl && <Text style={styles.uploadedText}>Video uploaded</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  commentsInput: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  iconText: {
    color: '#fff',
    marginTop: 5,
  },
  uploadedText: {
    color: '#fff',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default TikTokForm;
