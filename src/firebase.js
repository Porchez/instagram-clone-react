import firebase from "firebase";
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBOfcHvtxnYBDopNh-gEox8SaaJeRrp0Wo",
    authDomain: "instagram-clone-react-103bc.firebaseapp.com",
    projectId: "instagram-clone-react-103bc",
    storageBucket: "instagram-clone-react-103bc.appspot.com",
    messagingSenderId: "381975001468",
    appId: "1:381975001468:web:4c5dd385194f1b75068cf9",
    measurementId: "G-J1QHQ31H7J"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { db, auth, storage }