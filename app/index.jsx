import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomStatusBar from './CustomStatusBar';

const index = () => {
  const navigation = useNavigation();

  return (
    <>
    <CustomStatusBar name='CurrencyConverter'/>
    <View style={styles.container}>
      <Button title="Get Started" onPress={() => navigation.navigate('converter')} />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default index;
