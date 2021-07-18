import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const config = {
  
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
