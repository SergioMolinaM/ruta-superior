import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDaJUiPZ42GxA2BPvSTCiieBQ3yr_Tfh2A",
    authDomain: "mi-camino-a-la-u.firebaseapp.com",
    projectId: "mi-camino-a-la-u",
    storageBucket: "mi-camino-a-la-u.firebasestorage.app",
    messagingSenderId: "800211832511",
    appId: "1:800211832511:web:40c2315bb4334468a2000a",
    measurementId: "G-PJM1V8K234"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
