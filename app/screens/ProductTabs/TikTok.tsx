import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, TextInput, Dimensions, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, onValue, set } from "firebase/database";
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { RootStackParamList } from '../../../App';
import { Video, ResizeMode } from 'expo-av';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: [{ translateY: -50 }],
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  likeButton: {
    marginBottom: 10,
  },
  commentButton: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
},
commentItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
},
commentUser: {
    fontWeight: 'bold',
    marginRight: 10,
},
commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
},
commentInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
},
postButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
},
postButtonText: {
    color: 'white',
},
});
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
  const [likedVideos, setLikedVideos] = useState<{[key: string]: boolean}>({});
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
    const video = updatedTiktoks[index];
    const isLiked = likedVideos[video.id] || false;

    if (isLiked) {
      video.likes -= 1;
    } else {
      video.likes += 1;
    }

    const specificVideoRef = ref(FIREBASE_DB, `products/${productName}/tiktoks/${video.id}`);
    set(specificVideoRef, video);
    setTiktoks(updatedTiktoks);

    setLikedVideos(prevState => ({ ...prevState, [video.id]: !isLiked }));
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
        <View style={styles.modalContainer}>
            <FlatList
                data={selectedVideoComments}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text style={styles.commentUser}>{item.user}:</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.commentInputContainer}>
                <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                    style={styles.commentInput}
                />
                <TouchableOpacity style={styles.postButton} onPress={handlePostComment}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tiktoks}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', opacity: 1 }} />
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
                  <View style={{ position: 'absolute', top: '50%', right: 0, transform: [{ translateY: -50 }] }}>
                  <TouchableOpacity onPress={() => handleLike(index)} style={{ alignItems: 'center', padding: 5, borderRadius: 5, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2, borderWidth: 0, borderColor: 'transparent' }}>
                    <FontAwesome name={likedVideos[item.id] ? "heart" : "heart-o"} size={30} color="white" style={{ textShadowColor: 'black', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 }} />
                    <Text style={{ color: 'white', backgroundColor: 'black', marginTop: 5, paddingHorizontal: 5, borderRadius: 5 }}>{item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCommentsClick(item.id, item.comments)} style={{ alignItems: 'center', marginTop: 10, padding: 5, borderRadius: 5, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2, borderWidth: 0, borderColor: 'transparent' }}>
                    <FontAwesome name="comment" size={30} color="white" style={{ textShadowColor: 'black', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 }} />
                    <Text style={{ color: 'white', backgroundColor: 'black', marginTop: 5, paddingHorizontal: 5, borderRadius: 5 }}>{item.comments.length}</Text>
                  </TouchableOpacity>
      </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        snapToInterval={Dimensions.get('window').height}
        decelerationRate="fast"
      />
  
  <TouchableOpacity
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('TikTokForm', { productName })}
      >
        <FontAwesome name="plus" size={24} color="black" />
      </TouchableOpacity>
      {renderCommentSection()}
    </View>
  );
}

export default TikTok;