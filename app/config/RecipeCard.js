import React, { useState, useEffect, useContext } from "react"; 
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Share, SafeAreaView } from "react-native";
import * as Clipboard from 'expo-clipboard';
import styles from "../config/recipe-card-styles";
import { useFonts } from 'expo-font';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Svg, { Circle } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../config/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import axios from 'axios'; 

const RecipeCard = () => {

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>
  }

  const [bookmarked, setBookmarked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe } = route.params; // Access the recipe object
  const { userId } = useContext(UserContext); // Access userId from context

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await axios.get(`${process.env.NGROK_URL}/favorite_recipes/check`, {
          params: {
            user_id: userId,
            recipe_id: recipe.recipe_id
          }
        });
        setBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    if (userId !== 0) {
      checkBookmarkStatus();
    }
  }, [recipe.recipe_id, userId]);

  const handleAction = (action) => {
    if (userId === 0) {
      Alert.alert(
        'Registration Required',
        'You need to register to access this feature.',
        [
          {
            text: 'Go to Register',
            onPress: () => navigation.navigate('RegisterPage'), // Navigate to Register page
          },
          {
            text: 'Ok',
            onPress: () => {}, // Simply return to the current page
          },
        ]
      );
    } else {
      action(); // Execute the action if the user is logged in
    }
  };
  
  const toggleBookmark = () => {
    handleAction(async () => {
      try {
        if (bookmarked) {
          // Delete bookmark
          await axios.delete(`${process.env.NGROK_URL}/favorite_recipes`, {
            data: {
              user_id: userId,
              recipe_id: recipe.recipe_id
            }
          });
          setBookmarked(false);
        } else {
          // Add bookmark
          await axios.post(`${process.env.NGROK_URL}/favorite_recipes`, {
            user_id: userId,
            recipe_id: recipe.recipe_id
          });
          setBookmarked(true);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 1000);
        }
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    });
  };
  
  const toggleCalendar = () => {
    handleAction(() => {
      // Navigate to MealPlanner passing the recipe image
      navigation.navigate('MakePlanner', { recipeImage: recipe.image_url, recipeTitle: recipe.title, recipeId: recipe.recipe_id });
    });
  };
  
  const shareRecipe = () => {
    handleAction(async () => {
      Alert.alert(
        "Share Recipe",
        "Choose an option:",
        [
          {
            text: "Copy Link",
            onPress: async () => {
              await Clipboard.setStringAsync(recipe.link);
              Alert.alert("Link Copied", "The recipe link has been copied to your clipboard.");
            }
          },
          {
            text: "Share to External Apps",
            onPress: async () => {
              try {
                await Share.share({ message: recipe.link });
              } catch (error) {
                Alert.alert("Error", error.message);
              }
            }
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
    });
  };
  

  const NutritionCircle = ({ percentage, label }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const getGreenShade = (percentage) => {
      const lightness = 85 - (percentage * 0.35);
      const saturation = 60;
      return `hsl(117, ${saturation}%, ${lightness}%)`;
    };
    const strokeColor = getGreenShade(percentage);

    return (
      <View style={styles.circleContainer}>
        <Svg height="100" width="100" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e0e0e0"
            strokeWidth="8"
            fill="transparent"
          />
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 50 50)`} // Rotate to start from top
          />
        </Svg>
        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containersafe}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Image source={{ uri: recipe.image_url }} style={styles.image} />

          {/* Title centered */}
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={toggleBookmark}>
              <Icon
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={30} // Smaller icon size
                color="black"
                style={{ paddingLeft: 15, paddingRight: 15 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCalendar}>
              <Icon
                name="calendar-plus"
                size={30} // Smaller icon size
                color="black"
                style={{ paddingLeft: 15, paddingRight: 15 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareRecipe}>
              <Icon
                name="share-variant"
                size={30} // Smaller icon size
                color="black"
                style={{ paddingLeft: 15, paddingRight: 15 }}
              />
            </TouchableOpacity>
          </View>


          {/* Name with border below */}
          <Text style={styles.author}>{recipe.author}</Text>
          <View style={styles.borderLine}></View>

          <View style={styles.infoContainer}>
            <Text style={styles.eta}>⏳ {recipe.time} mins</Text>
            <Text style={styles.calorie}>🔥 {recipe.calories} kcal</Text>
          </View>

          <View style={styles.nutritionRow}>
            <NutritionCircle percentage={recipe.carbs} label="Carbs" />
            <NutritionCircle percentage={recipe.fat} label="Fat" />
            <NutritionCircle percentage={recipe.protein} label="Protein" />
          </View>

          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients ? (
              (typeof recipe.ingredients === 'string' ? recipe.ingredients.split(',') : recipe.ingredients).map((ingredient, index) => (
                <Text key={index} style={styles.ingredient}>• {ingredient.trim()}</Text>
              ))
            ) : (
              <Text>No ingredients found.</Text>
            )}
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions ? (
              (typeof recipe.instructions === 'string' ? recipe.instructions.split('.') : recipe.instructions).map((instruction, index) => (
                <Text key={index} style={styles.instructionText}>
                  {index + 1}. {instruction.trim()}
                </Text>
              ))
            ) : (
              <Text>No instructions found.</Text>
            )}
          </View>

        </ScrollView>
        {showNotification && (
          <View style={styles.notificationPopup}>
            <Text style={styles.notificationText}>Bookmarked Recipe</Text>
          </View>
        )}
        <BottomNavigation navigation={navigation} />
      </SafeAreaView>
    </View>
  );
};

export default RecipeCard;
