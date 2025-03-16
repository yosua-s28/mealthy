import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PostView from '../components/PostView';
import AddPostBox from '../components/AddPostBox';
import { ScrollView } from 'react-native-gesture-handler';


export default function HomeScreen({ navigation, posts, addPost }) {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedTextSetter, setSelectedTextSetter] = useState(() => {});


  const handlePost = (postData) => {
      const newPost = {
          id: new Date().getTime(),
          ...postData,
      };
      addPost(newPost);
  };


  const handleAddRecipe = (setRecipe) => {
      navigation.navigate('Add Recipe', {setRecipe});
  };

  const handleAddEmoji = (setText) => {
    setSelectedTextSetter(() => setText);
    setIsEmojiPickerVisible(true);
  };

  const handleEmojiSelect = (emoji) => {
    selectedTextSetter((existingText) => `${existingText} ${emoji}`);
  };

  const handleCloseEmojiPicker = () => {
    setIsEmojiPickerVisible(false);
  };

  const emojis = ["😂", "👍", "😊", "🙂", "😔", "😭", "😘", "😳", "❤️", "😍", "🥰", "😉", "😇", "😴", "🙈", "😋", "💋", "😁", "😅", "😟", "😜", "😨", "😥", "🙄", "😡", "😮‍💨", "😒", "😓", "😮", "😙", "🤨", "🥴", "👨‍🦰", "🙊", "😄", "😆", "😌", "📦" ];


  return (
    <View style={styles.container}>
      <ScrollView>
        
        <AddPostBox
          onAddRecipe={handleAddRecipe}
          onAddEmoji={handleAddEmoji}
          onPost={handlePost}
          isEmojiPickerVisible={isEmojiPickerVisible}
          emojis={emojis}
          handleEmojiSelect={handleEmojiSelect}
          handleCloseEmojiPicker={handleCloseEmojiPicker}
        />


        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts yet. Add a post!</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostView post={item} />}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
