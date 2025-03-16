import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  View,
  Image,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { NGROK_URL } from "@env";

const ForgotPass = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const RequestReset = async () => {
    const emailValidation = /^[^\s@]+@gmail\.com$/;
    const showErrors = {};

    if (!email) {
      showErrors.email = 'Email is required.';
    } else if (!emailValidation.test(email)) {
      showErrors.email = 'Invalid email format! Email must end with @gmail.com.';
    }

    setErrors(showErrors);

    if (Object.keys(showErrors).length === 0) {
      setIsLoading(true); // Start loading
      console.log("isLoading:", isLoading); // Add this line

      try {
        const response = await axios.post(`${NGROK_URL}/api/forgot-password`, {
          email: email,
        });

        Alert.alert("Success", response.data.message);
        navigation.navigate('ResetPass', { email: email }); // Pass the email to ResetPasswordPage

      } catch (error) {
        console.error("Error requesting password reset:", error);
        Alert.alert("Error", error.response?.data?.message || "Failed to request password reset.");
      } finally {
        setIsLoading(false); // Stop loading
        console.log("isLoading:", isLoading); // Add this line
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/logo_#a6b37d.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password</Text>

      <SafeAreaView style={styles.inputArea}>
        <SafeAreaView style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#8C8C8C" style={styles.icon} />
          <Text style={styles.label}>email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </SafeAreaView>
        {errors.email && (
          <SafeAreaView style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.email}</Text>
          </SafeAreaView>
        )}
      </SafeAreaView>

      <TouchableOpacity
        style={styles.button}
        onPress={RequestReset}
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" /> // Show loading indicator
        ) : (
          <Text style={styles.buttonText}>Request Reset</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    marginBottom: 5,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  inputArea: {
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#8C8C8C',
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  errorContainer: {
    width: '100%',
  },
  errorText: {
    color: 'firebrick',
    fontSize: 11,
    textAlign: 'left',
    marginHorizontal: 10,
    flexWrap: 'wrap',
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
    height: '100%',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    padding:10,
  },
  icon: {
    marginVertical: 5,
    marginRight: 5,
    marginLeft:8,
  },
  button: {
    width: '90%',
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
});

export default ForgotPass;