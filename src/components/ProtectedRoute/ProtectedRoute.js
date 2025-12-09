import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styled from 'styled-components'

const LoaderContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background: ${props => props.theme.colors.background.primary};
`

const Loader = styled.div`
	width: 50px;
	height: 50px;
	border: 3px solid rgba(99, 102, 241, 0.3);
	border-radius: 50%;
	border-top-color: ${props => props.theme.colors.primary};
	animation: spin 1s ease-in-out infinite;

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`

const ProtectedRoute = ({ children }) => {
	const { currentUser, loading } = useAuth()

	if (loading) {
		return (
			<LoaderContainer>
				<Loader />
			</LoaderContainer>
		)
	}

	if (!currentUser) {
		return <Navigate to='/login' />
	}

	return children
}

export default ProtectedRoute
