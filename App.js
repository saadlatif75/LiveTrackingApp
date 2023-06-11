import {StyleSheet, Text, View, AsyncStorage} from 'react-native';
import React from 'react';
import StackNavigator from './App/Navigators/StackNavigator';
import ChildTracker from './App/Screens/HomeScreen';
import ParentTracker from './App/Screens/UserOneScreen';

export default function App() {
  return <StackNavigator />;
}

const styles = StyleSheet.create({});
