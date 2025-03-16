import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const MealItem = ({ mealName, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Large image on top */}
      <Image source={{ uri: imageUrl }} style={styles.cardImage} />
      
      {/* Text container below the image */}
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{mealName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: '#FFF9DB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
    overflow: 'hidden', // ensures the image corners follow card radius
    // Shadow / elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 333, // adjust as needed
    resizeMode: 'cover',
  },
  cardTextContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MealItem;
