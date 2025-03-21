import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NGROK_URL } from "@env"; 

const AllergyManagement = ({ navigation }) => {
  const [allergies, setAllergies] = useState([]);

  useEffect(() => {
    // Fetch allergies on initial load
    fetchAllergies();

    // Re-fetch allergies when the screen comes into focus (after navigating back)
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllergies();
    });

    // Cleanup listener when the component is unmounted or screen loses focus
    return unsubscribe;
  }, [navigation]);

  // Fetch allergy data from the backend
  const fetchAllergies = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/allergies`); // Fetch allergy data from the server
      console.log("Fetched allergies:", response.data); // Log the response
      setAllergies(response.data);
    } catch (error) {
      console.error('Error fetching allergies:', error.message);
      alert("Error fetching allergies: " + error.message);
    }
  };

  // Handle Edit Allergy
  const handleEditAllergy = (id) => {
    navigation.navigate('EditAllergy', { id });
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
            <Text style={styles.headerText}>Allergy Management</Text>
          </View>

          {/* Allergy List */}
          <FlatList
            data={allergies}
            keyExtractor={(item) => item.allergy_id}
            renderItem={({ item }) => (
              <View style={styles.allergyCard}>
                <View style={styles.allergyDetails}>
                  {/* Displaying the allergy ID */}
                  <Text style={styles.allergyText}>{item.allergy_id}</Text>

                  {/* Displaying allergens as a comma-separated list */}
                  <Text style={styles.allergyName}>
                    {Array.isArray(item.name) ? item.name.join(', ') : item.name}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => navigation.navigate('EditAllergy', { allergy: item })} style={styles.iconButton}>
                    <Text style={styles.iconText}>✏️</Text>
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
  allergyCard: {
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
  allergyDetails: {
    flex: 1,
  },
  allergyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  allergyName: {
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

export default AllergyManagement;
