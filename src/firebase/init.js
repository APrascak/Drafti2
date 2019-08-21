import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyCC2-JzUWfvPthQG8zUczfeRU_aehnSsMA",
authDomain: "drafti2.firebaseapp.com",
databaseURL: "https://drafti2.firebaseio.com",
projectId: "drafti2",
storageBucket: "",
messagingSenderId: "772296838479",
appId: "1:772296838479:web:7404ef65e102b5a6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()
