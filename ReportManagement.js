import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Import the hook
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NGROK_URL } from "@env"; 

const ReportManagement = ({ navigation }) => {
  const [reports, setReports] = useState([]);

  // Function to fetch reports
  const fetchReports = () => {
    axios.get(`${NGROK_URL}/reports`)
      .then(response => {
        setReports(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Use useFocusEffect to fetch the reports when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchReports();
    }, [])
  );

  return (
    <ImageBackground 
      source={require('./background.png')} // Replace with your background image path
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safecontainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Community Management</Text>

        <FlatList
          data={reports}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>{item.id}</Text>
              <Text style={styles.reportPreview}>{item.reason}</Text>
              <Text style={styles.reportStatus}>Status: {item.status}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the entire screen
    justifyContent: 'flex-start', // Align content from top
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  backButtonText: {
    fontSize: 18,
    color: 'black', // Black text
    fontWeight: '500',
    marginLeft: 2,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2A2A2A',
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3, // For shadow effect (Android)
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width:'80%',
    alignSelf: 'center',

  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reportPreview: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  reportStatus: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#4CAF50', // Green button background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReportManagement;
