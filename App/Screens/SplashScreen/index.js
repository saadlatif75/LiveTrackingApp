import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

export default function SplashScreen({navigation}) {
  setTimeout(() => {
    navigation.replace('HomeScreen');
  }, 3000);
  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="contain"
        style={{alignSelf: 'center', width: 300, height: 100}}
        source={require('../../Assests/App-logo.png')}
      />

      <ActivityIndicator
        style={{position: 'absolute', bottom: '10%', alignSelf: 'center'}}
        color={'blue'}
        size={'large'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
