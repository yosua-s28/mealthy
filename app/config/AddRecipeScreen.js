// screens/AddRecipeScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import RecipeForm from '../components/RecipeForm';

export default function AddRecipeScreen({ navigation, route }) {
  const { setRecipe, userData } = route.params; // Terima userData dari route.params

  const handlePostRecipe = (recipeData) => {
    setRecipe(recipeData);
    navigation.goBack();
  };

  const handleRemoveRecipe = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Kirim userData ke RecipeForm */}
        <RecipeForm onPost={handlePostRecipe} onRemove={handleRemoveRecipe} userData={userData} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
      flex: 1,
    },
    scrollContentContainer: {
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      padding: 10,
      marginBottom: 10,
    },
  });