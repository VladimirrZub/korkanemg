import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyCf2gqDW-4S5ynpAm3lOUOZQnNsCu5g__A',
	authDomain: 'korka-8194d.firebaseapp.com',
	projectId: 'korka-8194d',
	storageBucket: 'korka-8194d.firebasestorage.app',
	messagingSenderId: '550032729000',
	appId: '1:550032729000:web:1ec174ffdb2ce7222b739d',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
