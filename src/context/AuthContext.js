// context/AuthContext.js
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
	arrayUnion,
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

	// Создание/проверка записи админа в Firestore
	const createAdminRecord = async userId => {
		try {
			const adminDocRef = doc(db, 'users', userId)
			const adminDoc = await getDoc(adminDocRef)

			if (!adminDoc.exists()) {
				// Создаем запись админа
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
			console.log('Начинаем регистрацию:', email)

			// Проверяем, существует ли уже пользователь с таким email
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

			// 1. Создаем пользователя в Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			console.log('Пользователь создан в Auth:', userCredential.user.uid)

			// Для администратора не отправляем подтверждение email
			if (email !== 'admin@admin.da') {
				// 2. Отправляем письмо для подтверждения email
				await sendEmailVerification(userCredential.user)
				console.log('Письмо для подтверждения отправлено')
			}

			// 3. Обновляем профиль с именем
			await updateProfile(userCredential.user, {
				displayName: `${userInfo.firstName} ${userInfo.lastName}`,
			})
			console.log('Профиль обновлен')

			// 4. Сохраняем дополнительные данные в Firestore
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

			// 5. Получаем и сохраняем данные пользователя
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

	// Вход пользователя
	async function login(email, password) {
		try {
			console.log('Попытка входа:', email)

			// Для админа используем специальную логику
			if (email === 'admin@admin.da' && password === 'admin1') {
				try {
					// Пытаемся войти с существующими учетными данными
					const userCredential = await signInWithEmailAndPassword(
						auth,
						email,
						password
					)
					console.log('Админ вошел в систему:', userCredential.user.uid)

					// Создаем/проверяем запись админа в Firestore
					await createAdminRecord(userCredential.user.uid)

					// Получаем данные админа из Firestore
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
					// Если админа нет в auth, создаем его
					if (authError.code === 'auth/user-not-found') {
						// Создаем админа через регистрацию
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
				// Обычный вход для других пользователей
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				)
				console.log('Вход успешен:', userCredential.user.uid)

				// Получаем данные пользователя из Firestore
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

	// Выход пользователя
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

	// Покупка курса
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

			// Проверяем, не куплен ли уже курс
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

			// 1. Добавляем курс в purchasedCourses пользователя
			const courseToAdd = {
				id: String(courseId), // Всегда строка!
				title: courseData.title || `Курс ${courseId}`,
				price: courseData.price || 0,
				category: courseData.category || 'Без категории',
				description: courseData.description || '',
				purchaseDate: new Date().toISOString(),
				progress: 0, // Добавляем прогресс
			}

			console.log('➕ Добавляемый курс:', courseToAdd)

			await updateDoc(userDocRef, {
				purchasedCourses: arrayUnion(courseToAdd),
				updatedAt: new Date().toISOString(),
			})
			console.log('Курс добавлен в purchasedCourses пользователя')

			// 2. Создаем запись о покупке в коллекции purchases
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

			// 3. Обновляем локальные данные пользователя
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

	// ПОЛУЧЕНИЕ КУПЛЕННЫХ КУРСОВ С ОБОГАЩЕННЫМИ ДАННЫМИ
	async function getPurchasedCourses() {
		try {
			if (!currentUser) {
				console.log('Нет текущего пользователя для получения курсов')
				return []
			}

			console.log('Получаем купленные курсы для пользователя:', currentUser.uid)

			// Получаем актуальные данные пользователя
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

			// Обогащаем данные курсов
			const enrichedCourses = await Promise.all(
				userData.purchasedCourses.map(async course => {
					if (!course) return null

					const courseId = course.id
					// Получаем полные данные курса из локального списка
					const fullCourseData = getCourseById(courseId)

					// Создаем обогащенный объект курса
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

			// Фильтруем null значения
			const filteredCourses = enrichedCourses.filter(course => course !== null)

			console.log('Обогащенные купленные курсы:', filteredCourses)
			return filteredCourses
		} catch (error) {
			console.error('Ошибка получения купленных курсов:', error)
			return []
		}
	}

	// Обновление профиля пользователя
	async function updateUserProfile(updates) {
		try {
			if (!currentUser) {
				return {
					success: false,
					message: 'Пользователь не авторизован',
				}
			}

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
			return {
				success: false,
				error: error,
			}
		}
	}

	// Получение всех пользователей (только для админа)
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

	// Удаление курса у пользователя (только для админа)
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

			// Преобразуем courseId в строку для сравнения
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

			// Фильтруем курсы - сравниваем как строки
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

			// Обновляем данные в Firestore
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

	// Загрузка данных пользователя из Firestore
	async function loadUserData(uid) {
		try {
			console.log('Загрузка данных пользователя:', uid)

			const userDoc = await getDoc(doc(db, 'users', uid))
			if (userDoc.exists()) {
				const data = userDoc.data()
				setUserData(data)
				console.log('Данные пользователя загружены:', data)
			} else {
				// Если запись не найдена, создаем для админа
				if (currentUser?.email === 'admin@admin.da') {
					await createAdminRecord(uid)
					// Повторно получаем данные
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

	// Проверка статуса аутентификации
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

		return unsubscribe
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
