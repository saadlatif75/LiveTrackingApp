import {firebase} from '@react-native-firebase/database';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{width: 300, height: 100, marginVertical: 15, borderRadius: 10}}
        resizeMode="contain"
        source={require('../../Assests/App-logo.png')}
      />
      <View
        style={{
          marginVertical: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserOneScreen');
          }}
          style={styles.userSection}>
          <Image
            resizeMode="contain"
            style={{marginHorizontal: '10%'}}
            source={require('../../Assests/profileIcon.png')}
          />
          <Text style={styles.userText}>User 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserTwoScreen');
          }}
          style={styles.userSection}>
          <Image
            resizeMode="contain"
            style={{marginHorizontal: '10%'}}
            source={require('../../Assests/profileIcon.png')}
          />
          <Text style={styles.userText}>User 2</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // justifyContent: 'center',
  },
  userSection: {
    width: width * 0.6,
    flexDirection: 'row',
    backgroundColor: '#FFE194',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
