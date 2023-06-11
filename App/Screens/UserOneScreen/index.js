// import React in our code
import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
  AsyncStorage,
  AppState,
} from 'react-native';

//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import {firebase} from '@react-native-firebase/database';
import DeviceInfo from 'react-native-device-info';
import {Switch} from 'react-native-elements';
import BackgroundService from 'react-native-background-actions';
import VIForegroundService from '@voximplant/react-native-foreground-service';
const UserOneScreen = () => {
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  useEffect(() => {
    createChannel();
  }, []);
  const createChannel = async () => {
    const channelConfig = {
      id: 'channelId',
      name: 'Channel name',
      description: 'Channel description',
      enableVibration: false,
    };
    await VIForegroundService.getInstance().createNotificationChannel(
      channelConfig,
    );
  };
  const startForgroundService = async () => {
    const notificationConfig = {
      channelId: 'channelId',
      id: 3456,
      title: 'Tracking',
      text: 'Tracking',
      icon: 'Tracking',
      button: 'Tracking-',
    };
    try {
      await VIForegroundService.getInstance().startService(notificationConfig);
    } catch (e) {
      console.error(e);
    }
  };
  const stopForgroundService = async () => {
    await VIForegroundService.getInstance().stopService();
  };
  // const veryIntensiveTask = async taskDataArguments => {
  //   // Example of an infinite loop task
  //   const {delay} = taskDataArguments;
  //   await new Promise(async resolve => {
  //     for (let i = 0; BackgroundService.isRunning(); i++) {
  //       // getOneTimeLocation();
  //       getOneTimeLocation();

  //       console.log(i);
  //       await sleep(delay);
  //     }
  //   });
  // };
  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;

    const getLocation = async () => {
      // Call the getOneTimeLocation function
      await getOneTimeLocation();

      // Wait for the specified delay before calling again
      await sleep(delay);

      // Call the getLocation function again
      getLocation();
    };

    await getLocation();
  };

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const options = {
    taskName: 'Tracking',
    taskTitle: 'Tracking is Start',
    taskDesc: 'Track Each Other',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };
  const StartBsckgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'Tracking App',
    }); // Only Android, iOS will ignore this call
    // iOS will also run everything here in the background until .stop() is called
  };
  const stopBackGroundService = async () => {
    await BackgroundService.stop();
  };
  useEffect(() => {
    let watchId;

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      // Geolocation.clearWatch(watchID);
    };
  }, []);

  var uniqueId = DeviceInfo.getDeviceId();

  const [isToggleOn, setIsToggleOn] = useState(false);

  const handleToggle = async () => {
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);

    if (!isToggleOn) {
      setIsToggleOn(true);
      getOneTimeLocation();
      StartBsckgroundService();
      startForgroundService();
    } else {
      firebase.database().ref(`users/${uniqueId}/locations`).remove();
      stopBackGroundService();
      stopForgroundService();
    }

    try {
      await AsyncStorage.setItem('toggleState', JSON.stringify(newToggleState));
    } catch (error) {
      console.error('Error saving toggle state:', error);
    }
  };

  useEffect(() => {
    const fetchToggleState = async () => {
      try {
        const toggleState = await AsyncStorage.getItem('toggleState');
        if (toggleState !== null) {
          setIsToggleOn(JSON.parse(toggleState));
        }
      } catch (error) {
        // Handle AsyncStorage errors
        console.error('Error retrieving toggle state:', error);
      }
    };

    fetchToggleState();
  }, []);
  const getOneTimeLocation = () => {
    console.log('Get One time Location function calll');
    setLocationStatus('Updating Location ...');
    Geolocation.getCurrentPosition(
      position => {
        setLocationStatus('You are Here');

        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        firebase.database();
        firebase.database().ref(`users/${uniqueId}/locations`).set({
          longitude: currentLongitude,
          latitude: currentLatitude,
        });
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            source={require('../../Assests/location.png')}
            style={{width: 100, height: 100}}
          />
          <Text style={styles.boldText}>{locationStatus}</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {currentLatitude}
          </Text>
          <View style={{marginTop: 20}}>
            {/* <Button title="Refresh" onPress={getOneTimeLocation} /> */}
            {/* <Button title="Turn on" onPress={handleToggle}> */}

            <Switch value={isToggleOn} onValueChange={handleToggle} />

            {/* {isToggleOn ? 'Turn Off' : 'Turn On'} */}
            {/* </Button> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default UserOneScreen;
