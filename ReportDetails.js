import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure you have this installed for the back arrow
import { NGROK_URL } from "@env"; 

const ReportDetails = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);

  useEffect(() => {
    axios.get(`${NGROK_URL}/reports/${reportId}`)
      .then(response => {
        setReport(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [reportId]);

  const handleMarkInvalid = () => {
    axios.put(`${NGROK_URL}/reports/${reportId}`, { status: 'invalid' })
      .then(() => {
        setReport((prevReport) => ({ ...prevReport, status: 'invalid' }));
        Alert.alert('Invalid', 'This report has been marked as invalid.');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to update status');
      });
  };

  const handleDeletePost = () => {
    axios.put(`${NGROK_URL}/reports/${reportId}`, { status: 'resolved' })
      .then(() => {
        setReport((prevReport) => ({ ...prevReport, status: 'resolved' }));
        Alert.alert('Deleted', 'This post has been deleted.');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to delete post');
      });
  };

  if (!report) return <Text>Loading...</Text>;

  return (
    <ImageBackground 
      source={require('./background.png')} // Replace with your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.header}>Report Details</Text>
          
          <View style={styles.details}>
            <Text style={styles.text}>Reported by: {report.reporteduserid}</Text>
            <Text style={styles.text}>Reason: {report.reason}</Text>
            <Text style={styles.text}>Status: {report.status}</Text>
          </View>

          {/* Display the reported post */}
          <View style={styles.postDetails}>
            <Text style={styles.text}>Post Title: {report.title}</Text>
            <Text style={styles.text}>Post Content: {report.text}</Text>
            {report.image_url && <Image source={{ uri: report.image_url }} style={styles.image} />}
          </View>

          <View style={styles.actions}>
            <Button 
              title="Mark as Invalid" 
              onPress={handleMarkInvalid} 
              color="#4CAF50" // Green button
            />
            <Button 
              title="Delete Post" 
              onPress={handleDeletePost} 
              color="#FF4C4C" // Red button for Delete
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the entire screen
    justifyContent: 'center', // Centers the content vertically
    padding: 20,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background to make text readable
    borderRadius: 12,
    padding: 20,
    alignItems: 'center', // Centers the content horizontally
  },
  details: {
    width: '100%',
    paddingHorizontal: '25%',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2A2A2A', // Dark color for the header
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333', // Dark color for the text
  },
  postDetails: {
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: '25%',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  actions: {
    marginTop: 20,
    width: '50%', // Makes sure the buttons take the full width
  },
});

export default ReportDetails;
