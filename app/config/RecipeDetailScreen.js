import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function RecipeDetailScreen({ route }) {
    const { recipe } = route.params;
    // Static user data (replace with actual user data in a real app)
    const username = "Mie";
    const userHandle = "@bakmielovers";
    const profileImage = null; // You might want to show a default icon if there is no profile picture.
    const navigation = useNavigation();


    const handleBack = () => {
        navigation.goBack();
    };


    return (
        <SafeAreaView style={styles.containersafe}>
            <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
            <View style={styles.headerContainer}>
                {/* User Info */}
                <View style={styles.userInfo}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={28} color="#000" />
                    )}
                    <View style={styles.usernameHandleContainer}>
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.userHandle}>
                            {userHandle}
                        </Text>
                    </View>
                </View>
            </View>


            <View style={styles.contentContainer}>
                <Text style={styles.title}>{recipe.title}
                    {recipe.calories ? ` (${recipe.calories} kkal)` : ''}
                    </Text>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                    {recipe.ingredients.map((item, index) => {
                            const [ingredient, weight] = item.split(" - ");
                            return(
                            <View key={index} style={styles.ingredientRow}>
                                    <Text style={styles.ingredientText}>{ingredient}</Text>
                                    <Text style={styles.weightText}>{weight}</Text>
                                </View>
                            );
                        })}
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        {recipe.instructions.map((item, index) => (
                                <Text key={index} style={styles.instructionText}>{index + 1}. {item}</Text>
                            ))}
            </View>
            </View>
            </ScrollView>
        </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    containersafe:{
        flex:1,
        height:'100%',
    },
    scrollViewContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 10,
        flexGrow: 1,
    },
     container: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 12,
        backgroundColor: '#BFC693',
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    headerContainer: {
        marginBottom: 10,
         paddingTop: 10,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
     usernameHandleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    username: {
        fontWeight: "bold",
        fontSize: 18,
        color: '#000',
        marginRight: 5,
    },
    userHandle: {
        fontSize: 18,
        color: "gray"
    },
    profileImage: {
        width: 28,
        height: 28,
        borderRadius: 12,
        marginRight: 5,
    },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#000',
    },
    contentContainer: {
        backgroundColor: '#F5F2E5',
       padding: 15,
        borderRadius: 12,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        marginLeft: 30,
    },
  sectionTitle: {
     fontSize: 18,
        fontWeight: 'bold',
    marginTop: 15,
      marginBottom: 5,
       color: '#000',
         marginLeft: 3,
  },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
          marginBottom: 4,
    },
   ingredientText: {
        fontSize: 16,
       color: '#333',
        lineHeight: 20,
        marginLeft: 3,
    },
   weightText: {
        fontSize: 16,
         color: '#333',
         lineHeight: 20,
    },
    instructionText: {
       fontSize: 16,
        marginLeft: 10,
      marginTop: 5,
        color: '#333',
        lineHeight: 20,
    },
});
