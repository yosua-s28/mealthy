import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import HomeScreen from '../config/HomeScreen';
import AddRecipeScreen from '../config/AddRecipeScreen';
import RecipeDetailScreen from '../config/RecipeDetailScreen';
import ImageViewerScreen from '../config/ImageViewerScreen';

import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Stack = createStackNavigator();

const CommunityPage = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containersafe}>
        <Header navigation={navigation} title="Community" />
        <View style={styles.content}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} posts={posts} addPost={addPost} />}
            </Stack.Screen>
            <Stack.Screen name="Add Recipe" component={AddRecipeScreen} />
            <Stack.Screen name="Recipe Detail" component={RecipeDetailScreen} />
            <Stack.Screen name="Image Viewer" component={ImageViewerScreen} />
          </Stack.Navigator>
        </View>
      </SafeAreaView>
    <BottomNavigation navigation={navigation} />
  </View>

  );
  
}

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 15,
        marginHorizontal: 10, // Tambahkan jarak dari header ke isi
    },
});
  

export default CommunityPage;