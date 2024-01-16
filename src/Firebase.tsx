import { FirebaseOptions, initializeApp } from "firebase/app"

const firebaseConfig = process.env.FIREBASE__CONFIG as FirebaseOptions

export const app = initializeApp(firebaseConfig)