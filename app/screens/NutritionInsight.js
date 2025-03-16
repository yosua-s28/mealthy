import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font'; // Import useFonts
import Checkbox from 'expo-checkbox'; // Import Checkbox
import BottomNavigation from '../components/BottomNavigation';


const NutritionCard = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });

  const [currentCard, setCurrentCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [isCardVisible, setIsCardVisible] = useState(true); // State for hiding the card

  useEffect(() => {
    if (!fontsLoaded) return;  // Do not run fetchData if fonts are not loaded yet.

    // Set a dummy card instead of fetching from API
    const dummyCard = {
      id: 1,
      title: "Healthy Fats",
      image: '../assets/Pic.png',
      description: "Not all fats are bad. Healthy fats are essential for brain function and energy.",
      list: [
        "Avocados","Nuts","Fatty fish (salmon, tuna)","Olive oil"
      ],
      tip:"Opt for unsaturated fats and avoid trans fats or excessive saturated fats.",
    };

    setCurrentCard(dummyCard);  // Set the dummy card
    setIsLoading(false);  // Stop loading
  }, [fontsLoaded]);

  const handleDontShowAgain = (id) => {
    console.log('Preference saved for card:', id);  // For now just log to console
  };

  const handleCloseCard = () => {
    navigation.navigate('Recipe'); // Hide the card when the close button is clicked
  };

  if (!fontsLoaded || isLoading || !isCardVisible) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading or nothing if card is hidden
  }

  if (!currentCard) {
    return <View style={{ flex: 1 }}></View>; // Empty view if no card available
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{currentCard.title}</Text>
            <TouchableOpacity style={styles.closeButtonContainer} onPress={handleCloseCard}>
              <View style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/Pic.png')} // Ensure you're using `require()` for local images
            style={[styles.image, styles.imageContainer]}
          />

        </View>
        <Text style={styles.description}>{currentCard.description}</Text>
        <View style={styles.list}>
          {currentCard.list.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              {item}
            </Text>
          ))}
        </View>
        <Text style={styles.tip}>{currentCard.tip}</Text>

        {/* Checkbox and Label */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isChecked}
            onValueChange={(newValue) => {
              setIsChecked(newValue);
              if (newValue) {
                handleDontShowAgain(currentCard.id);
              }
            }}
            color={isChecked ? '#4630EB' : undefined}
          />
          <Text style={styles.checkboxLabel}>Don't show me again today</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 10,
    paddingTop: 70,
    // paddingBottom: 70,
  },
  card: {
    backgroundColor: '#F8F8E8',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexGrow: 1,
    marginBottom: 20,
  },
  headerContainer: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    marginTop: -20,
    height: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A6B37D',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'PlusJakartaSans-VariableFont_wght',
  },
  closeButtonContainer: {
    padding: 5,
    backgroundColor: '#CC5C5C',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 250,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  imageContainer: {
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  description: {
    fontSize: 23,
    color: '#567100',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'PlusJakartaSans-VariableFont_wght',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  list: {
    marginVertical: 10,
    paddingHorizontal: 40,
  },
  listItem: {
    fontSize: 16,
    color: '#567100',
    marginVertical: 2,
    fontFamily: 'PlusJakartaSans-VariableFont_wght',
    textAlign: 'center',
  },
  tip: {
    fontSize: 16,
    color: '#567100',
    fontStyle: 'italic',
    marginVertical: 10,
    fontFamily: 'PlusJakartaSans-VariableFont_wght',
    marginHorizontal: 35,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontFamily: 'PlusJakartaSans-VariableFont_wght',
  },
});

export default NutritionCard;
