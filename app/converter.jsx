import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from './CustomStatusBar';

const Converter = () => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [savedConversions, setSavedConversions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const exchangeRates = {
    USD: 1,
    EUR: 0.82,
    GBP: 0.73,
    JPY: 109.54,
  };

  const convertCurrency = () => {
    if (isNaN(parseFloat(amount))) {
      setError('Please enter a valid number');
      return;
    }

    setError('');

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const result = (parseFloat(amount) / fromRate) * toRate;
    setConvertedAmount(result.toFixed(2));
  };

  const saveConversion = async () => {
    try {
      const data = { fromCurrency, toCurrency, amount, convertedAmount };
      await AsyncStorage.setItem(Date.now().toString(), JSON.stringify(data));
      setSavedConversions([...savedConversions, data]);
    } catch (error) {
      console.error('Error saving conversion:', error);
    }
  };

  const loadData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filteredKeys = keys.filter(key => !isNaN(parseInt(key)) && Date.now() - parseInt(key) < (30 * 24 * 60 * 60 * 1000)); // Filtering conversions older than 1 to 2 months
      const data = await AsyncStorage.multiGet(filteredKeys);
      const conversions = data.map(([key, value]) => JSON.parse(value));
      setSavedConversions(conversions);
    } catch (error) {
      console.error('Error loading conversions:', error);
    }
  };

  const clearAllConversions = async () => {
    try {
      await AsyncStorage.clear();
      setSavedConversions([]);
    } catch (error) {
      console.error('Error clearing conversions:', error);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    convertCurrency();
  };

  return (
    <>
    <CustomStatusBar name='home' />
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={value => setAmount(value)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.dropdownRow}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>From</Text>
          <DropDownPicker
            open={open}
            value={fromCurrency}
            items={[
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' },
              { label: 'JPY', value: 'JPY' },
            ]}
            setOpen={setOpen}
            setValue={setFromCurrency}
            onChangeValue={value => setFromCurrency(value)}
            containerStyle={{ height: 40, width: 150 }}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>To</Text>
          <DropDownPicker
            open={open2}
            value={toCurrency}
            items={[
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' },
              { label: 'JPY', value: 'JPY' },
            ]}
            setOpen={setOpen2}
            setValue={setToCurrency}
            onChangeValue={value => setToCurrency(value)}
            containerStyle={{ height: 40, width: 150 }}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </View>
      </View>
      <Text style={styles.convertedAmount}>Conversion: {convertedAmount !== '' ? convertedAmount : 'NaN'}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={convertCurrency}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={swapCurrencies}>
          <Text style={styles.buttonText}>Swap Currencies</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={saveConversion}>
          <Text style={styles.buttonText}>Save Conversion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearAllConversions}>
          <Text style={styles.buttonText}>Clear All Conversions</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.savedConversions}>
        <Text style={styles.savedConversionsTitle}>Saved Conversions</Text>
        {savedConversions.map((conversion, index) => (
          <Text key={index} style={styles.savedConversionItem}>
            {`${conversion.amount} ${conversion.fromCurrency} to ${conversion.toCurrency}: ${conversion.convertedAmount}`}
          </Text>
        ))}
      </View>
    </View>
    </>
  );
};



// Updated styles for improved UI and button alignment
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: 'white',
      borderRadius: 5,
    },
    dropdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    dropdownContainer: {
      flex: 1,
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    convertedAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#3498db',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: '45%',
    },
    clearButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '45%',
      },
      saveButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '45%',
      },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    savedConversions: {
      width: '100%',
      marginTop: 20,
    },
    savedConversionsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    savedConversionItem: {
      fontSize: 16,
      marginBottom: 5,
    },
  });

export default Converter;
