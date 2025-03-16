import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableWithoutFeedback, ScrollView, Text, TouchableOpacity, Platform, Appearance, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import MealItem from '../components/MealItem';
import { useFonts } from 'expo-font';
import BottomNavigation from '../components/BottomNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/6.3_MealPlannerStyles';
import { UserContext } from '../config/UserContext';
import axios from 'axios';
// import { useRoute } from '@react-navigation/native';
import { NGROK_URL } from "@env";

const MealPlannerPage = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mealPlans, setMealPlans] = useState({ breakfast: [], lunch: [], dinner: [] });
  // const route = useRoute();
  // const { user_id } = route.params; 
  const { userId } = useContext(UserContext);

  const fetchMealPlans = async (selectedDate) => {
    const mealDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    try {
      const response = await axios.get(`${NGROK_URL}/meal_planner`, {
        // params: { user_id: user_id, meal_date: mealDate }
        params: { user_id: userId, meal_date: mealDate }
      });
      const plans = response.data;
      const breakfast = plans.filter(plan => plan.meal_time === 'Breakfast');
      const lunch = plans.filter(plan => plan.meal_time === 'Lunch');
      const dinner = plans.filter(plan => plan.meal_time === 'Dinner');
      setMealPlans({ breakfast, lunch, dinner });
    } catch (error) {
      console.error("Error fetching meal plans:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchMealPlans(date);
  }, [date]);

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      fetchMealPlans(selectedDate);
    }
    setShowPicker(false); // Close picker after selection
  };

    const handleMealPress = async (recipeId) => {
        try {
            const response = await axios.get(`${NGROK_URL}/api/recipes/${recipeId}`);
            const recipe = response.data;
            navigation.navigate('RecipeCard', { recipe: recipe }); // Pass the entire recipe object
        } catch (error) {
            console.error("Error fetching recipe details:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
      <View style={styles.container}>  
        <SafeAreaView style={styles.containersafe}>
          <Header navigation={navigation} title="MY MEAL PLANNERS" />
  
  
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            
            <View style={styles.mealSection}>
              <Text style={styles.mealTitle}>Breakfast &gt;</Text>
              <View style={{ alignItems: 'center' }}>
                {mealPlans.breakfast.length > 0 ? (
                  mealPlans.breakfast.map((meal, index) => (
                    <MealItem key={index} imageUrl={meal.image_url} mealName={meal.title} onPress={() => handleMealPress(meal.recipe_id)} />
                  ))
                ) : (
                  <View style={styles.emptyMealBox}>
                    <Text style={styles.emptyMealText}>No meal planned in this time</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.mealSection}>
              <Text style={styles.mealTitle}>Lunch &gt;</Text>
              <View style={{ alignItems: 'center' }}>
                {mealPlans.lunch.length > 0 ? (
                  mealPlans.lunch.map((meal, index) => (
                    <MealItem key={index} imageUrl={meal.image_url} mealName={meal.title} onPress={() => handleMealPress(meal.recipe_id)} />
                  ))
                ) : (
                  <View style={styles.emptyMealBox}>
                    <Text style={styles.emptyMealText}>No meal planned in this time</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.mealSection}>
              <Text style={styles.mealTitle}>Dinner &gt;</Text>
              <View style={{ alignItems: 'center' }}>
                {mealPlans.dinner.length > 0 ? (
                  mealPlans.dinner.map((meal, index) => (
                    <MealItem key={index} imageUrl={meal.image_url} mealName={meal.title} onPress={() => handleMealPress(meal.recipe_id)} />
                  ))
                ) : (
                  <View style={styles.emptyMealBox}>
                    <Text style={styles.emptyMealText}>No meal planned in this time</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        {/* <BottomNavigation navigation={navigation} user_id={user_id}/> */}
        </SafeAreaView>
        <BottomNavigation navigation={navigation} user_id={userId}/>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MealPlannerPage;