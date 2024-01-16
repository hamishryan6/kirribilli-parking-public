import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../Firebase";
import { FirebaseError } from "firebase/app";

const auth = getAuth(app)

export const signInAdmin = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    return true
  } catch (e) {
    const error = e as FirebaseError
    console.log(error.message)
    return false
  }
}

export const checkForAdminAuth = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe()
        resolve(true)
      } else {
        unsubscribe()
        resolve(false)
      }
    })
  })
}

export const signout = async () => {
  try {
    await signOut(auth)
    return true
  } catch (e) {
    const error = e as FirebaseError
    console.log(error.message)
    return false
  }
}