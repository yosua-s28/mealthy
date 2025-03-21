import React, { useState, useCallback } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import for navigation and useFocusEffect
import { NGROK_URL } from "@env";

const AddNutrition = () => {
  const navigation = useNavigation(); // Hook to access navigation
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [list, setList] = useState('');
  const [tip, setTip] = useState('');

  // Reset state when the page is focused
  useFocusEffect(
    useCallback(() => {
      // Reset the form fields when the page is focused
      setTitle('');
      setDescription('');
      setImageUrl('');
      setList('');
      setTip('');
    }, [])
  );

  const handleSubmit = async () => {
    if (!title || !description || !imageUrl || !list || !tip) {
      alert("Please fill all the fields.");
      return;
    }

    // Convert the list into an array by splitting the string at commas and trimming extra spaces
    const nutritionData = {
      title,
      description,
      imageUrl,
      list: list.split(',').map(item => item.trim()), // Convert to array
      tip,
    };

    // Log the nutrition data before sending the request
    console.log("Sending nutrition data:", nutritionData);

    try {
      const response = await fetch(`${NGROK_URL}/addnutrition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutritionData),
      });

      // Check if response is OK, then parse it
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);  // Log the successful response
        alert("Nutrition added successfully!");
        navigation.goBack(); // Go back after successful submission
      } else {
        // Log the raw response if not OK
        const errorMessage = await response.text();
        console.error("Error from server:", errorMessage);
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safecontainer}>
      <ImageBackground 
        source={require('./background.png')} // Replace with your background image path
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Back Button outside the white container */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.bigContainer}>
            <Text style={styles.header}>Add Nutrition</Text>

            <Text style={styles.subHeader}>Nutrition Title:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Nutrition Title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.subHeader}>Description:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.subHeader}>Image URL:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
            />

            <Text style={styles.subHeader}>List (Nutritional Elements):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Nutritional List (comma separated)"
              value={list}
              onChangeText={setList}
            />

            <Text style={styles.subHeader}>Tips:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Tips"
              value={tip}
              onChangeText={setTip}
            />

          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add Nutrition</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
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
    alignItems: 'center',
    alignSelf:'center',
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
});

export default AddNutrition;
