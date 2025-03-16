import React, { useState, useContext } from 'react';
import { View, TouchableWithoutFeedback, Text, TouchableOpacity, Platform, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import styles from '../styles/3.1_MakePlannerStyles';
import { UserContext } from '../config/UserContext';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import axios from 'axios'; // Add this import
import { NGROK_URL } from "@env"; // Add this import

const MakePlannerPage = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });

  const route = useRoute();
  // Get the recipeImage, recipeTitle, and recipeId passed from RecipeCard
  const { recipeImage, recipeTitle, recipeId } = route.params;
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { userId } = useContext(UserContext);

  // State to handle toggle for time buttons
  const [selectedMeal, setSelectedMeal] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const toggleMeal = (meal) => {
    setSelectedMeal((prevState) => ({
      ...prevState,
      [meal]: !prevState[meal],
    }));
  };

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  // Check if any meal is selected
  const isSubmitDisabled = !selectedMeal.breakfast && !selectedMeal.lunch && !selectedMeal.dinner;

  const handleSubmit = async () => {
    const mealTime = selectedMeal.breakfast ? 'Breakfast' : selectedMeal.lunch ? 'Lunch' : 'Dinner';
    const mealDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    try {
      const response = await axios.post(`${NGROK_URL}/meal_planner`, {
        user_id: userId,
        recipe_id: recipeId,
        meal_time: mealTime,
        meal_date: mealDate,
        recipe_image: recipeImage, // Pass the recipe image
        recipe_title: recipeTitle // Pass the recipe title
      });
      console.log("Meal planner saved:", response.data); // Add this line for debugging
      navigation.goBack(); // Navigate back to the previous screen (RecipeCard)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert("Error", error.response.data); // Show alert for duplicate entry
      } else {
        console.error("Error saving meal planner:", error.response ? error.response.data : error.message); // Add detailed error logging
      }
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
      <SafeAreaView style={{ display: 'flex', height: '100%' }}>
        {/* dari View jadi ScrollView karena tidak bisa di scroll */}
          {/* Header with Back Button and Title */}
          <Header navigation={navigation} title="MEAL PLANNER" />

          {/* Render the image received from RecipeCard above the date */}
          {recipeImage && (
            <View style={{ marginVertical: 20 }}>
              <Image source={{ uri: recipeImage }} style={styles.mealImage} />
              <Text style={styles.mealName}>{recipeTitle}</Text>
            </View>
          )}

          {/* Date Container */}
          <View style={styles.dateWrapper}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateContainer} onPress={() => setShowPicker(!showPicker)}>
              <Icon name="calendar" size={20} color="#555" style={styles.icon} />
              <Text style={styles.dateText}>
                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
              <View style={styles.pickerOverlay}>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                    onChange={onChangeDate}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* Time Section with Breakfast, Lunch, and Dinner in separate lines */}
          <View style={styles.timeWrapper}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timeContainer}>
              {/* Breakfast */}
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  selectedMeal.breakfast && styles.selectedTimeButton,
                ]}
                onPress={() => toggleMeal('breakfast')}
              >
                <Icon
                  name="clock"
                  size={20}
                  color={selectedMeal.breakfast ? "#FFF" : "#555"}
                />
                <Text
                  style={[
                    styles.timeText,
                    selectedMeal.breakfast && styles.selectedTimeText,
                  ]}
                >
                  Breakfast
                </Text>
              </TouchableOpacity>
              {/* Lunch */}
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  selectedMeal.lunch && styles.selectedTimeButton,
                ]}
                onPress={() => toggleMeal('lunch')}
              >
                <Icon
                  name="clock"
                  size={20}
                  color={selectedMeal.lunch ? "#FFF" : "#555"}
                />
                <Text
                  style={[
                    styles.timeText,
                    selectedMeal.lunch && styles.selectedTimeText,
                  ]}
                >
                  Lunch
                </Text>
              </TouchableOpacity>
              {/* Dinner */}
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  selectedMeal.dinner && styles.selectedTimeButton,
                ]}
                onPress={() => toggleMeal('dinner')}
              >
                <Icon
                  name="clock"
                  size={20}
                  color={selectedMeal.dinner ? "#FFF" : "#555"}
                />
                <Text
                  style={[
                    styles.timeText,
                    selectedMeal.dinner && styles.selectedTimeText,
                  ]}
                >
                  Dinner
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.saveContainer}>
            {/* Ganti fungsi onPress pada tombol submit */}
            <TouchableOpacity
              style={[styles.saveButton, isSubmitDisabled && styles.disabledButton]} // Menambahkan style disabledButton jika tombol tidak aktif
              onPress={handleSubmit} // Update the onPress handler
              disabled={isSubmitDisabled} // Menonaktifkan tombol submit jika tidak ada meal yang dipilih
            >
              <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default MakePlannerPage;