import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BookmarkHeader = ({ navigation, tabs = [], onTabChange, placeholder = "Search", searchText, setSearchText }) => {
  const [activeTab, setActiveTab] = useState(tabs[0] || 'Your Favorite'); // default active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab buttons - Scrollable */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        {/* Search icon */}
        <Icon name="magnify" size={20} color="#555" style={styles.icon} />
        <TextInput 
          placeholder={placeholder} 
          style={styles.searchInput} 
          value={searchText} 
          onChangeText={setSearchText} // This will update searchText in parent
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15, 
    marginLeft: 10,
    marginRight: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#AAB07F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  activeTab: {
    backgroundColor: '#AAB07F',
  },
  tabText: {
    fontSize: 14,
    color: '#FFF',
  },
  activeTabText: {
    color: '#FFF',
  },
  searchContainer: {
    backgroundColor: '#FEFAE0',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 14,
    color: '#888',
    paddingLeft: 5,
    paddingVertical: 0,
    height: 35,
    flex: 1,
  },
});

export default BookmarkHeader;
