import React from 'react';
import { View, Text, Button } from 'react-native';
import { ref, push } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';

type TikTokProps = {
  productName: string;
};

const TikTok: React.FC<TikTokProps> = ({ productName }) => {

  const addTikTok = async () => {
    const tiktokData = {
      videoUrl: "sampleVideoUrl",
      likes: 123,
      comments: [
        { user: "Alice", text: "Great video!" },
        { user: "Bob", text: "Loved this!" }
      ]
    };

    // Use the productName prop in the database reference
    const tiktokRef = ref(FIREBASE_DB, `products/${productName}/tiktoks`);
    push(tiktokRef, tiktokData);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TikToks for {productName}</Text>
      <Button title="Add TikTok" onPress={addTikTok} />
    </View>
  );
}

export default TikTok;
