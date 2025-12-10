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
	arrayUnion, // eslint-disable-next-line
	arrayRemove,
	serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { getCourseById } from '../utils/courseUtils'

const AuthContext = createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [userData, setUserData] = useState(null)
	const [loading, setLoading] = useState(true)

	const createAdminRecord = async userId => {
		try {
			const adminDocRef = doc(db, 'users', userId)
			const adminDoc = await getDoc(adminDocRef)

			if (!adminDoc.exists()) {
				const adminData = {
					uid: userId,
					email: 'admin@admin.da',
					firstName: 'Admin',
					lastName: 'Administrator',
					displayName: 'Admin Administrator',
					phone: '',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					purchasedCourses: [],
					emailVerified: true,
					role: 'admin',
					avatar: '',
				}
				await setDoc(adminDocRef, adminData)
				console.log('Запись админа создана в Firestore')
			}
		} catch (error) {
			console.error('Ошибка создания записи админа:', error)
		}
	}

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

	async function signup(email, password, userInfo) {
		try {
			console.log('Начинаем регистрацию:', email)

			const emailExists = await checkEmailExists(email)
			if (emailExists) {
				console.log('Email уже существует:', email)
				return {
					success: false,
					error: {
						code: 'auth/email-already-in-use',
						message: 'Пользователь с таким email уже существует',
					},
				}
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			console.log('Пользователь создан в Auth:', userCredential.user.uid)

			if (email !== 'admin@admin.da') {
				await sendEmailVerification(userCredential.user)
				console.log('Письмо для подтверждения отправлено')
			}

			await updateProfile(userCredential.user, {
				displayName: `${userInfo.firstName} ${userInfo.lastName}`,
			})
			console.log('Профиль обновлен')

			const userDocRef = doc(db, 'users', userCredential.user.uid)
			const userData = {
				uid: userCredential.user.uid,
				email: email.toLowerCase(),
				firstName: userInfo.firstName,
				lastName: userInfo.lastName,
				displayName: `${userInfo.firstName} ${userInfo.lastName}`,
				phone: '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				purchasedCourses: [],
				emailVerified: email === 'admin@admin.da' ? true : false,
				role: email === 'admin@admin.da' ? 'admin' : 'user',
				avatar: '',
			}

			console.log('Сохраняем данные в Firestore:', userData)
			await setDoc(userDocRef, userData)
			console.log('Данные сохранены в Firestore')

			const userDoc = await getDoc(userDocRef)
			if (userDoc.exists()) {
				setUserData(userDoc.data())
				console.log('Данные пользователя установлены:', userDoc.data())
			}

			return {
				success: true,
				user: userCredential.user,
				message: 'Регистрация успешна!',
			}
		} catch (error) {
			console.error('Ошибка регистрации:', error)
			return {
				success: false,
				error: {
					code: error.code || 'unknown',
					message: error.message || 'Неизвестная ошибка',
				},
			}
		}
	}

	async function login(email, password) {
		try {
			console.log('Попытка входа:', email)

			if (email === 'admin@admin.da' && password === 'admin1') {
				try {
					const userCredential = await signInWithEmailAndPassword(
						auth,
						email,
						password
					)
					console.log('Админ вошел в систему:', userCredential.user.uid)

					await createAdminRecord(userCredential.user.uid)

					const adminDoc = await getDoc(
						doc(db, 'users', userCredential.user.uid)
					)
					if (adminDoc.exists()) {
						setUserData(adminDoc.data())
						console.log('Данные админа загружены:', adminDoc.data())
					}

					return {
						success: true,
						user: userCredential.user,
					}
				} catch (authError) {
					if (authError.code === 'auth/user-not-found') {
						const adminInfo = {
							firstName: 'Admin',
							lastName: 'Administrator',
						}
						const result = await signup(email, password, adminInfo)
						return result
					}
					throw authError
				}
			} else {
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				)
				console.log('Вход успешен:', userCredential.user.uid)

				const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
				if (userDoc.exists()) {
					setUserData(userDoc.data())
					console.log('Данные пользователя загружены:', userDoc.data())
				} else {
					console.log('Документ пользователя не найден в Firestore')
				}

				return {
					success: true,
					user: userCredential.user,
				}
			}
		} catch (error) {
			console.error('Ошибка входа:', error)
			return {
				success: false,
				error: {
					code: error.code || 'unknown',
					message: error.message || 'Неизвестная ошибка',
				},
			}
		}
	}

	async function logout() {
		try {
			await signOut(auth)
			setUserData(null)
			console.log('Пользователь вышел из системы')
			return { success: true }
		} catch (error) {
			console.error('Ошибка выхода:', error)
			return {
				success: false,
				error: {
					code: error.code || 'unknown',
					message: error.message || 'Неизвестная ошибка',
				},
			}
		}
	}

	async function purchaseCourse(courseId, courseData) {
		try {
			if (!currentUser) {
				console.log('Нет текущего пользователя для покупки курса')
				return {
					success: false,
					message: 'Для покупки курса необходимо войти в систему',
				}
			}

			console.log('Начинаем покупку курса:', {
				userId: currentUser.uid,
				courseId,
				courseData,
			})

			const userDocRef = doc(db, 'users', currentUser.uid)
			const userDoc = await getDoc(userDocRef)
			const userData = userDoc.exists() ? userDoc.data() : {}

			if (userData?.purchasedCourses?.some(course => course.id === courseId)) {
				console.log('Курс уже куплен:', courseId)
				return {
					success: false,
					message: 'Этот курс уже куплен',
				}
			}

			const courseToAdd = {
				id: String(courseId),
				title: courseData.title || `Курс ${courseId}`,
				price: courseData.price || 0,
				category: courseData.category || 'Без категории',
				description: courseData.description || '',
				purchaseDate: new Date().toISOString(),
				progress: 0,
			}

			console.log('➕ Добавляемый курс:', courseToAdd)

			await updateDoc(userDocRef, {
				purchasedCourses: arrayUnion(courseToAdd),
				updatedAt: new Date().toISOString(),
			})
			console.log('Курс добавлен в purchasedCourses пользователя')

			const purchaseRef = doc(collection(db, 'purchases'))
			const purchaseData = {
				purchaseId: purchaseRef.id,
				userId: currentUser.uid,
				courseId: courseId,
				courseTitle: courseData.title,
				coursePrice: courseData.price,
				purchaseDate: new Date().toISOString(),
				status: 'completed',
				paymentMethod: 'phone',
				createdAt: serverTimestamp(),
			}
			await setDoc(purchaseRef, purchaseData)
			console.log('Запись о покупке создана:', purchaseData)

			const updatedUserDoc = await getDoc(userDocRef)
			if (updatedUserDoc.exists()) {
				const newUserData = updatedUserDoc.data()
				setUserData(newUserData)
				console.log('Локальные данные пользователя обновлены:', newUserData)
			}

			return {
				success: true,
				message: 'Курс успешно приобретен!',
			}
		} catch (error) {
			console.error('Ошибка покупки курса:', error)
			return {
				success: false,
				message: 'Ошибка при покупке курса. Попробуйте еще раз.',
				error: error,
			}
		}
	}

	async function getPurchasedCourses() {
		try {
			if (!currentUser) {
				console.log('Нет текущего пользователя для получения курсов')
				return []
			}

			console.log('Получаем купленные курсы для пользователя:', currentUser.uid)

			const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
			if (!userDoc.exists()) {
				console.log('Документ пользователя не найден')
				return []
			}

			const userData = userDoc.data()
			console.log('Сырые данные пользователя из Firestore:', userData)

			if (!userData?.purchasedCourses?.length) {
				console.log('У пользователя нет купленных курсов')
				return []
			}

			console.log(
				'Сырые купленные курсы из Firestore:',
				userData.purchasedCourses
			)

			const enrichedCourses = await Promise.all(
				userData.purchasedCourses.map(async course => {
					if (!course) return null

					const courseId = course.id
					const fullCourseData = getCourseById(courseId)

					const enrichedCourse = {
						id: String(courseId),
						title: fullCourseData?.title || course.title || `Курс ${courseId}`,
						description:
							fullCourseData?.description ||
							course.description ||
							'Описание отсутствует',
						category:
							fullCourseData?.category || course.category || 'Без категории',
						price: course.price || fullCourseData?.price || 0,
						purchaseDate: course.purchaseDate || new Date().toISOString(),
						progress: course.progress || 0,
						duration: fullCourseData?.duration || 'Не указано',
						students: fullCourseData?.students || 0,
						originalPrice: fullCourseData?.originalPrice || course.price || 0,
					}

					return enrichedCourse
				})
			)

			const filteredCourses = enrichedCourses.filter(course => course !== null)

			console.log('Обогащенные купленные курсы:', filteredCourses)
			return filteredCourses
		} catch (error) {
			console.error('Ошибка получения купленных курсов:', error)
			return []
		}
	}

	async function updateUserProfile(updates) {
		try {
			if (!currentUser) {
				return {
					success: false,
					message: 'Пользователь не авторизован',
				}
			}

			const userDocRef = doc(db, 'users', currentUser.uid)
			await updateDoc(userDocRef, {
				...updates,
				updatedAt: new Date().toISOString(),
			})

			if (updates.firstName && updates.lastName) {
				await updateProfile(currentUser, {
					displayName: `${updates.firstName} ${updates.lastName}`,
				})
			}

			const updatedDoc = await getDoc(userDocRef)
			setUserData(updatedDoc.data())

			return { success: true }
		} catch (error) {
			console.error('Ошибка обновления профиля:', error)
			return {
				success: false,
				error: error,
			}
		}
	}

	async function getAllUsers() {
		try {
			console.log('Запрос всех пользователей')

			const usersRef = collection(db, 'users')
			const querySnapshot = await getDocs(usersRef)

			const users = []
			querySnapshot.forEach(doc => {
				const data = doc.data()
				users.push({
					id: doc.id,
					...data,
				})
			})

			console.log('Найдено пользователей:', users.length)
			return users
		} catch (error) {
			console.error('Ошибка получения пользователей:', error)
			throw error
		}
	}

	async function deleteUserCourse(userId, courseId) {
		try {
			console.log('🔵 Удаление курса:', {
				userId,
				courseId,
				type: typeof courseId,
				value: courseId,
			})

			if (!userId || !courseId) {
				throw new Error('Не указан userId или courseId')
			}

			const userDocRef = doc(db, 'users', userId)
			const userDoc = await getDoc(userDocRef)

			if (!userDoc.exists()) {
				throw new Error('Пользователь не найден')
			}

			const userData = userDoc.data()
			let currentCourses = userData.purchasedCourses || []

			const courseIdStr = String(courseId)

			console.log('📊 Данные пользователя:', {
				email: userData.email,
				totalCourses: currentCourses.length,
				courses: currentCourses.map(c => ({
					id: c.id,
					type: typeof c.id,
					title: c.title,
				})),
			})

			console.log('🔍 Ищем курс с ID:', courseIdStr)

			const updatedCourses = currentCourses.filter(course => {
				if (!course || !course.id) return false

				const courseIdValue = String(course.id)
				const shouldKeep = courseIdValue !== courseIdStr

				if (!shouldKeep) {
					console.log('🗑️ Найден курс для удаления:', {
						courseId: course.id,
						courseTitle: course.title,
						match: false,
					})
				}

				return shouldKeep
			})

			console.log('📊 Было курсов:', currentCourses.length)
			console.log('📊 Осталось курсов:', updatedCourses.length)
			console.log(
				'📊 Удалено курсов:',
				currentCourses.length - updatedCourses.length
			)

			await updateDoc(userDocRef, {
				purchasedCourses: updatedCourses,
				updatedAt: new Date().toISOString(),
			})

			console.log('✅ Курс успешно удален')
			return {
				success: true,
				removed: currentCourses.length - updatedCourses.length,
			}
		} catch (error) {
			console.error('❌ Ошибка удаления курса:', error)
			console.error('Детали ошибки:', {
				message: error.message,
				stack: error.stack,
				userId,
				courseId,
			})
			throw error
		}
	}

	async function loadUserData(uid) {
		try {
			console.log('Загрузка данных пользователя:', uid)

			const userDoc = await getDoc(doc(db, 'users', uid))
			if (userDoc.exists()) {
				const data = userDoc.data()
				setUserData(data)
				console.log('Данные пользователя загружены:', data)
			} else {
				if (currentUser?.email === 'admin@admin.da') {
					await createAdminRecord(uid)
					const newUserDoc = await getDoc(doc(db, 'users', uid))
					if (newUserDoc.exists()) {
						setUserData(newUserDoc.data())
					}
				} else {
					console.log('Документ пользователя не найден')
					setUserData(null)
				}
			}
		} catch (error) {
			console.error('Ошибка загрузки данных пользователя:', error)
			setUserData(null)
		}
	}

	useEffect(() => {
		console.log('Настройка отслеживания аутентификации...')
		const unsubscribe = onAuthStateChanged(auth, async user => {
			console.log('Статус аутентификации изменен:', user ? user.uid : 'null')
			setCurrentUser(user)

			if (user) {
				await loadUserData(user.uid)
			} else {
				setUserData(null)
			}

			setLoading(false)
			console.log('Загрузка завершена')
		})

		return unsubscribe // eslint-disable-next-line
	}, [])

	const value = {
		currentUser,
		userData,
		signup,
		login,
		logout,
		purchaseCourse,
		getPurchasedCourses,
		updateUserProfile,
		getAllUsers,
		deleteUserCourse,
		loading,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
