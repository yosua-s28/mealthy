import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AdminPage = ({ navigation }) => {
  const [buttonColor, setButtonColor] = useState('#FFFFFF'); // Initial color of the button

  return (
    <ImageBackground 
      source={require('./background.png')} // Replace with your PNG file path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>MEALTHY</Text>

          {/* Insert image here */}
          <Image
            source={require('../app/assets/logo_#fefae0.png')} // Replace with your image path
            style={styles.logoImage}
          />
          {/* <img src='https://res.cloudinary.com/dvcu0dnvh/image/upload/v1741147215/Resep/cm7at0kvpvrjts0armzr.jpg'/>  */}
          <Text style={styles.subHeaderText}>Keep It Healthy</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]} // Dynamically change button color
            onPressIn={() => setButtonColor('#D3E8D3')} // Change to light green on hover
            onPressOut={() => setButtonColor('#FFFFFF')} // Revert to white after hover
            onPress={() => navigation.navigate('RecipeManagement')} // Navigate to RecipeManagement screen
          >
            <Text style={styles.buttonText}>Recipe Management</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPressIn={() => setButtonColor('#D3E8D3')}
            onPressOut={() => setButtonColor('#FFFFFF')}
            onPress={() => navigation.navigate('NutritionManagement')}
          >
            <Text style={styles.buttonText}>Nutrition Insight Management</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPressIn={() => setButtonColor('#D3E8D3')}
            onPressOut={() => setButtonColor('#FFFFFF')}
            onPress={() => navigation.navigate('ReportManagement')}
          >
            <Text style={styles.buttonText}>Community Report Management</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPressIn={() => setButtonColor('#D3E8D3')}
            onPressOut={() => setButtonColor('#FFFFFF')}
            onPress={() => navigation.navigate('AllergyManagement')}
          >
            <Text style={styles.buttonText}>Allergy Management</Text>
          </TouchableOpacity>
        </View>
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
    resizeMode: 'cover', // Ensures the background image covers the entire screen
    justifyContent: 'center', // Aligns the content in the center vertically
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2A2A2A', // Darker color for text
  },
  subHeaderText: {
    fontSize: 20,
    color: '#2A2A2A',
  },
  logoImage: {
    width: 100, // Adjust size of the image
    height: 100, // Adjust size of the image
    marginVertical: 10, // Space between the image and the text
    resizeMode: 'contain', // Ensures the image fits proportionally within the container
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#2A2A2A', // Dark color for text
  },
});

export default AdminPage;
