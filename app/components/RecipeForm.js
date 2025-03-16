import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function RecipeForm({ onPost, onRemove }) {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([{ id: 1, name: '', weight: '' }]);
    const [instructions, setInstructions] = useState([{ id: 1, text: '' }]);
    const [calories, setCalories] = useState(''); // Added state for calories


     // Static user data (replace with actual user data in a real app)
    const profileImage = null; // You might want to show a default icon if there is no profile picture.


    const addIngredient = () => {
        setIngredients([...ingredients, { id: ingredients.length + 1, name: '', weight: '' }]);
    };


    const addInstruction = () => {
        setInstructions([...instructions, { id: instructions.length + 1, text: '' }]);
    };


    const handleRemovePress = () => {
        onRemove();
    };


      const handlePostPress = () => {
        const recipeData = {
          title,
          ingredients: ingredients.map((item) => `${item.name} - ${item.weight}`),
          instructions: instructions.map((item) => item.text),
          calories: calories,
        };
        onPost(recipeData);
      };
    const isAddRecipeButtonDisabled = useMemo(() => {
        return (
             !title.trim() &&
             ingredients.every(item => !item.name.trim() && !item.weight.trim()) &&
             instructions.every(item => !item.text.trim())
         );
      }, [title, ingredients, instructions]);




    return (
         <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
            {/* Title and Profile Icon */}
            <View style={styles.titleContainer}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <Ionicons name="person-circle-outline" size={24} color="#000" />
                )}
                <TextInput
                  style={styles.titleInput}
                 placeholder="Recipe Title"
                value={title}
                onChangeText={setTitle}
               />
           </View>




          {/* Ingredients Section */}
           <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              {ingredients.map((item, index) => (
                    <View key={item.id} style={styles.inputRow}>
                       <TextInput
                           style={[styles.ingredientInput]}
                           placeholder={`Ingredient`}
                            value={item.name}
                           onChangeText={(text) =>
                              setIngredients(
                                   ingredients.map((ing) =>
                                      ing.id === item.id ? { ...ing, name: text } : ing
                                   )
                              )
                           }
                         />
                         <TextInput
                            style={[styles.weightInput]}
                             placeholder={`Weight`}
                            value={item.weight}
                           onChangeText={(text) =>
                                setIngredients(
                                  ingredients.map((ing) =>
                                   ing.id === item.id ? { ...ing, weight: text } : ing
                                   )
                               )
                           }
                       />
                    {index === ingredients.length - 1 && (
                           <TouchableOpacity onPress={addIngredient} style={styles.plusButton}>
                                <Text style={styles.plusButtonText}>+</Text>
                           </TouchableOpacity>
                        )}
                   </View>
                 ))}
          </View>


           {/* Calories Section */}
            <View style={[styles.caloriesContainer, { marginTop: 2, justifyContent: 'flex-end' }]}>
                <Text style={styles.totalCalories}>Total Calories</Text>
                <TextInput
                    style={[styles.caloriesInput, { width: '25%' }]}
                    placeholder='0'
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType='number-pad'
                  />
                <Text style={styles.caloriesUnit}>kkal</Text>
           </View>


           {/* Instructions Section */}
          <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Instructions</Text>
                </View>
                {instructions.map((item, index) => (
                   <View key={item.id} style={styles.inputRow}>
                       <Text style={[styles.stepNumber, { alignSelf: 'flex-start'}]}>{index + 1}.</Text>
                       <TextInput
                            style={[styles.instructionInput, { flex: 1}]}
                            placeholder={`Step ${index + 1}`}
                            value={item.text}
                           onChangeText={(text) =>
                               setInstructions(
                                   instructions.map((ins) =>
                                   ins.id === item.id ? { ...ins, text } : ins
                                   )
                               )
                           }
                       />
                     {index === instructions.length - 1 && (
                        <TouchableOpacity onPress={addInstruction} style={styles.plusButton}>
                             <Text style={styles.plusButtonText}>+</Text>
                         </TouchableOpacity>
                     )}
                   </View>
                ))}
          </View>
            {/* Button Container */}
           <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.removeButton} onPress={handleRemovePress}>
                <Text style={styles.removeButtonText}>Remove Recipe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[
                    styles.postButton,
                       isAddRecipeButtonDisabled ? styles.disabledPostButton : {},
                    ]}
                  onPress={handlePostPress}
                  disabled={isAddRecipeButtonDisabled}
                >
                <Text style={styles.postButtonText}>Add Recipe</Text>
              </TouchableOpacity>
           </View>
        </View>
             </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollViewContainer: {
         flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 20,
    },
    container: {
        padding: 15,
        backgroundColor: '#BFC693',
        borderRadius: 10,
    },
       titleContainer: {
         flexDirection: 'row',
         alignItems: 'center',
        marginBottom: 10,
        },
        profileImage: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
      titleInput: {
         borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingVertical: 10,
         fontSize: 18,
          flex: 1,
          marginLeft: 5,
    },
   sectionContainer: {
        marginBottom: 15
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
         marginBottom: 5
    },
    sectionTitle: {
      fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 30,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginRight: 5,
        flexWrap: 'nowrap',
    },
    stepNumber: {
      marginTop: 9,
        marginRight: 5,
         fontSize: 16,
        marginLeft: 30,
    },
    plusButton: {
        borderRadius: 15,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    plusButtonText: {
        color: '#000',
        fontSize: 25,
        fontWeight: 'bold',
    },
   ingredientInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingVertical: 8,
        marginBottom: 5,
        fontSize: 16,
        flex: 2,
        maxWidth: '50%',
        marginLeft: 30,
    },
    weightInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      paddingVertical: 8,
      marginLeft: 5,
      marginBottom: 5,
      fontSize: 16,
      flex: 1,
      maxWidth: '25%',
    },
    instructionInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      paddingVertical: 8,
      fontSize: 16,
      marginLeft: 10,
    },
    caloriesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
       
    },
    totalCalories: {
       fontSize: 16,
       fontWeight: 'bold',
       marginRight: 5,
       
    },
     caloriesInput: {
        backgroundColor: '#D9D9D9',
        border: 'none',
        borderColor: '#000000',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 16,
        marginRight: 8,
        textAlign: 'center',
     },
    caloriesUnit: {
       fontSize: 16,
       fontWeight: 'bold'
    },
      buttonContainer: {
         marginTop: 15,
          paddingHorizontal: 10,
           justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'flex-end'
      },
    disabledPostButton: {
         backgroundColor: '#999',
    },
    postButton: {
        backgroundColor: '#425700',
        padding: 12,
        paddingHorizontal: 40,
        borderRadius: 20,
        alignItems: 'flex-end',
        marginTop: 5,
    },
    postButtonText: {
        color: '#FFFBE2',
        fontWeight: 'bold',
        fontSize: 16,
    },
    removeButton: {
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 90,
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 5,
    },
    removeButtonText: {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: 16,
    },
    allText: {
       marginBottom:10,
   },
});
