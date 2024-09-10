const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get } = require('firebase/database');
const { getStorage } = require('firebase/storage');
const { getAuth } = require('firebase/auth'); 
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

module.exports = { database, ref, child, get, storage, auth };