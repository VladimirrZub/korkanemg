import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const Container = styled.div`
	max-width: 800px;
	margin: 120px auto 60px;
	padding: 0 2rem;
`

const ProfileHeader = styled.div`
	text-align: center;
	margin-bottom: 3rem;
`

const ProfileTitle = styled.h1`
	font-size: 2.5rem;
	background: ${props => props.theme.colors.gradient.primary};
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 1rem;
`

const ProfileCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	padding: 2rem;
	backdrop-filter: blur(10px);
`

const AvatarSection = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
	margin-bottom: 2rem;
	padding-bottom: 2rem;
	border-bottom: 1px solid rgba(99, 102, 241, 0.1);
`

const Avatar = styled.div`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background: ${props => props.theme.colors.gradient.primary};
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 2.5rem;
	font-weight: bold;
	border: 3px solid rgba(99, 102, 241, 0.3);
`

const AvatarInfo = styled.div`
	flex: 1;
`

const AvatarName = styled.h3`
	font-size: 1.5rem;
	color: ${props => props.theme.colors.text.primary};
	margin-bottom: 0.5rem;
`

const AvatarEmail = styled.p`
	color: ${props => props.theme.colors.text.secondary};
`

const FormGroup = styled.div`
	margin-bottom: 1.5rem;
`

const Label = styled.label`
	display: block;
	color: ${props => props.theme.colors.text.secondary};
	margin-bottom: 0.5rem;
	font-weight: 600;
`

const Input = styled.input`
	width: 100%;
	padding: 0.75rem 1rem;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(99, 102, 241, 0.2);
	border-radius: 10px;
	color: ${props => props.theme.colors.text.primary};
	font-size: 1rem;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
		border-color: ${props => props.theme.colors.primary};
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const Button = styled.button`
	padding: 1rem 2rem;
	background: ${props => props.theme.colors.gradient.primary};
	border: none;
	border-radius: 10px;
	color: white;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
`

const Message = styled.div`
	padding: 1rem;
	border-radius: 10px;
	margin-bottom: 1rem;
	text-align: center;
	font-weight: 600;

	&.success {
		background: rgba(34, 197, 94, 0.1);
		color: rgba(34, 197, 94, 1);
		border: 1px solid rgba(34, 197, 94, 0.2);
	}

	&.error {
		background: rgba(239, 68, 68, 0.1);
		color: rgba(239, 68, 68, 1);
		border: 1px solid rgba(239, 68, 68, 0.2);
	}
`

const Profile = () => {
	const { currentUser, userData, updateUserProfile } = useAuth()
	const [formData, setFormData] = useState({
		displayName: userData?.displayName || '',
		phone: userData?.phone || '',
	})
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState({ type: '', text: '' })

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setMessage({ type: '', text: '' })

		try {
			await updateUserProfile(formData)
			setMessage({
				type: 'success',
				text: 'Профиль успешно обновлен!',
			})
		} catch (error) {
			console.error('Ошибка обновления профиля:', error)
			setMessage({
				type: 'error',
				text: 'Ошибка при обновлении профиля. Попробуйте еще раз.',
			})
		} finally {
			setLoading(false)
		}
	}

	const getInitials = () => {
		if (userData?.displayName) {
			return userData.displayName
				.split(' ')
				.map(n => n[0])
				.join('')
				.toUpperCase()
		}
		return currentUser?.email[0].toUpperCase() || 'U'
	}

	return (
		<Container>
			<ProfileHeader>
				<ProfileTitle>Настройки профиля</ProfileTitle>
			</ProfileHeader>

			<ProfileCard>
				<AvatarSection>
					<Avatar>{getInitials()}</Avatar>
					<AvatarInfo>
						<AvatarName>{userData?.displayName || 'Пользователь'}</AvatarName>
						<AvatarEmail>{currentUser?.email}</AvatarEmail>
					</AvatarInfo>
				</AvatarSection>

				{message.text && (
					<Message className={message.type}>{message.text}</Message>
				)}

				<form onSubmit={handleSubmit}>
					<FormGroup>
						<Label htmlFor='email'>Email адрес</Label>
						<Input
							type='email'
							id='email'
							value={currentUser?.email || ''}
							disabled
						/>
					</FormGroup>

					<FormGroup>
						<Label htmlFor='displayName'>Имя и фамилия</Label>
						<Input
							type='text'
							id='displayName'
							name='displayName'
							value={formData.displayName}
							onChange={handleChange}
							placeholder='Введите ваше имя'
						/>
					</FormGroup>

					<FormGroup>
						<Label htmlFor='phone'>Телефон</Label>
						<Input
							type='tel'
							id='phone'
							name='phone'
							value={formData.phone}
							onChange={handleChange}
							placeholder='+7 (999) 123-45-67'
						/>
					</FormGroup>

					<Button type='submit' disabled={loading}>
						{loading ? 'Сохранение...' : 'Сохранить изменения'}
					</Button>
				</form>
			</ProfileCard>
		</Container>
	)
}

export default Profile
