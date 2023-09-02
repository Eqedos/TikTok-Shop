import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

interface TikTokProps {
  productName: string;
}

type TikTokNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TikTokForm'>;

const TikTok: React.FC<TikTokProps> = ({ productName }) => {
  const navigation = useNavigation<TikTokNavigationProp>();

  const navigateToAddTikTok = () => {
    navigation.navigate('TikTokForm', { productName });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TikToks for {productName}</Text>
      <Button title="Add TikTok" onPress={navigateToAddTikTok} />
    </View>
  );
}

export default TikTok;
