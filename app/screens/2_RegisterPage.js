import React, { useState, useContext } from 'react';
import { ScrollView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, Alert, View, Image, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { NGROK_URL } from "@env";
import moment from 'moment';
import { UserContext } from '../config/UserContext';


const RegisterPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [foodallergies, setFoodallergies] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setUserId } = useContext(UserContext) 
  

  const handleSelectAllergy = (allergy) => {
    setFoodallergies(allergy);
    setIsModalVisible(false);
  };

  const Registration = async () => {
    const emailValidation = /^[^\s@]+@gmail\.com$/;
    const minPassLength = 8;
    const passwordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!]{6,}$/;
    const showErrors = {};
    

    if (!email) {
      showErrors.email = 'Email is required.';
    } else if (!emailValidation.test(email)) {
      showErrors.email = 'Invalid email format! Email must end with @gmail.com.';
    }

    if (!password) {
      showErrors.password = 'Password is required.';
    } else if (password.length < minPassLength) {
      showErrors.password = `Password must be at least ${minPassLength} characters long.`;
    } else if (!passwordValidation.test(password)) {
      showErrors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.';
    }

    if (!confirmPassword) {
      showErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      showErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!name) {
      showErrors.name = 'Name is required.';
    }

    if (!username) {
      showErrors.username = 'Username is required.';
    }

    if (!dob) {
      showErrors.dob = 'Date of Birth is required.';
    }

    if (!foodallergies) {
      showErrors.foodallergies = 'Please select your food allergies.';
    }

    if (!gender) {
      showErrors.gender = 'Gender is required.';
    } else if (gender !== 'Male' && gender !== 'Female') {
      showErrors.gender = 'Gender must be "Male" or "Female".';
    }
  

    setErrors(showErrors);

    if (Object.keys(showErrors).length === 0) {
      try {
        const response = await axios.post(`${NGROK_URL}/api/register`, {
          name: name,
          email: email,
          username: username,
          password: password,
          dob: moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          foodallergies: foodallergies,
          gender: gender
        });

        const userData = response.data;
        Alert.alert('Registration Successful', `Welcome, ${email}!`);
        const user_id = userData.user_id;
        navigation.navigate('LoginPage', { user_id: user_id });

        // Reset all fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setUsername('');
        setDob('');
        setFoodallergies('');
        setGender('');
        setErrors({});
      } catch (error) {
        Alert.alert('Registration Failed', error.message);
      }
    } else {
      Alert.alert('Please fix the errors and try again.');
    }
  };

  const ContinueAsGuest = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/guest`);
      const guestUser = response.data;
      // const user_id = guestUser.user_id
      setUserId(guestUser.user_id);
      // navigation.navigate('Recipe', {user_id : user_id});
      navigation.navigate('Recipe');
    } catch (error) {
      Alert.alert('Load Guest Failed', error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior for iOS and Android
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.wrapper}>
            <Image source={require('../assets/logo_#a6b37d.png')} style={styles.logo} />
            <Text style={styles.title}>REGISTER</Text>

            <View style={styles.inputArea}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={!isPasswordVisible}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#8C8C8C" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  secureTextEntry={!isConfirmPasswordVisible}
                  placeholder="Confirm your password"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <Ionicons name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={20} color="#8C8C8C" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              {/* Other Inputs */}
              <View style={styles.inputContainer}>
                <Ionicons name="man" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                />
              </View>
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

              {/* Date of Birth Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="calendar" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={dob}
                  onChangeText={(text) => {
                    // Remove non-numeric characters and limit the length to 10 characters
                    let formattedText = text.replace(/[^\d]/g, '').slice(0, 8);
                    
                    // Format the date to yyyy-mm-dd
                    if (formattedText.length >= 5 && formattedText.length <= 6) {
                      formattedText = formattedText.slice(0, 4) + '-' + formattedText.slice(4);
                    } else if (formattedText.length >= 8) {
                      formattedText = formattedText.slice(0, 4) + '-' + formattedText.slice(4, 6) + '-' + formattedText.slice(6, 8);
                    } else if (formattedText.length >= 4) {
                      formattedText = formattedText.slice(0, 4) + '-' + formattedText.slice(4);
                    }

                    setDob(formattedText); // Set the formatted text
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                />

              </View>
              {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
              
              <View style={styles.inputContainer}>
                <Ionicons name="male" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={(text) => setGender(text)}
                  placeholder="Enter 'Male' or 'Female'"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                />
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

              {/* Food Allergies Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="alert-circle" size={20} color="#8C8C8C" style={styles.icon} />
                <Text style={styles.label}>Food Allergies</Text>

                {/* TextInput as placeholder */}
                <TextInput
                  style={styles.input}
                  value={foodallergies}
                  onFocus={() => setIsModalVisible(true)} // Open modal on focus
                  placeholder="Select your food allergies"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)" // Placeholder opacity
                  editable={false} // Make it non-editable to trigger modal on click
                />
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <Ionicons name="chevron-down" size={20} color="#8C8C8C" />
                </TouchableOpacity>
              </View>

              {/* Modal for allergy selection */}
              <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Food Allergy</Text>
                    {/* List of allergies */}
                    {['Milk', 'Peanut', 'Nut', 'Soy', 'Fish', 'Shellfish', 'Wheat', 'Gluten', 'Egg'].map((allergy, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectAllergy(allergy)} style={styles.modalItem}>
                        <Text style={styles.modalItemText}>{allergy}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {errors.foodallergies && <Text style={styles.errorText}>{errors.foodallergies}</Text>}

            </View>

            {/* Buttons */}
            <View style={styles.buttoncontainer}>
              <TouchableOpacity style={styles.button} onPress={Registration}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.button} onPress={ContinueAsGuest}>
                <Text style={styles.buttonText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>

            {/* Link to Login */}
            <Text style={styles.Registered} onPress={() => navigation.navigate('Login')}>I'm already registered</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  wrapper: {
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 40,
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 5,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  inputArea: {
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#8C8C8C',
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  dropdownButton: {
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  dropdownText: {
    color: '#000',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FEFAE0',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalItem: {
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#8C8C8C',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',  // Center-align text
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#C0C78C',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
  errorText: {
    color: 'firebrick',
    fontSize: 11,
    marginHorizontal: 10,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  label: {
    position: 'absolute',
    color: '#8C8C8C',
    backgroundColor: '#FEFAE0',
    padding: 5,
    top: -17,
    left: 10,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    color: 'gray',
  },
  icon: {
    marginVertical: 5,
    marginRight: 5,
  },
  buttoncontainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '95%',
    height: 50,
    backgroundColor: '#C0C78C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#8C8C8C',
  },
  dividerText: {
    color: '#8C8C8C',
    marginHorizontal: 10,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  Registered: {
    color: '#8C8C8C',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 20,
  },
});

export default RegisterPage;
