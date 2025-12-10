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
	serverTimestamp,
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

			// 2. Отправляем письмо для подтверждения email
			await sendEmailVerification(userCredential.user)
			console.log('Письмо для подтверждения отправлено')

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
				purchasedCourses: [], // Пустой массив купленных курсов
				emailVerified: false,
				role: 'user',
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

			// Возвращаем успешный результат
			return {
				success: true,
				user: userCredential.user,
				message: 'Регистрация успешна! Проверьте email для подтверждения.',
			}
		} catch (error) {
			console.error('Ошибка регистрации:', error)
			// Возвращаем ошибку
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
			if (userData?.purchasedCourses?.includes(courseId)) {
				console.log('Курс уже куплен:', courseId)
				return {
					success: false,
					message: 'Этот курс уже куплен',
				}
			}

			// 1. Добавляем курс в purchasedCourses пользователя
			const userDocRef = doc(db, 'users', currentUser.uid)
			await updateDoc(userDocRef, {
				purchasedCourses: arrayUnion(courseId),
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

	// Получение купленных курсов пользователя
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
			console.log('Данные пользователя:', userData)

			if (!userData?.purchasedCourses?.length) {
				console.log('У пользователя нет купленных курсов')
				return []
			}

			console.log('Купленные курсы ID:', userData.purchasedCourses)

			// Получаем данные курсов
			const purchasedCourses = []
			for (const courseId of userData.purchasedCourses) {
				try {
					const courseDoc = await getDoc(
						doc(db, 'courses', courseId.toString())
					)
					if (courseDoc.exists()) {
						purchasedCourses.push({
							id: courseDoc.id,
							...courseDoc.data(),
							progress: 0, // Начальный прогресс
						})
						console.log('Курс найден в Firestore:', courseDoc.id)
					} else {
						// Если курса нет в коллекции courses, создаем его из локального массива
						console.log(
							'Курс не найден в Firestore, используем локальные данные:',
							courseId
						)
						const allCourses = [
							{
								id: 1,
								title: 'Веб-разработка на React',
								category: 'Программирование',
								description:
									'Освойте современную фронтенд-разработку с использованием React, Redux и современных инструментов',
							},
							{
								id: 2,
								title: 'Python для анализа данных',
								category: 'Программирование',
								description:
									'Изучите Python и библиотеки для анализа данных: Pandas, NumPy, Matplotlib и Scikit-learn',
							},
							{
								id: 3,
								title: 'Мобильная разработка iOS',
								category: 'Программирование',
								description:
									'Создание приложений для iOS на Swift с нуля до публикации в App Store',
							},
							{
								id: 4,
								title: 'Fullstack JavaScript',
								category: 'Программирование',
								description:
									'Полный курс по JavaScript: от основ до создания полноценных веб-приложений',
							},
							{
								id: 5,
								title: 'Java для enterprise',
								category: 'Программирование',
								description:
									'Разработка корпоративных приложений на Java Spring Framework',
							},
							{
								id: 6,
								title: 'Frontend с Vue.js',
								category: 'Программирование',
								description:
									'Современная фронтенд-разработка с Vue 3, Composition API и экосистемой',
							},
							{
								id: 7,
								title: 'Backend с Node.js',
								category: 'Программирование',
								description:
									'Создание серверных приложений на Node.js с Express и MongoDB',
							},
							{
								id: 8,
								title: 'DevOps и Docker',
								category: 'Программирование',
								description:
									'Автоматизация развертывания и управление инфраструктурой',
							},
							{
								id: 9,
								title: 'Тестирование ПО',
								category: 'Программирование',
								description:
									'Автоматизированное тестирование веб и мобильных приложений',
							},
							{
								id: 10,
								title: 'Game Development',
								category: 'Программирование',
								description: 'Разработка игр на Unity и C# для разных платформ',
							},
							{
								id: 11,
								title: 'UX/UI Дизайн',
								category: 'Дизайн',
								description:
									'Научитесь создавать интуитивные и красивые интерфейсы для веб и мобильных приложений',
							},
							{
								id: 12,
								title: 'Графический дизайн',
								category: 'Дизайн',
								description:
									'Освойте Adobe Photoshop, Illustrator и создавайте профессиональные дизайны',
							},
							{
								id: 13,
								title: 'Motion Design',
								category: 'Дизайн',
								description:
									'Создание анимации и визуальных эффектов в After Effects',
							},
							{
								id: 14,
								title: '3D моделирование',
								category: 'Дизайн',
								description: 'Основы 3D моделирования в Blender для начинающих',
							},
							{
								id: 15,
								title: 'Product Design',
								category: 'Дизайн',
								description: 'Полный цикл проектирования digital-продуктов',
							},
							{
								id: 16,
								title: 'Бренд-дизайн',
								category: 'Дизайн',
								description:
									'Создание айдентики и фирменного стиля для компаний',
							},
							{
								id: 17,
								title: 'Digital-маркетинг',
								category: 'Маркетинг',
								description:
									'Полный курс по digital-маркетингу: SMM, контекстная реклама, SEO и аналитика',
							},
							{
								id: 18,
								title: 'SMM Продвижение',
								category: 'Маркетинг',
								description:
									'Эффективное продвижение в социальных сетях: Instagram, VK, Telegram',
							},
							{
								id: 19,
								title: 'SEO Оптимизация',
								category: 'Маркетинг',
								description:
									'Продвижение сайтов в поисковых системах Яндекс и Google',
							},
							{
								id: 20,
								title: 'Контент-маркетинг',
								category: 'Маркетинг',
								description:
									'Создание и продвижение контента для привлечения клиентов',
							},
							{
								id: 21,
								title: 'Email-маркетинг',
								category: 'Маркетинг',
								description:
									'Автоматизация email-рассылок и повышение конверсии',
							},
							{
								id: 22,
								title: 'Performance Marketing',
								category: 'Маркетинг',
								description:
									'Работа с performance-каналами и оптимизация рекламных бюджетов',
							},
							{
								id: 23,
								title: 'Project Management',
								category: 'Менеджмент',
								description:
									'Управление проектами по методологии Agile, Scrum и классическим подходам',
							},
							{
								id: 24,
								title: 'Product Management',
								category: 'Менеджмент',
								description:
									'Управление digital-продуктами от идеи до запуска и развития',
							},
							{
								id: 25,
								title: 'HR Management',
								category: 'Менеджмент',
								description:
									'Современные подходы к управлению персоналом в IT-компаниях',
							},
							{
								id: 26,
								title: 'Team Leadership',
								category: 'Менеджмент',
								description:
									'Развитие лидерских качеств и управление командами разработки',
							},
							{
								id: 27,
								title: 'Data Analytics',
								category: 'Аналитика',
								description:
									'Анализ данных с помощью SQL, Python и визуализация в Tableau',
							},
							{
								id: 28,
								title: 'Web Analytics',
								category: 'Аналитика',
								description:
									'Настройка и анализ веб-метрик в Google Analytics и Яндекс.Метрика',
							},
							{
								id: 29,
								title: 'Business Intelligence',
								category: 'Аналитика',
								description: 'Построение систем бизнес-аналитики и дашбордов',
							},
							{
								id: 30,
								title: 'Machine Learning Basics',
								category: 'Аналитика',
								description: 'Введение в машинное обучение для анализа данных',
							},
						]

						const foundCourse = allCourses.find(
							course => course.id.toString() === courseId.toString()
						)
						if (foundCourse) {
							purchasedCourses.push({
								id: foundCourse.id.toString(),
								title: foundCourse.title,
								category: foundCourse.category,
								description: foundCourse.description,
								duration: foundCourse.duration,
								price: foundCourse.price,
								progress: 0,
							})
							console.log('Курс найден в локальных данных:', foundCourse.title)
						}
					}
				} catch (error) {
					console.error('Ошибка получения курса', courseId, ':', error)
				}
			}

			console.log('Итоговые купленные курсы:', purchasedCourses)
			return purchasedCourses
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
				console.log('Документ пользователя не найден')
				setUserData(null)
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
		loading,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
