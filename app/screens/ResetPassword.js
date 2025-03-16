import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { NGROK_URL } from "@env";

const ResetPasswordPage = ({ navigation, route }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});

    // Get the email from the route parameters
    const { email } = route.params;

    const ChangePass = async () => {
        const minPassLength = 8;
        const newPasswordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!]{6,}$/;
        const showErrors = {};

        if (!verificationCode) {
            showErrors.verificationCode = 'Verification Code is required.';
        }

        if (!newPassword) {
            showErrors.newPassword = 'Password is required.';
        } else if (newPassword.length < minPassLength) {
            showErrors.newPassword = `Password must be at least ${minPassLength} characters long.`;
        } else if (!newPasswordValidation.test(newPassword)) {
            showErrors.newPassword = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.';
        }

        if (!confirmNewPassword) {
            showErrors.confirmNewPassword = 'Please confirm your password.';
        } else if (newPassword !== confirmNewPassword) {
            showErrors.confirmNewPassword = 'Passwords do not match.';
        }

        setErrors(showErrors);

        if (Object.keys(showErrors).length === 0) {
            try {
                const response = await axios.post(`${NGROK_URL}/api/reset-password`, {
                    email: email,
                    verificationCode: verificationCode,
                    newPassword: newPassword,
                });

                Alert.alert("Success", response.data.message);
                navigation.navigate('Login'); // Redirect to login after successful password reset
            } catch (error) {
                console.error("Error resetting password:", error);
                Alert.alert("Error", error.response?.data?.message || "Failed to reset password.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../assets/logo_#a6b37d.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>CHANGE PASSWORD</Text>

            <SafeAreaView style={styles.inputArea}>
                <SafeAreaView style={styles.inputContainer}>
                    <Ionicons name="checkmark-circle" size={20} color="#8C8C8C" style={styles.icon} />
                    <Text style={styles.label}>verification code</Text>
                    <TextInput
                        style={styles.input}
                        value={verificationCode}
                        onChangeText={(text) => setVerificationCode(text)}
                        keyboardType='default'
                        autoCapitalize='none'
                    />
                </SafeAreaView>
                {errors.verificationCode && (
                    <SafeAreaView style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errors.verificationCode}</Text>
                    </SafeAreaView>
                )}

                <SafeAreaView style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#8C8C8C" style={styles.icon} />
                    <Text style={styles.label}>new password</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={(text) => setNewPassword(text)}
                        secureTextEntry={!isNewPasswordVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                        style={styles.iconRight}
                    >
                        <Ionicons
                            name={isNewPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#8C8C8C"
                            style={styles.eyebutton}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                {errors.newPassword && (
                    <SafeAreaView style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errors.newPassword}</Text>
                    </SafeAreaView>
                )}

                <SafeAreaView style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#8C8C8C" style={styles.icon} />
                    <Text style={styles.label}>confirm new password</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmNewPassword}
                        onChangeText={(text) => setConfirmNewPassword(text)}
                        secureTextEntry={!isConfirmNewPasswordVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible)}
                        style={styles.iconRight}
                    >
                        <Ionicons
                            name={isConfirmNewPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#8C8C8C"
                            style={styles.eyebutton}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                {errors.confirmNewPassword && (
                    <SafeAreaView style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>
                    </SafeAreaView>
                )}
            </SafeAreaView>

            <TouchableOpacity style={styles.button} onPress={ChangePass}>
                <Text style={styles.buttonText}>Change Password</Text>
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
        marginVertical: 8,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    inputArea: {
        paddingHorizontal: 10,
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
    },
    icon: {
        marginVertical: 5,
        marginRight: 5,
        marginLeft:8,
    },
    iconRight: {
        marginLeft: 8,
    },
    eyebutton:{
        marginRight:5,
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

export default ResetPasswordPage;