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
    const { userId } = useContext(UserContext);

    const recognizeText = async () => {
        if (!photoUri) {
            alert('No Image Scanned.');
            return;
        }

        setIsLoading(true);

        try {
            const resizedPhoto = await ImageManipulator.manipulateAsync(
                photoUri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            const base64 = await FileSystem.readAsStringAsync(resizedPhoto.uri, { encoding: 'base64' });

            const apiUrl = `https://api.ocr.space/parse/image`;
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
            formData.append('apikey', OCR_API_KEY);
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
        const fetchAllergies = async () => {
            try {
                const response = await axios.get(`${NGROK_URL}/allergies`);
                setAllergenDatabase(response.data);
            } catch (error) {
                console.error('Error fetching allergies:', error);
            }
        };

        fetchAllergies();
    }, []);

    useEffect(() => {
        const fetchUserAllergies = async () => {
            if (userId !== 0) {
                try {
                    const response = await axios.get(`${NGROK_URL}/user_allergies/${userId}`);
                    setUserAllergies(response.data.map(allergy => allergy.allergy_id));
                } catch (error) {
                    console.error('Error fetching user allergies:', error);
                }
            } else {
                setUserAllergies([]);
            }
        };

        fetchUserAllergies();
    }, [userId]);

    useEffect(() => {
        const analyzeTextForAllergens = () => {
            if (recognizedText) {
                const lowerCaseText = recognizedText.toLowerCase();
                const foundAllergens = [];

                if (allergenDatabase && Array.isArray(allergenDatabase)) {
                    allergenDatabase.forEach(allergen => {
                        if (allergen && allergen.name && Array.isArray(allergen.name)) {
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

    const isSafe = userId !== 0 && detectedAllergens.every(
        (allergen) => !userAllergies.includes(allergen)
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation} title="ALLERGY SCANNER" />

            <ScrollView contentContainerStyle={styles.mainContent}>
                <View style={styles.scannedContainer}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.scannedImage} />
                    ) : (
                        <Text style={styles.noImageText}>No Image Scanned</Text>
                    )}
                </View>

                <View style={styles.resultContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
                    ) : recognizedText ? (
                        <>
                            <Text style={styles.resultHeader}>PRODUCT MAY CONTAIN</Text>
                            {detectedAllergens.length > 0 ? (
                                <ScrollView horizontal contentContainerStyle={styles.allergenBoxList}>
                                    {detectedAllergens.map((allergen, index) => (
                                        <View key={allergen} style={styles.allergenContainer}>
                                            <Text style={styles.allergenList}>{allergen}</Text>
                                            {allergen === "Egg" && <Image source={EggIcon} style={styles.allergenIcon} />}
                                            {allergen === "Milk" && <Image source={MilkIcon} style={styles.allergenIcon} />}
                                            {allergen === "Peanut" && <Image source={PeanutIcon} style={styles.allergenIcon} />}
                                            {allergen === "Nut" && <Image source={NutIcon} style={styles.allergenIcon} />}
                                            {allergen === "Soy" && <Image source={SoyIcon} style={styles.allergenIcon} />}
                                            {allergen === "Fish" && <Image source={FishIcon} style={styles.allergenIcon} />}
                                            {allergen === "Shellfish" && <Image source={CrustaceanIcon} style={styles.allergenIcon} />}
                                            {allergen === "Wheat" && <Image source={WheatIcon} style={styles.allergenIcon} />}
                                            {allergen === "Gluten" && <Image source={GlutenIcon} style={styles.allergenIcon} />}
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

                    {recognizedText && (
                        userId === 0 ? (
                            <View style={styles.conclusionBox}>
                                <Text style={styles.cautionText}>⚠️ CAUTION</Text>
                                <Text style={styles.cautionDetailText}>This product may contain allergens. Please check the list carefully.</Text>
                            </View>
                        ) : isSafe ? (
                            <View style={styles.conclusionBox}>
                                <Text style={styles.safeText}>✅ SAFE TO GO!</Text>
                                <Text style={styles.safeDetailText}>No allergens for you. Enjoy!</Text>
                            </View>
                        ) : (
                            <View style={styles.conclusionBox}>
                                <Text style={styles.alertText}>⚠️ ALLERGEN ALERT!</Text>
                                <Text style={styles.alertDetailText}>
                                    {userAllergies.join(", ")} found in the product! Check carefully.
                                </Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F6F6',
    },

    mainContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },

    scannedContainer: {
        width: '90%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        marginVertical: 25,
    },

    scannedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },

    noImageText: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Regular',
        color: '#555',
    },

    resultContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
        flex: 1,
        marginTop: -10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },

    resultHeader: {
        fontSize: 20,
        marginBottom: 15,
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#333',
    },

    allergenBoxList: {
        flexDirection: 'row',
        marginBottom: 15,
    },

    allergenContainer: {
        width: 85,
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefae0',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },

    allergenList: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Regular',
    },

    allergenIcon: {
        width: 28,
        height: 28,
        marginTop: 5,
    },

    noAllergensContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fefae0',
        borderRadius: 10,
        marginVertical: 20,
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

    loadingIndicator: {
        marginVertical: 15,
    },
});

export default ResultPage;
