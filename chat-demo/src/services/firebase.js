import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const config = {
    apiKey: "AIzaSyAEVrxtgQiz58Md__VDGWjlxiahNdjUD10",
    authDomain: "chat-demo-c2549.firebaseapp.com",
    databaseURL: "https://chat-demo-c2549-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
