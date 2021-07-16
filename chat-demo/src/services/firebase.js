import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const config = {
  apiKey: "your api key",
  authDomain: "your auth domain",
  databaseURL: "your database url"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
