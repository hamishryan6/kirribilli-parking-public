import { FirebaseOptions, initializeApp } from "firebase/app"

// Get Firebase Config from .env file
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as string) as FirebaseOptions

export const app = initializeApp(firebaseConfig)