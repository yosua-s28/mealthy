import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { NGROK_URL } from "@env";

const AddRecipe = () => {
  const navigation = useNavigation(); // Hook to access navigation
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState(''); // New state for author input
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', amount: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [time, setTime] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [filter, setFilter] = useState('');
  const [filterError, setFilterError] = useState('');

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', amount: '' }]);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const validateFilter = (filterInput) => {
    const validValues = ['1', '2', '3', '4'];
    const filterArray = filterInput.split(',').map(item => item.trim());

    // Check if all values in the filterArray are valid
    for (let i = 0; i < filterArray.length; i++) {
      if (!validValues.includes(filterArray[i])) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!['Breakfast', 'Lunch', 'Dinner'].includes(category)) {
      setCategoryError('Category must be one of: Breakfast, Lunch, or Dinner.');
      return;
    }

    // Validate the filter input
    if (!validateFilter(filter)) {
      setFilterError('Filter must be a comma-separated list of 1, 2, 3, or 4.');
      return;
    }

    const recipeData = {
      title,
      category,
      author,
      filter, // Include filter in the data to be sent to backend
      imageUrl,
      ingredients: ingredients.map(i => `${i.amount} ${i.ingredient}`).join(', '),
      instructions: instructions.join('. '),
      calories,
      fat,
      protein,
      carbs,
      time,
    };

    try {
      const response = await fetch(`${NGROK_URL}/addRecipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('./background.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
    
        <SafeAreaView style={styles.safecontainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Back Button outside the white container */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="black" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Add Recipe</Text>
            <View style={styles.bigContainer}>

              <Text style={styles.subHeader}>Recipe Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Recipe Name"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.subHeader}>Category:</Text>
              <TextInput
                style={[styles.input, categoryError ? styles.inputError : null]} // Add error style if there's an error
                placeholder="Enter Recipe Category (Breakfast, Lunch, Dinner)"
                value={category}
                onChangeText={(text) => {
                  setCategory(text);
                  setCategoryError(''); // Reset the error when the user types
                }}
              />
              {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}

              <Text style={styles.subHeader}>Author:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Author Name"
                value={author}
                onChangeText={setAuthor} // Update the author state
              />

              <Text style={styles.subHeader}>Filter (comma separated, e.g. 1,2):</Text>
              <TextInput
                style={[styles.input, filterError ? styles.inputError : null]}
                placeholder="Enter Filter (1, 2, 3, 4)"
                value={filter}
                onChangeText={(text) => {
                  setFilter(text);
                  setFilterError(''); // Reset the error when the user types
                }}
              />
              {filterError ? <Text style={styles.errorText}>{filterError}</Text> : null}

              <Text style={styles.subHeader}>Image URL:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Image URL"
                value={imageUrl}
                onChangeText={setImageUrl}
              />

              <Text style={styles.subHeader}>Cooking Duration (mins):</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Cooking Duration"
                value={time}
                keyboardType="numeric"
                onChangeText={setTime}
              />

              <Text style={styles.sectionHeader}>Nutritional Information:</Text>
              <Text style={styles.subHeader}>Calories:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Calories"
                value={calories}
                keyboardType="numeric"
                onChangeText={setCalories}
              />

              <Text style={styles.subHeader}>Fat:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Fat (g)"
                value={fat}
                keyboardType="numeric"
                onChangeText={setFat}
              />

              <Text style={styles.subHeader}>Protein:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Protein (g)"
                value={protein}
                keyboardType="numeric"
                onChangeText={setProtein}
              />

              <Text style={styles.subHeader}>Carbs:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Carbs (g)"
                value={carbs}
                keyboardType="numeric"
                onChangeText={setCarbs}
              />

              <Text style={styles.sectionHeader}>Ingredients:</Text>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientContainer}>
                  <View style={styles.row}>
                    <Text style={styles.label}>#{index + 1}</Text>
                    <TextInput
                      style={[styles.input, styles.ingredientsInput]}
                      placeholder="Enter Ingredient"
                      value={ingredient.ingredient}
                      onChangeText={(text) => {
                        const updatedIngredients = [...ingredients];
                        updatedIngredients[index].ingredient = text;
                        setIngredients(updatedIngredients);
                      }}
                    />
                    <TextInput
                      style={[styles.input, styles.ingredientsInput]}
                      placeholder="Enter Amount"
                      value={ingredient.amount}
                      onChangeText={(text) => {
                        const updatedIngredients = [...ingredients];
                        updatedIngredients[index].amount = text;
                        setIngredients(updatedIngredients);
                      }}
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Ingredient</Text>
              </TouchableOpacity>

              <Text style={styles.sectionHeader}>Instructions:</Text>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionContainer}>
                  <View style={styles.row}>
                    <Text style={styles.label}>#{index + 1}</Text>
                    <TextInput
                      style={[styles.input, styles.instructionsInput]}
                      placeholder={`Enter Instruction #${index + 1}`}
                      value={instruction}
                      onChangeText={(text) => {
                        const updatedInstructions = [...instructions];
                        updatedInstructions[index] = text;
                        setInstructions(updatedInstructions);
                      }}
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity onPress={handleAddInstruction} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Instruction</Text>
              </TouchableOpacity>

            </View>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Add Recipe</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
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
  bigContainer: {
    alignSelf:'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    width: '95%',
    paddingHorizontal: 7,
    marginTop: 10,
  },
  scrollContainer: {
    padding: 5,
    width: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'left',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  inputError: {
    borderColor: 'red',
  },
  ingredientsInput: {
    flex: 1,
    marginRight: 10,
  },
  instructionsInput: {
    height: 50,
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#425700',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
  },
  submitButtonText: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#D9D9D9',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
    textAlign: 'left',
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default AddRecipe;
