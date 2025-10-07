// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBF_SEDQd7nmQ_2gUVVvx6eOIU0PK_usFM",
	authDomain: "naturebnb.firebaseapp.com",
	projectId: "naturebnb",
	storageBucket: "naturebnb.firebasestorage.app",
	messagingSenderId: "338970344407",
	appId: "1:338970344407:web:6e21422ded79d951c72992",
	measurementId: "G-PFTTH31WVE",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

console.log(`app ${app}`)
// const analytics = getAnalytics(app)
export const db = getFirestore(app)
