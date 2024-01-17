import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCyjQyxc7yeW6Yys2ufz4mi54ctf5ouPN4",
  authDomain: "whatsapp-39190.firebaseapp.com",
  projectId: "whatsapp-39190",
  storageBucket: "whatsapp-39190.appspot.com",
  messagingSenderId: "783693294515",
  appId: "1:783693294515:web:3c6b56f3b135e4880139c6",
  measurementId: "G-W1YG17VENJ"
};


const firebase = app.initializeApp(firebaseConfig);

export default firebase;