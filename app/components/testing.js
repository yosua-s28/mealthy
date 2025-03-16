import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';

const Testing = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch users from API
    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getUser'); // Change to your API URL
            console.log('bang ini  bang',response.data)
            setUsers(response.data); // Update users state
        } catch (err) {
            setError('Failed to fetch users');
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        getData();
    }, []);
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{users.name} + {users.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#AAB07F',
    padding: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24,
  },
});

export default Testing;
