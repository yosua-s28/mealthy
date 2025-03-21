import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NGROK_URL } from "@env"; 

const NutritionManagement = ({ navigation }) => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  // Fetch nutrition insights from the backend
  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/nutritions`); // Replace with your machine's IP address
      console.log("Fetched nutrition insights:", response.data); // Log the response
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching nutrition insights:', error.message);
      alert("Error fetching nutrition insights: " + error.message);
    }
  };

  // Handle Add Nutrition Insight (Navigating to Add Insight Screen)
  const handleAddInsight = () => {
    navigation.navigate('AddNutritionInsight');
  };

  // Handle Delete Nutrition Insight
  const handleDeleteInsight = async (id) => {
    try {
      await axios.delete(`${NGROK_URL}/nutritions/${id}`);
      setInsights(insights.filter((insight) => insight.id !== id));
    } catch (error) {
      console.error('Error deleting nutrition insight', error.message);
      alert("Error deleting insight: " + error.message);
    }
  };

  return (
    <ImageBackground 
        source={require('./background.png')} // Replace with your background image path
        style={styles.backgroundImage}
      >
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Nutrition Insights</Text>
          </View>

          {/* Add Insight Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddInsight}>
              <Text style={styles.addButtonText}>+ Add Insight</Text>
            </TouchableOpacity>
          </View>

          {/* Nutrition Insight List */}
          <FlatList
            data={insights}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.insightCard}>
                {/* Display the image using the URL from the database */}
                {item.image_url ? (
                  <Image
                    source={{ uri: BASE_URL + item.image_url }} // Prepend base URL if it's a relative path
                    style={styles.insightImage}
                  />
                ) : (
                  <Image
                  //   source={require('../path/to/default_image.png')} // Fallback to default image
                    style={styles.insightImage}
                  />
                )}

                <View style={styles.insightDetails}>
                  <Text style={styles.insightText}>{item.title}</Text>
                  <Text style={styles.insightDescription}>{item.description}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleDeleteInsight(item.id)} style={styles.iconButton}>
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
  safeContainer: {
    
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the entire screen
    justifyContent: 'center', // Centers the content vertically
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  backButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    marginLeft: 8,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background to make text readable
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
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
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3, // For a shadow effect (Android)
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  insightImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  insightDetails: {
    flex: 1,
  },
  insightText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  insightDescription: {
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

export default NutritionManagement;
