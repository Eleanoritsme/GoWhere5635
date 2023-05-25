// firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

// Web app's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA_tb P1s5hJ_D10l2NkZ22f_r8upRFm8E",
  authDomain: "gowhere5635.firebaseapp.com",
  projectId: "gowhere5635",
  storageBucket: "gowhere5635.appspot.com",
  messagingSenderId: "351631531292",
  appId: "1:351631531292:web:c87e94e9eb2ec8b97f6ed9",
  measurementId: "G-Q3L3J3TRJ9"
};

let app
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { firebase };