// screens/6.1_EditProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, ScrollView, Image, Alert, SafeAreaView
} from 'react-native';
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaType } from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../components/Header';
import { useFonts } from 'expo-font';
import styles from '../styles/6.1_EditProfileStyles';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { NGROK_URL } from "@env";
import { UserContext } from '../config/UserContext';

const EditProfileScreen = () => {
    const [fontsLoaded] = useFonts({
      'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
      'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
      'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
    });

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('');
    const [foodallergies, setFoodAllergies] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    // const [imageFile, setImageFile] = useState(null); // Hapus ini
    const [emailError, setEmailError] = useState('');
    const [dobError, setDobError] = useState('');
    const [name, setName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();  
    const { userId } = useContext(UserContext);
    const [filteredBookmarks, setEditProfile] = useState([]);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          // Pass the userId as a query parameter to fetch the user's profile data
          const response = await axios.get(`${NGROK_URL}/users/${userId}`);
          
          // If the response is successful, set the user data in the state
          const profile = response.data;
          setName(profile.name || '');
          setEmail(profile.email || '');
          setUsername(profile.username || '');
          setDob(profile.dob ? moment(profile.dob).format('YYYY-MM-DD') : '');
          setFoodAllergies(profile.foodallergies || '');
          setProfileImage(require('../assets/laki.jpg'));
        } catch (error) {
          console.error("Error fetching profile:", error.message);
          Alert.alert("Error", "Failed to fetch profile data.");
        }
      };
    
      // Only call fetchProfile if userId is available
      if (userId) {
        fetchProfile();
      }
    }, [userId]);  // This will re-fetch when userId changes
    
    

    useEffect(() => {
        (async () => {
            const { status } = await requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need gallery access to set profile picture.');
            }
        })();
    }, );



  const updateProfile = async () => {
  // If there are any errors with the email or DOB format, stop the update
  if (emailError || dobError) {
    Alert.alert('Error', 'Please fix the errors in the form.');
    return;
  }

  try {
    // const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.warn('User ID not found.');
      return;
    }

    // Prepare the updated data
    const updateData = {
      name: name,
      email: email,
      username: username,
      dob: moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      foodallergies: foodallergies,
    };

    // If there's a profile image (either base64 or URL), include it in the request
    if (profileImage) {
      updateData.profileImage = profileImage;  // base64 string for profile image
    }

    console.log("Data to send:", updateData); // Log the data being sent

    // Make the PUT request to update the profile in the backend
    const response = await axios.put(`${NGROK_URL}/users/${userId}`, {
      // headers: {
      //   'Content-Type': 'application/json', // Use application/json header
      // },
      name: name,
      email: email,
      username: username,
      dob: moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      foodallergies: foodallergies,
    });

    // Handle the response
    console.log('Response:', response); // Log the full response

    if (response.status === 200) {
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();  // Go back to the previous screen
    } else {
      Alert.alert('Error', 'Failed to update profile.');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.response) {
      // If the error is from the backend, show the error message
      Alert.alert('Error', error.response.data.message || 'Failed to update profile.');
    } else if (error.request) {
      // If there's no response from the server, inform the user
      Alert.alert('Error', 'No response from server. Please check your network connection.');
    } else {
      // If there’s an unexpected error
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  }
};

  

    const validateEmail = (text) => {
      setEmail(text);
      if (!text.endsWith('@gmail.com')) {
        setEmailError('Email harus berakhiran @gmail.com');
      } else {
        setEmailError('');
      }
    };

    const formatDob = (text) => {
      // Remove all non-numeric characters
      let cleaned = text.replace(/\D/g, '');
    
      // Format the date as yyyy-mm-dd
      let formatted = '';
      if (cleaned.length > 0) {
        formatted = cleaned.substring(0, 4); // Year
      }
      if (cleaned.length > 4) {
        formatted += '-' + cleaned.substring(4, 6); // Month
      }
      if (cleaned.length > 6) {
        formatted += '-' + cleaned.substring(6, 8); // Day
      }
    
      setDob(formatted);
    
      // Validate if the date matches the yyyy-mm-dd format
      const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (formatted.length === 10 && !dobPattern.test(formatted)) {
        setDobError('Format DOB harus yyyy-mm-dd');
      } else {
        setDobError('');
      }
    };
    

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
            <SafeAreaView style={styles.containersafe}>
                <Header navigation={navigation} title="EDIT PROFILE" />
                <View style={styles.profileSection}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={require('../assets/logo_#c0c78c.png')}  // Static image from assets
                      style={styles.profileImage}
                    />
                  </View>

                    <View style={styles.nameContainer}>
                        {isEditingName ? (
                            <TextInput
                                style={styles.nameInput}
                                value={name}
                                onChangeText={setName}
                                autoFocus
                                onBlur={() => setIsEditingName(false)}
                            />
                        ) : (
                            <TouchableOpacity style={styles.nameRow} onPress={() => setIsEditingName(true)}>
                                <Text style={styles.name}>{name}</Text>
                                <Icon name="pencil" size={20} color="#000" style={styles.pencilIcon} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <View style={styles.menuGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.inputField, emailError ? styles.inputError : null]}
                            value={email}
                            onChangeText={validateEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Enter your email"
                            placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    <View style={styles.menuGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.inputField}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            placeholder="Enter your username"
                            placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        />
                    </View>
                    <View style={styles.menuGroup}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TextInput
                            style={[styles.inputField, dobError ? styles.inputError : null]}
                            value={dob}
                            onChangeText={formatDob}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="rgba(0, 0, 0, 0.3)"
                            keyboardType="numeric"
                            maxLength={10}
                        />
                        {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
                    </View>
                    <View style={styles.menuGroup}>
                        <Text style={styles.label}>Food Allergies</Text>
                        <TextInput
                            style={styles.inputField}
                            value={foodallergies}
                            onChangeText={setFoodAllergies}
                            placeholder="Enter your food allergies"
                            placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        />
                    </View>
                    
                </View>
                <View style={styles.saveContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={updateProfile}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default EditProfileScreen;