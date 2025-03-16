import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import styles from '../styles/6.2_BookmarkStyles';
import { UserContext } from '../config/UserContext';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { NGROK_URL } from "@env";
// import { useRoute } from '@react-navigation/native';

const BookmarkScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });

  const [searchText, setSearchText] = useState('');
  const tabs = ['Breakfast', 'Lunch', 'Dinner'];
  const [selectedTab, setSelectedTab] = useState(null);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const { userId } = useContext(UserContext);
  // const route = useRoute();
  // const { user_id } = route.params;

  useEffect(() => {
    const fetchBookmarkedRecipes = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/favorite_recipes`, {
          // params: { user_id: user_id }
          params: { user_id: userId }
        });

        const bookmarkedRecipes = response.data;
        // Filter based on selected tab and search text here
        const filtered = bookmarkedRecipes.filter(recipe => {
          const searchTextMatch = recipe.title.toLowerCase().includes(searchText.toLowerCase());
          const tabMatch = selectedTab ? recipe.category === selectedTab : true; // Check if the category matches the selected tab

          return searchTextMatch && tabMatch;
        });

        setFilteredBookmarks(filtered);
      } catch (error) {
        console.error("Error fetching bookmarked recipes:", error);
      }
    };

    fetchBookmarkedRecipes();
  }, [searchText, selectedTab, userId]); //  userId here to re-fetch when it changes

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleTabChange = (tab) => {
      setSelectedTab(currentTab => (currentTab === tab ? null : tab)); // Toggle the selected tab
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containersafe}>
        <View style={styles.searchAndFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
            {tabs.map((tab, index) => (
              <TouchableOpacity key={index} onPress={() => handleTabChange(tab)}>
                <View style={[styles.filterItem, selectedTab === tab && styles.filterItemSelected]}>
                  <Text style={[styles.filterText, selectedTab === tab && styles.filterTextSelected]}>{tab}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.searchContainer}>
            <Image source={require('../assets/search-icon.png')} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#777"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Bookmarked Recipe</Text>
          <View style={styles.recipeContainer}>
            {filteredBookmarks.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recipeItem}
                onPress={() => navigation.navigate('RecipeCard', { recipe: item })}>
                <Image source={{ uri: item.image_url }} style={styles.recipeImage} />
                <View style={styles.recipeTextContainer}>
                  <View style={styles.containername}>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name="clock" size={14} color="#777" />
                    <Text style={styles.recipeDetails}>{item.time} mins</Text>
                    <Text style={styles.separator}> | </Text>
                    <FontAwesome5 name="fire" size={14} color="#777" />
                    <Text style={styles.recipeDetails}>{item.calories} kcal</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('Recipe')}>
            <Text style={styles.infoText}>
              Find More Recipes? <Text>+</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {/* <BottomNavigation navigation={navigation} user_id={user_id} /> */}
      </SafeAreaView>
    </View>

  );
};

export default BookmarkScreen;