import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NGROK_URL } from "@env";

const RecipeManagement = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/recipes`); // Replace with your machine's IP address
      console.log("Fetched recipes:", response.data); // Log the response
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      alert("Error fetching recipes: " + error.message);
    }
  };

  // Handle Add Recipe (Navigating to Add Recipe Screen)
  const handleAddRecipe = () => {
    navigation.navigate('AddRecipe');
  };

  // Handle Delete Recipe
  const handleDeleteRecipe = async (id) => {
    try {
      await axios.delete(`${NGROK_URL}/recipes/${id}`);
      setRecipes(recipes.filter((recipe) => recipe.recipe_id !== id));
    } catch (error) {
      console.error('Error deleting recipe', error.message);
      alert("Error deleting recipe: " + error.message);
    }
  };

  return (
    <ImageBackground 
      source={require('./background.png')} // Replace with your background image path
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safecontainer}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Recipe Management</Text>
          </View>

          {/* Add Recipe Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
              <Text style={styles.addButtonText}>+ Add Recipe</Text>
            </TouchableOpacity>
          </View>

          {/* Recipe List */}
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.recipe_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.recipeCard}>
                {/* Recipe Title and Description */}
                <View style={styles.recipeDetails}>
                  <Text style={styles.recipeText}>{item.title}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleDeleteRecipe(item.recipe_id)} style={styles.iconButton}>
                    <Text style={styles.iconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignSelf:'center',
    width:'100%'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    marginLeft: 8,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2A2A2A',
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  addButton: {
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  recipeDetails: {
    flex: 1,
  },
  recipeText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 20,
    color: '#333',
  },
});

export default RecipeManagement;
