// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { getDatabase, ref, child, set } from 'firebase/database';
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

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const storageFire = getStorage(firebaseApp);

export { firebaseApp, auth, db, storageFire };
