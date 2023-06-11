// import React, {useState, useEffect} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import MapView, {Marker} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import {firebase} from '@react-native-firebase/database';

// const UserTwoScreen = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);

//   const [destinations, setDestinations] = useState([]);
//   useEffect(() => {
//     firebase
//       .database()
//       .ref('users')
//       .once('value', snapshot => {
//         const data = snapshot.val();
//         const destinationArray = Object.values(data).map(user => ({
//           latitude: parseFloat(user.locations.latitude),
//           longitude: parseFloat(user.locations.longitude),
//           title: user.username,
//         }));
//         setDestinations(destinationArray);
//       });
//   }, []);

//   useEffect(() => {
//     // Request location permission
//     Geolocation.requestAuthorization();

//     // Get current location
//     Geolocation.getCurrentPosition(
//       position => {
//         setCurrentLocation(position.coords);
//       },
//       error => {
//         console.log('Error getting location:', error);
//       },
//     );

//     // Optional: Continuously track location updates
//     const watchId = Geolocation.watchPosition(
//       position => {
//         setCurrentLocation(position.coords);
//       },
//       error => {
//         console.log('Error tracking location:', error);
//       },
//     );

//     return () => {
//       // Clear location tracking when the component unmounts
//       Geolocation.clearWatch(watchId);
//     };
//   }, [currentLocation]);
//   return (
//     <View style={styles.container}>
//       {currentLocation && (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: currentLocation.latitude,
//             longitude: currentLocation.longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}>
//           <Marker
//             coordinate={{
//               latitude: currentLocation.latitude,
//               longitude: currentLocation.longitude,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//             title={'Current Location'}
//             pinColor="red"
//           />
//           {destinations.map((destination, index) => (
//             <Marker
//               key={index}
//               coordinate={{
//                 latitude: destination.latitude,
//                 longitude: destination.longitude,
//               }}
//               title={'Online'}
//               pinColor="blue"
//             />
//           ))}
//         </MapView>
//       )}
//       {!currentLocation && (
//         <Text style={{justifyContent: 'center', textAlign: 'center'}}>
//           Loading...
//         </Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default UserTwoScreen;
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {firebase} from '@react-native-firebase/database';

const UserTwoScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }
    };

    requestLocationPermission();
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setCurrentLocation(position.coords);
      },
      error => {
        console.log('Error getting location:', error);
      },
    );
  };

  useEffect(() => {
    firebase
      .database()
      .ref('users')
      .once('value', snapshot => {
        const data = snapshot.val();
        const destinationArray = Object.values(data).map(user => ({
          latitude: parseFloat(user.locations.latitude),
          longitude: parseFloat(user.locations.longitude),
          title: user.username,
        }));
        setDestinations(destinationArray);
      });
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        setCurrentLocation(position.coords);
      },
      error => {
        console.log('Error tracking location:', error);
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title={'Current Location'}
            pinColor="red"
          />
          {destinations.map((destination, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title={'Online'}
              pinColor="blue"
            />
          ))}
        </MapView>
      ) : (
        // <Text
        //   style={{
        //     justifyContent: 'center',
        //     textAlign: 'center',
        //     fontSize: 16,
        //     fontWeight: 'bold',
        //     marginVertical: '50%',
        //   }}>
        //   Loading...
        // </Text>
        <ActivityIndicator
          style={{marginVertical: '60%'}}
          color={'blue'}
          size={'large'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default UserTwoScreen;
