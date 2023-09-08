import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, TextInput, Dimensions, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, onValue, set } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import { Video, ResizeMode } from 'expo-av';

interface TikTokProps {
  productName: string;
}

type TikTokVideo = {
  videoUrl: string;
  likes: number;
  id: string;
  comments: Array<{ user: string, text: string }>;
  createdBy: string;
}

type TikTokNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TikTokForm'>;

const TikTok: React.FC<TikTokProps> = ({ productName }) => {
  const navigation = useNavigation<TikTokNavigationProp>();
  const [tiktoks, setTiktoks] = useState<TikTokVideo[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoComments, setSelectedVideoComments] = useState<Array<{ user: string, text: string }>>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [visibleVideoIndex, setVisibleVideoIndex] = useState<number | null>(null);

  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const tiktoksRef = ref(FIREBASE_DB, `products/${productName}/tiktoks`);

    const unsubscribe = onValue(tiktoksRef, snapshot => {
      const data = snapshot.val();
      const tiktokList = [];
      for (let key in data) {
        const tiktokWithKey = { ...data[key], id: key };
        tiktokList.push(tiktokWithKey);
      }
      setTiktoks(tiktokList);
    });

    return () => unsubscribe();
  }, [productName]);

  const handleLike = (index: number) => {
    const updatedTiktoks = [...tiktoks];
    updatedTiktoks[index].likes += 1;
    const specificVideoRef = ref(FIREBASE_DB, `products/${productName}/tiktoks/${updatedTiktoks[index].id}`);
    set(specificVideoRef, updatedTiktoks[index]);
    setTiktoks(updatedTiktoks);
  };

  const handleCommentsClick = (id: string, comments: Array<{ user: string, text: string }>) => {
    setSelectedVideoId(id);
    setShowComments(true);
    setSelectedVideoComments(comments);
  };

  const handlePostComment = () => {
    const user = 'anonymous'; 
    const updatedComment = { user, text: newComment };

    if (selectedVideoId) {
      const videoToUpdate = tiktoks.find(t => t.id === selectedVideoId);
      videoToUpdate?.comments.push(updatedComment);
      const specificVideoRef = ref(FIREBASE_DB, `products/${productName}/tiktoks/${selectedVideoId}`);
      set(specificVideoRef, videoToUpdate);
      setSelectedVideoComments(videoToUpdate?.comments || []);
    }

    setNewComment('');
  };

  const handleVideoPress = (index: number) => {
    setIsVideoPlaying(!isVideoPlaying);
    setVisibleVideoIndex(index);
  };

  const onViewableItemsChanged = useRef((info: { viewableItems: ViewToken[] }) => {
    if (info.viewableItems.length > 0) {
      const visibleIndex = info.viewableItems[0].index;
      setVisibleVideoIndex(visibleIndex);
    }
  }).current;
  

  const renderCommentSection = () => (
    <Modal
      visible={showComments}
      onRequestClose={() => setShowComments(false)}
      animationType="slide"
    >
      <FlatList
        data={selectedVideoComments}
        renderItem={({ item }) => (
          <Text>{item.user}: {item.text}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment..."
        style={{ borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
      />
      <Button title="Post Comment" onPress={handlePostComment} />
      <Button title="Close" onPress={() => setShowComments(false)} />
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tiktoks}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => handleVideoPress(index)}>
              <Video 
                ref={videoRef}
                source={{ uri: item.videoUrl }}
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={visibleVideoIndex === index && isVideoPlaying}
                isLooping
                useNativeControls={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLike(index)}>
              <Text>👍 {item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCommentsClick(item.id, item.comments)}>
              <Text>💬 {item.comments.length}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <Button title="Add TikTok" onPress={() => navigation.navigate('TikTokForm', { productName })} />
      {renderCommentSection()}
    </View>
  );
}

export default TikTok;
