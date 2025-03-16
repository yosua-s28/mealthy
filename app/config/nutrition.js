import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';

const NutritionCard = () => {
    const [doNotShow, setDoNotShow] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    'PlusJakartaSans-VariableFont_wght': require('./assets/fonts/PlusJakartaSans-VariableFont_wght.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Error loading fonts:', error);
            }
        };

        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null; // Atau return loading screen
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                  <View style={styles.header}>
                      <Text style={styles.title}>Nutrition Insights</Text>
                      <TouchableOpacity style={styles.closeButtonContainer}>
                          <View style={styles.closeButton}>
                              <Text style={styles.closeText}>×</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.imageWrapper}>
                    <Image
                        source={require('../assets/Pic.png')}
                        style={[styles.image, styles.imageContainer]}
                    />
                </View>
                <Text style={styles.description}>
                    Not all fats are bad for you. Healthy fats are essential for brain function and energy.
                </Text>
                <View style={styles.list}>
                    <Text style={styles.listItem}>
                        • Healthy Fats: Avocados, nuts, fatty fish (salmon, tuna), olive oil.
                    </Text>
                    <Text style={styles.listItem}>
                        • Unhealthy Fats: Fast food, processed snacks, sugary treats.
                    </Text>
                </View>
                <Text style={styles.tip}>
                    Tip: Opt for unsaturated fats and avoid trans fats or excessive saturated fats.
                </Text>
                <View style={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={doNotShow}
                        onChange={() => setDoNotShow(!doNotShow)}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkboxText}>don't show me again today</Text>
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
        paddingHorizontal: 10,
        paddingTop: 70,
        paddingBottom: 70,
    },
    card: {
        backgroundColor: '#F8F8E8',
        borderRadius: 10,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        flexGrow: 1,
    },
    headerContainer: {
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        marginTop: -20,  // Untuk menghilangkan space atas header
        height: 70,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20, // Sesuaikan padding horizontal
        backgroundColor: '#A6B37D',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        flex: 1,
        fontFamily: 'fonts/PlusJakartaSans-VariableFont_wght',
    },
     closeButtonContainer: {
        padding: 5,
    },
    closeButton: {
        backgroundColor: '#CC5C5C',
        borderRadius: 15,
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
        fontFamily: 'fonts/PlusJakartaSans-VariableFont_wght',
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    list: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    listItem: {
        fontSize: 16,
        color: '#567100',
        marginVertical: 2,
        fontFamily: 'fonts/PlusJakartaSans-VariableFont_wght',
    },
    tip: {
        fontSize: 16,
        color: '#567100',
        fontStyle: 'italic',
        marginVertical: 10,
        fontFamily: 'fonts/PlusJakartaSans-VariableFont_wght',
        marginHorizontal: 20,
  },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 20,
    },
    checkbox: {
        marginRight: 5,
    },
    checkboxText: {
        fontSize: 14,
        color: '#333',
    },
});

export default NutritionCard;