// components/AdminRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
	const { currentUser } = useAuth()

	// Проверяем, является ли пользователь админом
	const isAdmin = currentUser?.email === 'admin@admin.da'

	if (!currentUser) {
		return <Navigate to='/login' />
	}

	if (!isAdmin) {
		return <Navigate to='/dashboard' />
	}

	return children
}

export default AdminRoute
