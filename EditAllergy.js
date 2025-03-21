import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { NGROK_URL } from "@env"; 

const EditAllergy = ({ route, navigation }) => {
    const { allergy } = route.params;

    // If allergy data is missing, show a loading or error message
    if (!allergy) {
        return <Text>Loading allergy data...</Text>;
    }

    // Initialize allergens as an array (either pre-existing data or empty)
    const [allergens, setAllergens] = useState(
        Array.isArray(allergy.name) ? allergy.name : allergy.name.split(',').map(item => item.trim())
    );

    // Add a new allergen to the list
    const addAllergen = () => {
        if (newAllergen.trim() !== '') {
            setAllergens([...allergens, newAllergen.trim()]);
            setNewAllergen(''); // Clear input field after adding
        }
    };

    // Remove an allergen from the list
    const removeAllergen = (index) => {
        const updatedAllergens = allergens.filter((_, i) => i !== index);
        setAllergens(updatedAllergens);
    };

    // Handle saving the allergens
    const handleSave = () => {
    axios.put(`${NGROK_URL}/allergies/${allergy.allergy_id}`, { name: allergens })
        .then(response => {
            navigation.goBack(); // Navigate back after saving
        })
        .catch(error => {
            console.error('Error saving allergy data', error);
        });
};


    // State for the new allergen input field
    const [newAllergen, setNewAllergen] = useState('');

    return (
        <ImageBackground 
            source={require('./background.png')} // Replace with your background image path
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                {/* Title Page Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Edit Allergy</Text>
                </View>

                {/* Allergy Input Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Input the new allergen :</Text>
                    <TextInput
                        value={newAllergen}
                        onChangeText={setNewAllergen}
                        style={styles.textInput}
                        placeholder="Enter allergen"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addAllergen}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>

                    {/* Display allergens as individual tags */}
                    <FlatList
                        data={allergens}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.allergenContainer}>
                                <Text style={styles.allergenText}>{item}</Text>
                                <TouchableOpacity onPress={() => removeAllergen(index)} style={styles.removeButton}>
                                    <Text style={styles.removeButtonText}>x</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
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
    formContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FFFF', // Cream background color for the form
        borderRadius: 12,
        width:'90%',
        alignSelf:'center'
    },
    label :{
        marginLeft:5,
    },
    textInput: {
        borderBottomWidth: 1,
        marginBottom: 10,
        fontSize: 16,
        padding: 5,
    },
    addButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#4CAF50',
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 20,
    },
    allergenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    allergenText: {
        backgroundColor: '#e0f7fa',
        padding: 8,
        borderRadius: 12,
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: '#f44336',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    removeButtonText: {
        color: 'white',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditAllergy;
