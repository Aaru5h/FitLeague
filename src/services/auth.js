import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// Sign up and set user's display name
export const signUp = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, {
    displayName: name,
  });

  return user;
};

// Log in
export const logIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Log out
export const logOut = async () => {
  return signOut(auth);
};
