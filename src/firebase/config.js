import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCT7uLdHt96U508CMvRQc-AqKBv9i5n2rA',
  authDomain: 'community-chat-firebase.firebaseapp.com',
  projectId: 'community-chat-firebase',
  storageBucket: 'community-chat-firebase.appspot.com',
  messagingSenderId: '934842150984',
  appId: '1:934842150984:web:9b4f79922e4e9723bc687d',
};

const firebaseApp = initializeApp(firebaseConfig);

// initializing auth
const auth = getAuth(firebaseApp);

// initializing realtime database
const db = getDatabase(firebaseApp);

// initializing storage
const storageFire = getStorage(firebaseApp);

export { firebaseApp, auth, db, storageFire };
