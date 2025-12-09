import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Получить все курсы
export const getAllCourses = async () => {
	const coursesRef = collection(db, 'courses')
	const snapshot = await getDocs(coursesRef)
	return snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data(),
	}))
}

// Получить купленные курсы пользователя
export const getUserPurchasedCourses = async userId => {
	const purchasesRef = collection(db, 'purchases')
	const q = query(purchasesRef, where('userId', '==', userId))
	const snapshot = await getDocs(q)

	const purchases = snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data(),
	}))

	// Получить данные о каждом купленном курсе
	const coursePromises = purchases.map(async purchase => {
		const courseDoc = await getDoc(doc(db, 'courses', purchase.courseId))
		return {
			...courseDoc.data(),
			id: courseDoc.id,
			purchaseDate: purchase.purchaseDate,
			progress: purchase.progress || 0,
		}
	})

	return Promise.all(coursePromises)
}

// Добавить покупку курса
export const addCoursePurchase = async (userId, courseId) => {
	const purchaseRef = doc(collection(db, 'purchases'))
	await setDoc(purchaseRef, {
		userId,
		courseId,
		purchaseDate: new Date().toISOString(),
		progress: 0,
	})

	// Обновить список курсов пользователя
	const userRef = doc(db, 'users', userId)
	const userDoc = await getDoc(userRef)
	const userData = userDoc.data()

	await updateDoc(userRef, {
		purchasedCourses: [...(userData.purchasedCourses || []), courseId],
	})
}
