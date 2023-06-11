/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import BackgroundFetch from 'react-native-background-fetch';

AppRegistry.registerComponent(appName, () => App);

/**
 * BackgroundGeolocation Headless JS task.
 * For more information, see:  https://github.com/transistorsoft/react-native-background-geolocation/wiki/Android-Headless-Mode
 */
// const BackgroundGeolocationHeadlessTask = async event => {
//   let params = event.params;
//   console.log('[BackgroundGeolocation HeadlessTask] -', event.name, params);

//   switch (event.name) {
//     case 'heartbeat':
//       /**
//       * Enable this block to execute #getCurrentPosition in headless heartbeat event (will consume more power)
//       *
//       // Use await for async tasks
//       const location = await BackgroundGeolocation.getCurrentPosition({
//         samples: 1,
//         persist: false
//       });
//       console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
//       *
//       */
//       break;
//     case 'authorization':
//       BackgroundGeolocation.setConfig({
//         url: ENV.TRACKER_HOST + '/api/locations',
//       });
//       break;
//   }
// };

// BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);

const BackgroundFetchHeadlessTask = async event => {
  console.log('[BackgroundFetch HeadlessTask] start', event.taskId);

  if (event.taskId == 'react-native-background-fetch') {
  }
  console.log('[BackgroundFetch HeadlessTask] finished');

  BackgroundFetch.finish(event.taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(BackgroundFetchHeadlessTask);
