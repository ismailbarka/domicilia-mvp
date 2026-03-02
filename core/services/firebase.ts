import { getApps, initializeApp } from 'firebase/app';

// Note: For native (iOS/Android), @react-native-firebase initializes
// automatically using GoogleService-Info.plist and google-services.json.
// This web SDK config is kept for potential web support or shared context.

const firebaseConfig = {
  apiKey: 'AIzaSyDkzGdC6KVoBUKOzxg2-v9nJTR9MJzvXoQ',
  authDomain: 'test-b0c71.firebaseapp.com',
  projectId: 'test-b0c71',
  storageBucket: 'test-b0c71.firebasestorage.app',
  messagingSenderId: '159468754144',
  appId: '1:159468754144:web:511d65c954c9bd28dfac85',
  measurementId: 'G-T3BLN5Y139'
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
