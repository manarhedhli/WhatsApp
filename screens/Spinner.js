import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import { COLORS } from '../styles/Theme';


const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color= {COLORS.primary_500} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;