import React, { createContext, useState, useEffect, useContext } from 'react'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile,
	sendEmailVerification,
} from 'firebase/auth'
import {
	doc,
	setDoc,
	getDoc,
	updateDoc,
	collection,
	query,
	where,
	getDocs,
} from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [userData, setUserData] = useState(null)
	const [loading, setLoading] = useState(true)

	// Проверка, существует ли пользователь с таким email
	async function checkEmailExists(email) {
		try {
			const usersRef = collection(db, 'users')
			const q = query(usersRef, where('email', '==', email.toLowerCase()))
			const querySnapshot = await getDocs(q)

			return !querySnapshot.empty
		} catch (error) {
			console.error('Ошибка проверки email:', error)
			return false
		}
	}

	// Регистрация нового пользователя
	async function signup(email, password, userInfo) {
		try {
			// Проверяем, существует ли уже пользователь с таким email
			const emailExists = await checkEmailExists(email)
			if (emailExists) {
				// eslint-disable-next-line
				throw { code: 'auth/email-already-in-use' }
			}

			// 1. Создаем пользователя в Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)

			// 2. Отправляем письмо для подтверждения email
			await sendEmailVerification(userCredential.user)

			// 3. Обновляем профиль с именем
			await updateProfile(userCredential.user, {
				displayName: `${userInfo.firstName} ${userInfo.lastName}`,
			})

			// 4. Сохраняем дополнительные данные в Firestore
			const userDocRef = doc(db, 'users', userCredential.user.uid)
			await setDoc(userDocRef, {
				uid: userCredential.user.uid,
				email: email.toLowerCase(),
				firstName: userInfo.firstName,
				lastName: userInfo.lastName,
				displayName: `${userInfo.firstName} ${userInfo.lastName}`,
				phone: '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				purchasedCourses: [],
				emailVerified: false,
				role: 'user',
				avatar: '',
			})

			// 5. Получаем и сохраняем данные пользователя
			const userDoc = await getDoc(userDocRef)
			setUserData(userDoc.data())

			return {
				success: true,
				user: userCredential.user,
				message: 'Регистрация успешна! Проверьте email для подтверждения.',
			}
		} catch (error) {
			console.error('Ошибка регистрации:', error)
			throw error
		}
	}

	// Вход пользователя
	async function login(email, password) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)

			// Получаем данные пользователя из Firestore
			const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
			if (userDoc.exists()) {
				setUserData(userDoc.data())
			}

			return { success: true, user: userCredential.user }
		} catch (error) {
			console.error('Ошибка входа:', error)
			throw error
		}
	}

	// Выход пользователя
	async function logout() {
		try {
			await signOut(auth)
			setUserData(null)
			return { success: true }
		} catch (error) {
			console.error('Ошибка выхода:', error)
			throw error
		}
	}

	// Обновление профиля пользователя
	async function updateUserProfile(updates) {
		try {
			if (!currentUser) throw new Error('Пользователь не авторизован')

			// Обновляем данные в Firestore
			const userDocRef = doc(db, 'users', currentUser.uid)
			await updateDoc(userDocRef, {
				...updates,
				updatedAt: new Date().toISOString(),
			})

			// Обновляем displayName в Firebase Auth
			if (updates.firstName && updates.lastName) {
				await updateProfile(currentUser, {
					displayName: `${updates.firstName} ${updates.lastName}`,
				})
			}

			// Обновляем локальные данные
			const updatedDoc = await getDoc(userDocRef)
			setUserData(updatedDoc.data())

			return { success: true }
		} catch (error) {
			console.error('Ошибка обновления профиля:', error)
			throw error
		}
	}

	// Загрузка данных пользователя из Firestore
	async function loadUserData(uid) {
		try {
			const userDoc = await getDoc(doc(db, 'users', uid))
			if (userDoc.exists()) {
				setUserData(userDoc.data())
			}
		} catch (error) {
			console.error('Ошибка загрузки данных пользователя:', error)
		}
	}

	// Проверка статуса аутентификации
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			setCurrentUser(user)

			if (user) {
				await loadUserData(user.uid)
			} else {
				setUserData(null)
			}

			setLoading(false)
		})

		return unsubscribe
	}, [])

	const value = {
		currentUser,
		userData,
		signup,
		login,
		logout,
		updateUserProfile,
		loading,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
