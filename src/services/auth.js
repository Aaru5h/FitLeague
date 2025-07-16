import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signUp = async (email,password)=>{
    return createUserWithEmailAndPassword(auth,email,password)
}

export const logIn = async(email,password)=>{
    return signInWithEmailAndPassword(auth,email,password)
}

export const logOut = async()=>{
    return signOut(auth)
}