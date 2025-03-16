import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  FlatList,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { UserContext } from '../config/UserContext'; 
import axios from 'axios';
import { NGROK_URL } from "@env"; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CaloriePage = ({ navigation }) => {
  const { userId, calorieData, setCalorieData } = useContext(UserContext);
  const [selectedFood, setSelectedFood] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [foodData, setFoodData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch food data from the local API
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/foods`);
        setFoodData(response.data);
        if (response.data.length > 0) {
          setSelectedFood("Select Food");
        }
        
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
    };

    fetchFoods();
  }, []);

  const handleFoodSelection = (foodName) => {
    setSelectedFood(foodName);
    setModalVisible(false);
  };

  const handlePortionChange = (text) => {
    setPortionSize(text);
  };

  const getNutrients = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/foods/name/${selectedFood}`);
      const food = response.data;
  
      if (food && portionSize) {
        const portionFactor = parseFloat(portionSize) / 100;
        const caloriesForPortion = food.calories * portionFactor;
        const fatForPortion = food.fat * portionFactor;
        const proteinForPortion = food.protein * portionFactor;
  
        // Check if the food already exists in the entries
        const existingEntryIndex = calorieData.entries.findIndex(entry => entry.food === food.name);
  
        if (existingEntryIndex >= 0) {
          // If the food entry exists, update its values
          const updatedEntries = [...calorieData.entries];
          updatedEntries[existingEntryIndex] = {
            ...updatedEntries[existingEntryIndex],
            portion: (parseFloat(updatedEntries[existingEntryIndex].portion) + parseFloat(portionSize)).toString(),
            calories: (parseFloat(updatedEntries[existingEntryIndex].calories) + caloriesForPortion).toFixed(2),
            fat: (parseFloat(updatedEntries[existingEntryIndex].fat) + fatForPortion).toFixed(2),
            protein: (parseFloat(updatedEntries[existingEntryIndex].protein) + proteinForPortion).toFixed(2),
            date: new Date().toLocaleDateString(),
          };
  
          setCalorieData({
            ...calorieData,
            totalCalories: calorieData.totalCalories + caloriesForPortion,
            totalFat: calorieData.totalFat + fatForPortion,
            totalProtein: calorieData.totalProtein + proteinForPortion,
            entries: updatedEntries,
          });
        } else {
          // If the food entry doesn't exist, create a new one
          const newCalorieData = {
            ...calorieData,
            totalCalories: calorieData.totalCalories + caloriesForPortion,
            totalFat: calorieData.totalFat + fatForPortion,
            totalProtein: calorieData.totalProtein + proteinForPortion,
            entries: [
              ...calorieData.entries,
              {
                food: food.name,
                portion: portionSize,
                calories: caloriesForPortion.toFixed(2),
                fat: fatForPortion.toFixed(2),
                protein: proteinForPortion.toFixed(2),
                date: new Date().toLocaleDateString(),
              },
            ],
          };
  
          setCalorieData(newCalorieData);
        }
      } else {
        alert('Please provide a valid portion size!');
      }
    } catch (error) {
      console.error('Error fetching or processing food data:', error);
      alert('Failed to get nutrients. Please try again.');
    }
  };
  

  const clearAll = () => {
    const clearedData = {
      totalCalories: 0,
      totalFat: 0,
      totalProtein: 0,
      entries: [],
    };
    setCalorieData(clearedData);
    
    // Set selectedFood back to initial state (Select Food)
    setSelectedFood("Select Food");
  
    // Optional: Clear the portion size as well
    setPortionSize('');
  };
  

  const filteredFoodData = foodData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDiaryEntry = ({ item }) => (
    <View style={styles.diaryEntry}>
      <Text>{item.food}</Text>
      <Text>Portion: {item.portion} g</Text>
      <Text>Calories: {item.calories} kcal</Text>
      <Text>Fat: {item.fat} g</Text>
      <Text>Protein: {item.protein} g</Text>
      <Text>Date: {item.date}</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.type === 'nutrientInput') {
      return (
        <View style={{ padding: 30 }}>
          {/* Total Nutrients Display */}
          <View style={styles.nutrientcontainer}>
            <View style={styles.totalCaloriesContainer}>
              <Text style={styles.totalCaloriesText}>
                Total Calories: {calorieData.totalCalories.toFixed(2)}
              </Text>
              <Text style={styles.totalCaloriesText}>
                Total Fat: {calorieData.totalFat.toFixed(2)} g
              </Text>
              <Text style={styles.totalCaloriesText}>
                Total Protein: {calorieData.totalProtein.toFixed(2)} g
              </Text>
            </View>
          </View>

          {/* Food Selection and Portion Input */}
          <View style={styles.inputcontainer}>
            <View
              style={{
                padding: 10,
                backgroundColor: '#FFFBE2',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomWidth: 3,
              }}
            >
              <Text style={styles.title}>Enter Your Food and Portion</Text>
            </View>

            <View style={{ padding: 20 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.selector}
              >
                <Text style={styles.selectorText}>{selectedFood}</Text>
                <Icon name="arrow-down" style={styles.icon} />
              </TouchableOpacity>

              <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                  <View style={styles.modalContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search for food..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    <FlatList
                      data={filteredFoodData}
                      keyExtractor={(item) => item.food_id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => handleFoodSelection(item.name)}
                        >
                          <Text style={styles.modalItemText}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                      style={{ flex: 1 }}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                  </View>
                </SafeAreaView>
              </Modal>

              <TextInput
                style={styles.input}
                placeholder="Enter portion size (grams)"
                keyboardType="numeric"
                value={portionSize}
                onChangeText={handlePortionChange}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center', alignSelf: 'center' }}>
            {/* Add Food Button */}
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={getNutrients}
            >
              <Text style={styles.buttonText}>Add Food</Text>
            </TouchableOpacity>

            {/* Clear All Button */}
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={clearAll}
            >
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (item.type === 'diaryEntries') {
      return (
        <View style={styles.diarycontainer}>
          <View style={styles.diaryEntryContainer}>
            <Text style={styles.diaryTitle}>Diary Entries : </Text>
            <ImageBackground
              source={require('../assets/flame.png')}
              style={{ flex: 0.8 }}
              resizeMode="contain"
            >
              <FlatList
                data={calorieData.entries}
                renderItem={renderDiaryEntry}
                keyExtractor={(item, index) => index.toString()}
                style={styles.diaryList}
              />
            </ImageBackground>
          </View>
        </View>
      );
    }
    return null;
  };

  const flatListData = [
    { type: 'nutrientInput', id: 'nutrientInput' },
    { type: 'diaryEntries', id: 'diaryEntries' },
  ];


  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Header navigation={navigation} title="Calorie Counter" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <FlatList
              data={flatListData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ flex: 1 }}
            />
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <BottomNavigation navigation={navigation} activeRouteName="Calorie" />
    </View>
  );
};

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  tophat : {
    backgroundColor: '#C0C78C',
    height: '10%',
    maxHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',

  },
  texttop: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutrientcontainer:{
    backgroundColor: '#FFFBE2',
    padding: 10,
    borderColor: '#000',
    borderWidth: 3,
    borderRadius: 10,
    marginBottom: 20,
    width: '70%',
    alignSelf: 'center',
  },
  totalCaloriesContainer: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  totalCaloriesText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputcontainer: {
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#C0C78C',
    borderRadius: 11,
    borderWidth:3,
  },
  title: {
    fontSize: 20,
    marginVertical: 5,
    textAlign: 'center',
  },
  selector: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 100,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',           
    paddingHorizontal: 15,
  },
  icon: {
    marginLeft: 10,  
    alignSelf: 'center', 
    borderWidth: 1,         
    borderColor: '#000',   
    borderRadius: 50,       
    padding: 2,            
  },
  selectorText: {
    fontSize: 18,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color:'#000',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 18,
  },
  input: {
    borderRadius: 100,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center', // This ensures the text is centered inside the input field
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',  // This centers the input field horizontally within its container
    width: '90%',  // Adjust the width as needed
  },


  button: {
    backgroundColor: '#007AFF', // Default background color (iOS blue)
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8, // Adjust for desired roundness
    alignItems: 'center', // Center text horizontally
    margin: 5, // Add some margin around buttons
    width: '100%',
    borderWidth:3,
  },

  addButton: {
    backgroundColor: '#C0C78C', // Your desired "Add Food" color
  },

  deleteButton: {
    backgroundColor: '#FF0000', // Example: Red for delete
  },

  buttonText: {
    color: 'white', // Text color (usually white or black for contrast)
    fontWeight: 'bold',
    fontSize: 16,
  },

  diarycontainer:{
    marginTop: '5%',
    padding: '10',
    backgroundColor: '#C0C78C',
    minHeight: '50%',
    width: '100%',
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
    alignContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  diaryEntryContainer: {
    flex: 1,
    padding: 30,
    marginTop: '4%',
    backgroundColor: '#FFFBE2',
    width: '95%',
    borderTopRightRadius:50,
    borderTopLeftRadius:50,

  },
  diaryTitle: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  diaryList: {
    marginTop: 20,
    flex:1,
  },
  diaryEntry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default CaloriePage;