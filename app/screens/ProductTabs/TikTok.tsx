import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, onValue } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import { Video, ResizeMode } from 'expo-av';

interface TikTokProps {
  productName: string;
}

type TikTokVideo = {
  videoUrl: string;
  likes: number;
  comments: Array<{ user: string, text: string }>;
  createdBy: string;
}

type TikTokNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TikTokForm'>;

const TikTok: React.FC<TikTokProps> = ({ productName }) => {
  const navigation = useNavigation<TikTokNavigationProp>();
  const [tiktoks, setTiktoks] = useState<TikTokVideo[]>([]);

  useEffect(() => {
    const tiktoksRef = ref(FIREBASE_DB, `products/${productName}/tiktoks`);
  
    const unsubscribe = onValue(tiktoksRef, snapshot => {
      const data = snapshot.val();
      const tiktokList = [];
      for (let uniqueVideoName in data) {
        tiktokList.push(data[uniqueVideoName]);
      }
      setTiktoks(tiktokList);
    });
  
    return () => unsubscribe();  // Cleanup the listener on component unmount
  }, [productName]);
  

  const navigateToAddTikTok = () => {
    navigation.navigate('TikTokForm', { productName });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tiktoks}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Video 
              source={{ uri: item.videoUrl }}   // The video's Firebase Storage URL
              style={{ width: '100%', height: 300 }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls={true}   // To show video controls
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ position: 'absolute', right: 10, top: 10 }}>
        <Button title="Add TikTok" onPress={navigateToAddTikTok} />
      </View>
    </View>
  );
}

export default TikTok;