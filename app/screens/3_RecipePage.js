import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, Image, ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, Modal, Pressable } from 'react-native';
import styles from '../styles/3_RecipeStyles';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavigation from '../components/BottomNavigation';
import { UserContext } from '../config/UserContext';
import { NGROK_URL } from '@env';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

const RecipePage = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedTrendingFilter, setSelectedTrendingFilter] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState({});
  const [isTrendingSelected, setIsTrendingSelected] = useState(false);
  const [allRecipes, setAllRecipes] = useState({});
  const [allNutritions, setAllNutritions] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false); // State for Modal visibility
  const { userId } = useContext(UserContext);
  const [currentCard, setCurrentCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardVisible, setIsCardVisible] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchinsight();
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;

    setIsLoading(false);  // Stop loading
  }, [fontsLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalVisible(true); // Show the modal after 5 seconds
    }, 2000); // 5 seconds delay

    return () => clearTimeout(timer); // Clean up the timer when the component is unmounted or updated
  }, []);

  const fetchRecipes = async () => {
    try {
      console.log("Fetching recipes from:", `${NGROK_URL}/api/recipes`);
      const response = await axios.get(`${NGROK_URL}/api/recipes`);
      const recipes = response.data;
      const categorizedRecipes = categorizeRecipes(recipes);
      setAllRecipes(categorizedRecipes);
      setFilteredRecipes(categorizedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchinsight = async () => {
    try {
      console.log("Fetching nutrition data from:", `${NGROK_URL}/api/nutritions`);
      const response = await axios.get(`${NGROK_URL}/api/nutritions/1`);
      const nutritions = response.data;
  
      // Assuming you want to pick the first nutrition insight to display in the modal (you can adjust this as per your need).
      setCurrentCard(nutritions);  // Set first nutrition insight as an example
    } catch (error) {
      console.error("Error fetching nutrition insights:", error);
    }
  };
  

  const categorizeRecipes = (recipes) => {
    if (!Array.isArray(recipes)) {
      console.error("Invalid recipes data:", recipes);
      return { Breakfast: [], Lunch: [], Dinner: [] };
    }

    const categories = { Breakfast: [], Lunch: [], Dinner: [] };
    recipes.forEach(recipe => {
      if (recipe.category in categories) {
        categories[recipe.category].push(recipe);
      }
    });
    return categories;
  };

  const filters = [
    { id: '1', name: 'Mealthy Top Picks' },
    { id: '2', name: 'Lactose Intolerant' },
    { id: '3', name: 'Gluten Free' },
    { id: '4', name: 'Vegetarian' },
  ];

  const trendingData = [
    { id: 'trend1', title: 'Plant-based Food', filter: 'plant-based', image: require('../assets/trending-page1.jpg') },
    { id: 'trend2', title: '15-minute Meals', filter: '15-minute', image: require('../assets/trending-page2.webp') },
  ];

  const filterRecipes = (filterId) => {
    if (filterId) {
      const filtered = {};
      Object.keys(allRecipes).forEach((section) => {
        filtered[section] = allRecipes[section].filter(recipe => recipe.filters.includes(filterId));
      });
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(allRecipes);
    }
  };

  const handleFilterSelect = (filterId) => {
    const newFilter = selectedFilter === filterId ? null : filterId;
    setSelectedFilter(newFilter);
    filterRecipes(newFilter);
  };

  const isPlantBased = (recipe) => {
    const meatKeywords = ["chicken", "beef", "pork", "salmon", "fish", "shrimp", "lamb", "turkey", "duck"];
    return !recipe.ingredients.some(ingredient =>
      meatKeywords.some(keyword => ingredient.toLowerCase().includes(keyword))
    );
  };

  const is15MinuteMeal = (recipe) => {
    if (typeof recipe.time === 'number') {
      return recipe.time === 15;
    }
    return false;
  };

  const handleTrendingSelect = (filter) => {
    setSelectedTrendingFilter(filter);
    setIsTrendingSelected(true);
    if (filter) {
      const filtered = {};
      Object.keys(allRecipes).forEach((section) => {
        let sectionRecipes = allRecipes[section];
        if (filter === 'plant-based') { 
          sectionRecipes = sectionRecipes.filter(recipe => isPlantBased(recipe));
        } else if (filter === '15-minute') {
          sectionRecipes = sectionRecipes.filter(recipe => is15MinuteMeal(recipe));
        }
        filtered[section] = sectionRecipes;
      });
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(allRecipes);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = {};
      Object.keys(allRecipes).forEach((section) => {
        filtered[section] = allRecipes[section].filter(recipe => recipe.title.toLowerCase().includes(text.toLowerCase()));
      });
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(allRecipes);
    }
  };

  const handleBackButton = () => {
    setIsTrendingSelected(false);
    setSelectedTrendingFilter(null);
    setFilteredRecipes(allRecipes);
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>
  }

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.filterItem, selectedFilter === item.id && styles.filterItemSelected]}
      onPress={() => handleFilterSelect(item.id)}
    >
      <Text style={[styles.filterText, selectedFilter === item.id && styles.filterTextSelected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }) => {
    const dynamicStyle = item.id === 'trend1' ? styles.trend1 : styles.trend2;

    return (
      <TouchableOpacity style={[styles.trendingItem]} onPress={() => handleTrendingSelect(item.filter)}>
        <ImageBackground source={item.image} style={styles.trendingImage} imageStyle={styles.trendingImage}>
          <Text style={[styles.trendingText, dynamicStyle]}>{item.title}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeItem} onPress={() => navigation.navigate('RecipeCard', { recipe: item, user_id : userId })}>
      <Image source={{ uri: item.image_url }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <View style={styles.recipeFooter}>
        <Text style={styles.recipeDetails}><FontAwesome5 name="clock" size={14} color="#777" />  {item.time} mins  |  <FontAwesome5 name="fire" size={14} color="#777" />  {item.calories} kcal </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (sectionTitle, data) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.recipe_id.toString()}
          renderItem={renderRecipeItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  if (!fontsLoaded || isLoading || !isCardVisible) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!currentCard) {
    return <View style={{ flex: 1 }}></View>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containersafe}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Modal Pop-up */}
          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.titlepopup}>
                  <Text style={styles.modalTitle}>Nutrition Insight</Text>
                  <Pressable onPress={closeModal} style={styles.closeModalButton}>
                    <Text style={styles.closeModalText}>X</Text>
                  </Pressable>
                </View>
                {/* Dynamically use currentCard data */}
                {currentCard && (
                  <>
                      <Image

                        source={{ uri: currentCard.image }}
                        style={[styles.image, styles.imageContainer]}
                      />
                      <Text style={styles.description}>{currentCard.description}</Text>
                      <View style={styles.list}>
                          {currentCard.list && Array.isArray(currentCard.list) ? (
                              currentCard.list.map((item, index) => (
                                  <Text key={index} style={styles.listItem}>
                                      {item}
                                  </Text>
                              ))
                          ) : (typeof currentCard.list === 'string' ? (
                              currentCard.list.split(',').map((item, index) => (
                                  <Text key={index} style={styles.listItem}>
                                      {item}
                                  </Text>
                              ))
                          ) : (
                              <Text>No List Available</Text>
                          ))}
                      </View>
                  </>
              )}
              </View>
            </View>
          </Modal>


          {!isTrendingSelected && (
            <FlatList
              data={filters}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={renderFilterItem}
              showsHorizontalScrollIndicator={false}
              style={styles.filterList}
            />
          )}

          <View style={styles.searchAndFilterContainer}>
            {isTrendingSelected && (
              <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
                <Icon name="arrow-left" size={30} color="black" />
              </TouchableOpacity>
            )}
            <View style={styles.searchContainer}>
              <Image source={require('../assets/search-icon.png')} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Find recipes"
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>
          </View>

          {!selectedFilter && !isTrendingSelected && (
            <View style={styles.trendinglist}>
              <Text style={styles.trendingTitle}>Trending</Text>
              <FlatList
                data={trendingData}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={renderTrendingItem}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {Object.keys(filteredRecipes).map((section) => (
            <View key={section}>
              {renderSection(section, filteredRecipes[section])}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <BottomNavigation navigation={navigation} activeRouteName="Recipe" />
    </View>
  );
};

export default RecipePage;