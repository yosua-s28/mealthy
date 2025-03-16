import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, View, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../config/UserContext';
import axios from 'axios';
import { NGROK_URL } from "@env";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const { setUserId } = useContext(UserContext) 

  const LoggedIn = async () => {
    const emailValidation = /^[^\s@]+@gmail\.com$/;
    const minPassLength = 8;
    const passwordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!]{6,}$/;
    const showErrors = {};
  
    if (!email) {
      showErrors.email = 'Email is required.';
      setErrors(showErrors);
      // Remove the error after 5 seconds
      setTimeout(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.email;
          return updatedErrors;
        });
      }, 5000);
    } else if (!emailValidation.test(email)) {
      showErrors.email = 'Invalid email format! Email must end with @gmail.com.';
      setErrors(showErrors);
      // Remove the error after 5 seconds
      setTimeout(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.email;
          return updatedErrors;
        });
      }, 5000);
    }
  
    if (!password) {
      showErrors.password = 'Password is required.';
      setErrors(showErrors);
      // Remove the error after 5 seconds
      setTimeout(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.password;
          return updatedErrors;
        });
      }, 5000);
    } else if (password.length < minPassLength) {
      showErrors.password = `Password must be at least ${minPassLength} characters long.`;
      setErrors(showErrors);
      // Remove the error after 5 seconds
      setTimeout(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.password;
          return updatedErrors;
        });
      }, 5000);
    } else if (!passwordValidation.test(password)) {
      showErrors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.';
    }
  
    setErrors(showErrors);
  
    if (Object.keys(showErrors).length === 0) {
      try {
        const response = await axios.post(`${NGROK_URL}/api/login`, {  
          email: email,
          password: password,
        });
  
        const userData = response.data;
  
        if (userData.isAdmin) {
          navigation.navigate('AdminPage');
        } else {
          setUserId(userData.user_id);
          navigation.navigate('Recipe');
        }
  
        setEmail('');
        setPassword('');
        setErrors({});
      } catch (error) {
        Alert.alert('Login Failed', error.message);
      }
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
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/logo_#a6b37d.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>LOGIN</Text>

      <View style={styles.inputArea}>
        {/* input email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#8C8C8C" style={styles.icon} />
          <Text style={styles.label}>email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(Text) => setEmail(Text)}
            keyboardType='email-address'
            autoCapitalize='none'
            />
        </View>
        {errors.email && (
          <SafeAreaView style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.email}</Text>
          </SafeAreaView>
        )}

        {/* input password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#8C8C8C" style={styles.icon} />
          <Text style={styles.label}>password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(Text) => setPassword(Text)}
            secureTextEntry={!isVisible}
          />
          <TouchableOpacity
            onPress={() => setIsVisible(!isVisible)}
            style={styles.iconRight}
          >
            <Ionicons
              name={isVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#8C8C8C"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.password}</Text>
          </View>
        )}

        {/* forgot password */}
        <Text style={styles.forgotPassword}>
          Forgot password?
          <TouchableOpacity
            onPress={() => {
              // Show an alert before navigating
              Alert.alert('Forgot Password', 'Kindly check your email to reset your password ^^');
              // Navigate to the ForgotPassword screen
              navigation.navigate('ForgotPass');
            }}
          >
            <Text style={styles.link}>  Click here!</Text>
          </TouchableOpacity>
        </Text>
      </View>

      {/* login button */}
      <View style={styles.buttoncontainer}>
        
        <TouchableOpacity style={styles.button} onPress={LoggedIn}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* continue as guest button */}
        <TouchableOpacity
          style={styles.button}
          onPress={ContinueAsGuest}
        >
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </TouchableOpacity>

        {/* not registered */}
        <Text style={styles.notRegistered} onPress={() => navigation.navigate('RegisterPage')}> I'm not registered yet</Text>
      </View>

      {/* <StatusBar style="auto" /> */}
    </SafeAreaView>
  );
}

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
    fontSize: 30,
    marginBottom: 5,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },

  inputArea: {
    paddingHorizontal: 5,
    paddingVertical: 20,
    alignItems:'center',
    width:'100%',
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
    width: '94.2%',
    marginBottom: 5,
  },

  errorText: {
    color: 'firebrick',
    fontSize: 11,
    // marginTop: 1,
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
    marginRight: 8,
    marginLeft: 8,
    width:'100%',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },

  icon: {
    marginVertical: 5,
    marginRight: 5,
  },

  iconRight: {
    marginLeft: 8,
  },

  forgotPassword: {
    color: '#8C8C8C',
    alignSelf: 'flex-start',
    fontSize: 13,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'PlusJakartaSans-Regular',
  },

  link: {
    // fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Bold',
    alignSelf: 'flex-start',
    marginBottom: -3,
  },
  buttoncontainer:{
    width:'90%',
    alignItems:'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#C0C78C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  buttonText: {
    color: '#000',
    // fontWeight: 'bold',
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
    borderRadius: 10,
  },

  dividerText: {
    color: '#8C8C8C',
    marginHorizontal: 10,
    top: -2,
    fontFamily: 'PlusJakartaSans-Regular',
  },

  notRegistered: {
    color: '#8C8C8C',
    fontFamily: 'PlusJakartaSans-Regular',
  }

});

export default LoginPage;