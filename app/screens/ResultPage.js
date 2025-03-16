import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import EggIcon from '../assets/egg.png';
import MilkIcon from '../assets/milk-bottle.png';
import PeanutIcon from '../assets/peanut.png';
import NutIcon from '../assets/nut.png';
import SoyIcon from '../assets/bean.png';
import FishIcon from '../assets/fish.png';
import CrustaceanIcon from '../assets/shrimp.png';
import WheatIcon from '../assets/wheat.png';
import GlutenIcon from '../assets/gluten.png';
import { OCR_API_KEY, NGROK_URL } from '@env';
import axios from 'axios';
import { UserContext } from '../config/UserContext';
import Header from '../components/Header';

const ResultPage = ({ route, navigation }) => {
    const photoUri = route?.params?.photoUri || null;
    const [recognizedText, setRecognizedText] = useState(null);
    const [detectedAllergens, setDetectedAllergens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allergenDatabase, setAllergenDatabase] = useState([]);
    const [userAllergies, setUserAllergies] = useState([]);
    const {userId} = useContext(UserContext);

    const recognizeText = async () => {
        if (!photoUri) {
            alert('No Image Scanned.');
            return;
        }

        setIsLoading(true);

        try {
            // console.log("OCR API Key:", OCR_API_KEY); 
            
            const resizedPhoto = await ImageManipulator.manipulateAsync(
                photoUri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            const base64 = await FileSystem.readAsStringAsync(resizedPhoto.uri, { encoding: 'base64' });

            const apiUrl = `https://api.ocr.space/parse/image`;
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
            formData.append('apikey', OCR_API_KEY); // OCR_API_KEY from .env
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');


            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;

            if (data.ParsedResults && data.ParsedResults.length > 0) {
                const text = data.ParsedResults[0].ParsedText;
                console.log('Recognized Text:', text);
                setRecognizedText(text);
            } else {
                setRecognizedText('No text found in the image.');
            }
        } catch (error) {
            console.error('Error during text extraction:', error);
            setRecognizedText('Error during text extraction.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (photoUri) {
            recognizeText();
        }
    }, [photoUri]);

    useEffect(() => {
        // Function to fetch allergen data from the backend
        const fetchAllergies = async () => {
            try {
                const response = await axios.get(`${NGROK_URL}/allergies`);
                setAllergenDatabase(response.data);
            } catch (error) {
                console.error('Error fetching allergies:', error);
            }
        };

        fetchAllergies(); // Call the function to fetch allergies when the component mounts
    }, []);

    useEffect(() => {
        // Function to fetch user allergies
        const fetchUserAllergies = async () => {
            // Only fetch user allergies if userId is not 0 (guest user)
            if (userId !== 0) {
                try {
                    const response = await axios.get(`${NGROK_URL}/user_allergies/${userId}`);
                    setUserAllergies(response.data.map(allergy => allergy.allergy_id)); // Extracting only allergy_id
                } catch (error) {
                    console.error('Error fetching user allergies:', error);
                }
            } else {
                // If guest user, set userAllergies to an empty array
                setUserAllergies([]);
            }
        };

        fetchUserAllergies(); // Call the function to fetch user allergies
    }, [userId]);

    useEffect(() => {
        const analyzeTextForAllergens = () => {
            if (recognizedText) {
                const lowerCaseText = recognizedText.toLowerCase();
                const foundAllergens = [];

                if (allergenDatabase && Array.isArray(allergenDatabase)) {  // Check if allergenDatabase is defined and is an array
                    allergenDatabase.forEach(allergen => {
                        if (allergen && allergen.name && Array.isArray(allergen.name)){  // Check if allergen.name exists and if it is an array
                            allergen.name.forEach(keyword => {
                                if (lowerCaseText.includes(keyword)) {
                                    if (!foundAllergens.includes(allergen.allergy_id)) {
                                        foundAllergens.push(allergen.allergy_id);
                                    }
                                }
                            });
                        }
                    });
                }
                setDetectedAllergens(foundAllergens);
            }
        };

        analyzeTextForAllergens();
    }, [recognizedText, allergenDatabase]);

    // Determine if it's safe only if the user is not a guest (userId !== 0)
    const isSafe = userId !== 0 && detectedAllergens.every(
        (allergen) => !userAllergies.includes(allergen)
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header navigation={navigation} title="Result Page" />

            {/* Main Content */}
            <SafeAreaView style={styles.mainContent}>
                {/* Scanner */}
                <View style={styles.scannedContainer}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.scannedImage} />
                    ) : (
                        <Text style={styles.noImageText}>No Image Scanned</Text>
                    )}
                </View>

                {/* Result */}
                <View style={styles.resultContainer}>
                    {isLoading ? ( // Show loading indicator while isLoading is true
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.loadingText}>Analyzing...</Text>
                        </View>
                    ) : recognizedText ? (
                        <>
                            <Text style={styles.resultHeader}>PRODUCT MAY CONTAIN</Text>
                            {detectedAllergens.length > 0 ? (
                                <ScrollView horizontal={true} style={styles.allergenBoxList}>
                                    {detectedAllergens.map((allergen, index) => (
                                        <View
                                            key={allergen}
                                            style={[
                                                styles.allergenContainer,
                                                index !== 0 && { marginLeft: 5 },
                                                index !== detectedAllergens.length - 1 && { marginRight: 5 },
                                            ]}
                                        >
                                            <Text style={styles.allergenList}>{allergen}</Text>
                                            {allergen === "Egg" && (
                                                <Image source={EggIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Milk" && (
                                                <Image source={MilkIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Peanut" && (
                                                <Image source={PeanutIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Nut" && (
                                                <Image source={NutIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Soy" && (
                                                <Image source={SoyIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Fish" && (
                                                <Image source={FishIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Shellfish" && (
                                                <Image source={CrustaceanIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Wheat" && (
                                                <Image source={WheatIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                            {allergen === "Gluten" && (
                                                <Image source={GlutenIcon} style={styles.allergenIcon} resizeMode='contain' />
                                            )}
                                        </View>
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={styles.noAllergensContainer}>
                                    <Text style={styles.noAllergensTextHead}>Worry less, enjoy more!</Text>
                                    <Text style={styles.noAllergensText}>No allergens inside! 😋</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.nothingDetectedContainer}>
                            <Text style={styles.nothingDetectedTextHead}>OOPS! We couldn't recognize the text.</Text>
                            <Text style={styles.nothingDetectedText}>Please make sure the text is clear, well-lit, and in focus. You can try again with a clearer image.</Text>
                        </View>
                    )}

                    {/* Conclusion Box */}
                    {recognizedText && (
                        userId === 0 ? ( // Guest User Conclusion
                            <View style={styles.conclusionBox}>
                                <Text style={styles.cautionText}>⚠️ CAUTION</Text>
                                <Text style={styles.cautionDetailText}>This product may contain allergens. Please check the list carefully.</Text>
                            </View>
                        ) : isSafe ? ( // Logged-in User - Safe
                            <View style={styles.conclusionBox}>
                                <Text style={styles.safeText}>✅ SAFE TO GO!</Text>
                                <Text style={styles.safeDetailText}>No allergens for you. Enjoy!</Text>
                            </View>
                        ) : ( // Logged-in User - Alert
                            <View style={styles.conclusionBox}>
                                <Text style={styles.alertText}>⚠️ ALLERGEN ALERT!</Text>
                                <Text style={styles.alertDetailText}>
                                    {userAllergies.join(", ")} found in the product! Check carefully.
                                </Text>
                            </View>
                        )
                    )}
                </View>
            </SafeAreaView>

            {/* <StatusBar style="auto" /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '11%',
        backgroundColor: '#F9F6F6',
    },

    headerContainer: {
        width: '100%',
        height: 65,
        backgroundColor: '#c0c78c',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.25,
    },

    iconContainer: {
        position: 'absolute',
        left: 15,
    },

    icon: {
        fontSize: 20,
    },

    headerText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-Bold',
    },

    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F6F6',
    },

    scannedContainer: {
        width: '85%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        margin: 25,
    },

    scannedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },

    noImageText: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Regular',
    },

    resultContainer: {
        width: '100%',
        backgroundColor: '#c0c78c',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
        flex: 1,
    },

    resultHeader: {
        fontSize: 20,
        marginBottom: 15,
        fontFamily: 'PlusJakartaSans-Medium',
    },

    allergenBoxList: {
        width: '100%',
        marginBottom: 15,
        paddingVertical: 12,
    },

    allergenContainer: {
        width: 85,
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefae0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 25,
    },

    allergenList: {
        fontSize: 18,
        marginBottom: 8,
        fontFamily: 'PlusJakartaSans-Regular',
    },

    allergenIcon: {
        width: 28,
        height: 28,
    },

    noAllergensContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fefae0',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 25,
        height: 85,
    },

    noAllergensTextHead: {
        fontSize: 18,
        marginBottom: 3,
        fontFamily: 'PlusJakartaSans-Medium',
    },

    noAllergensText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Regular',
    },

    nothingDetectedContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fefae0',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 25,
        height: 220,
        textAlign: 'center',
    },

    nothingDetectedTextHead: {
        fontSize: 18,
        marginBottom: 3,
        fontFamily: 'PlusJakartaSans-Medium',
    },

    nothingDetectedText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Regular',
        textAlign: 'center',
    },

    conclusionBox: {
        width: '100%',
        height: '35%',
        padding: 10,
        backgroundColor: '#fefae0',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cautionText: {
        fontSize: 24,
        color: '#B10000',
        marginBottom: 5,
        fontFamily: 'PlusJakartaSans-Bold',
    },

    cautionDetailText: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-Regular',
    },

    alertText: {
        fontSize: 24,
        color: '#B10000',
        marginBottom: 5,
        fontFamily: 'PlusJakartaSans-Bold',
    },

    alertDetailText: {
        fontSize: 14,
        color: '#B10000',
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-Regular',
    },

    safeText: {
        fontSize: 24,
        color: '#009C3F',
        marginBottom: 5,
        fontFamily: 'PlusJakartaSans-Bold',
    },

    safeDetailText: {
        fontSize: 14,
        color: '#009C3F',
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-Regular',
    },

    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fefae0',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 25,
        height: 220,
    },

    loadingText: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'PlusJakartaSans-Regular',
    },
});

export default ResultPage;