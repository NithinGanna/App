import React from 'react';
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons from expo
import { useNavigation } from 'expo-router';

const CustomStatusBar = ({ name }) => {

    const navigation = useNavigation();

    const handleHome = () => {
        navigation.navigate('index');
      };

  return (
    (
        name === 'home' ? 
        <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#3498db" />
      <MaterialIcons name="arrow-back" size={24} color="#fff" style={styles.icon} onPress={handleHome}/> 
    <Text style={styles.text} onPress={handleHome}>{name}</Text>
    </View>
        :
        <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#3498db" />
      <Text style={styles.text}>{name}</Text>
    </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10, // Adjust the margin as needed
  },
});

export default CustomStatusBar;
