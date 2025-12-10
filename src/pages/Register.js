import React, { useMemo, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../src/context/AuthContext'

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(90deg); }
  50% { transform: translate(-5px, -25px) rotate(180deg); }
  75% { transform: translate(-15px, -10px) rotate(270deg); }
`

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const InputFocus = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.4); }
`

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`

const AuthContainer = styled.div`
	min-height: 100vh;
	background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
`

const ParticlesBackground = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
`

const Particle = styled.div`
	position: absolute;
	width: ${props => props.size || '4px'};
	height: ${props => props.size || '4px'};
	background: rgba(99, 102, 241, ${props => props.opacity || '0.6'});
	border-radius: 50%;
	animation: ${props => {
		const duration = props.duration || '20s'
		return css`
			${particleFloat} ${duration} linear infinite
		`
	}};
	top: ${props => props.top}%;
	left: ${props => props.left}%;
	animation-delay: ${props => props.delay || '0s'};
`

const AuthCard = styled.div`
	background: rgba(20, 20, 20, 0.8);
	backdrop-filter: blur(20px);
	border-radius: 30px;
	padding: 3rem;
	width: 100%;
	max-width: 520px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
		inset 0 1px 0 rgba(255, 255, 255, 0.1);
	position: relative;
	z-index: 2;
	animation: ${slideUp} 0.8s ease-out;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #6366f1, #8b5cf6);
		animation: ${InputFocus} 1.5s ease-out;
	}
`

const AuthHeader = styled.div`
	text-align: center;
	margin-bottom: 1.5rem;
`

const AuthTitle = styled.h1`
	font-size: 2.5rem;
	font-weight: 800;
	background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 0.5rem;
`

const AuthForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`

const FormRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;

	@media (max-width: 576px) {
		grid-template-columns: 1fr;
	}
`

const FormGroup = styled.div`
	position: relative;
`

const FormLabel = styled.label`
	display: block;
	margin-bottom: 0.8rem;
	color: #e0e0e0;
	font-weight: 600;
	font-size: 1rem;
`

const FormInput = styled.input`
	width: 100%;
	padding: 1.2rem 3.5rem 1.2rem 1.5rem;
	background: rgba(255, 255, 255, 0.05);
	border: 2px solid
		${props => {
			if (props.$hasError) return '#ef4444'
			if (props.$isValid) return '#10b981'
			return 'rgba(255, 255, 255, 0.1)'
		}};
	border-radius: 15px;
	color: white;
	font-size: 1rem;
	transition: all 0.3s ease;
	outline: none;

	&:focus {
		border-color: #6366f1;
		background: rgba(99, 102, 241, 0.05);
		${props =>
			!props.$hasError &&
			css`
				animation: ${glow} 2s infinite;
			`}
	}

	&::placeholder {
		color: #666;
	}

	${props =>
		props.$hasError &&
		css`
			animation: ${shake} 0.5s ease-in-out;
		`}
`

const PasswordToggle = styled.button`
	position: absolute;
	right: 15px;
	top: 50px;
	background: transparent;
	border: none;
	color: #a0a0a0;
	cursor: pointer;
	font-size: 1.2rem;
	transition: all 0.3s ease;
	padding: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	width: 36px;
	height: 36px;

	&:hover {
		color: #6366f1;
		background: rgba(99, 102, 241, 0.1);
	}

	&:active {
		transform: scale(0.95);
	}
`

const ErrorMessage = styled.div`
	color: #ef4444;
	font-size: 0.85rem;
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	animation: ${slideUp} 0.3s ease-out;

	&::before {
		content: '⚠';
	}
`

const SuccessMessage = styled.div`
	color: #10b981;
	font-size: 0.85rem;
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	animation: ${slideUp} 0.3s ease-out;
	padding: 1rem;
	background: rgba(16, 185, 129, 0.1);
	border-radius: 10px;
	border: 1px solid rgba(16, 185, 129, 0.2);

	&::before {
		content: '✓';
	}
`

const SubmitButton = styled.button`
	padding: 1.2rem 2.5rem;
	background: ${props =>
		props.disabled
			? 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)'
			: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'};
	border: none;
	border-radius: 15px;
	color: white;
	font-weight: 700;
	font-size: 1.1rem;
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
	transition: all 0.3s ease;
	margin-top: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.8rem;

	&:hover:not(:disabled) {
		transform: translateY(-3px);
		box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
	}

	&:disabled {
		opacity: 0.6;
	}
`

const AuthFooter = styled.div`
	text-align: center;
	color: #a0a0a0;
	font-size: 0.95rem;
`

const AuthLink = styled(Link)`
	color: #6366f1;
	text-decoration: none;
	font-weight: 600;
	margin-left: 0.5rem;
	transition: color 0.3s ease;

	&:hover {
		color: #8b5cf6;
		text-decoration: underline;
	}
`

const PasswordRequirements = styled.div`
	background: rgba(255, 255, 255, 0.03);
	border-radius: 10px;
	padding: 1rem;
	margin-top: 0.5rem;
`

const Requirement = styled.div`
	color: ${props => (props.$valid ? '#10b981' : '#a0a0a0')};
	font-size: 0.85rem;
	margin: 0.3rem 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	&::before {
		content: '${props => (props.$valid ? '✓' : '○')}';
		font-size: 0.9rem;
	}
`

const EyeIcon = ({ show }) => (
	<svg
		width='20'
		height='20'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		{show ? (
			<>
				<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
				<circle cx='12' cy='12' r='3' />
			</>
		) : (
			<>
				<path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
			</>
		)}
	</svg>
)

const generateParticles = () => {
	const particles = []
	for (let i = 0; i < 40; i++) {
		particles.push({
			id: i,
			top: Math.random() * 100,
			left: Math.random() * 100,
			size: `${Math.random() * 3 + 2}px`,
			opacity: Math.random() * 0.4 + 0.3,
			duration: `${Math.random() * 15 + 10}s`,
			delay: `${Math.random() * 5}s`,
		})
	}
	return particles
}

const Particles = React.memo(() => {
	const particles = useMemo(() => generateParticles(), [])

	return (
		<ParticlesBackground>
			{particles.map(particle => (
				<Particle key={particle.id} {...particle} />
			))}
		</ParticlesBackground>
	)
})

const Register = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreedToTerms: false,
	})

	const [errors, setErrors] = useState({})
	const [touched, setTouched] = useState({})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')

	const { signup } = useAuth()
	const navigate = useNavigate()

	const validateEmail = email => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	const passwordRequirements = [
		{ id: 1, text: 'Минимум 8 символов', valid: formData.password.length >= 8 },
	]

	const isPasswordValid = passwordRequirements.every(req => req.valid)
	const passwordsMatch = formData.password === formData.confirmPassword

	const validateForm = () => {
		const newErrors = {}

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'Имя обязательно для заполнения'
		} else if (formData.firstName.length < 2) {
			newErrors.firstName = 'Имя должно содержать минимум 2 символа'
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Фамилия обязательна для заполнения'
		} else if (formData.lastName.length < 2) {
			newErrors.lastName = 'Фамилия должна содержать минимум 2 символа'
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email обязателен для заполнения'
		} else if (!validateEmail(formData.email)) {
			newErrors.email = 'Введите корректный email адрес'
		}

		if (!formData.password) {
			newErrors.password = 'Пароль обязателен для заполнения'
		} else if (!isPasswordValid) {
			newErrors.password = 'Пароль не соответствует требованиям'
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Подтвердите пароль'
		} else if (!passwordsMatch) {
			newErrors.confirmPassword = 'Пароли не совпадают'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = e => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))

		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleBlur = field => {
		setTouched(prev => ({ ...prev, [field]: true }))

		const newErrors = { ...errors }

		switch (field) {
			case 'firstName':
				if (!formData.firstName.trim()) {
					newErrors.firstName = 'Имя обязательно для заполнения'
				} else if (formData.firstName.length < 2) {
					newErrors.firstName = 'Имя должно содержать минимум 2 символа'
				} else {
					delete newErrors.firstName
				}
				break

			case 'lastName':
				if (!formData.lastName.trim()) {
					newErrors.lastName = 'Фамилия обязательна для заполнения'
				} else if (formData.lastName.length < 2) {
					newErrors.lastName = 'Фамилия должна содержать минимум 2 символа'
				} else {
					delete newErrors.lastName
				}
				break

			case 'email':
				if (!formData.email.trim()) {
					newErrors.email = 'Email обязателен для заполнения'
				} else if (!validateEmail(formData.email)) {
					newErrors.email = 'Введите корректный email адрес'
				} else {
					delete newErrors.email
				}
				break

			case 'password':
				if (!formData.password) {
					newErrors.password = 'Пароль обязателен для заполнения'
				} else if (!isPasswordValid) {
					newErrors.password = 'Пароль не соответствует требованиям'
				} else {
					delete newErrors.password
				}
				break

			case 'confirmPassword':
				if (!formData.confirmPassword) {
					newErrors.confirmPassword = 'Подтвердите пароль'
				} else if (!passwordsMatch) {
					newErrors.confirmPassword = 'Пароли не совпадают'
				} else {
					delete newErrors.confirmPassword
				}
				break

			default:
				break
		}

		setErrors(newErrors)
	}

	const handleSubmit = async e => {
		e.preventDefault()

		const allFields = [
			'firstName',
			'lastName',
			'email',
			'password',
			'confirmPassword',
		]
		setTouched(
			allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
		)

		if (validateForm()) {
			setIsLoading(true)
			setSuccessMessage('')

			try {
				const result = await signup(formData.email, formData.password, {
					firstName: formData.firstName,
					lastName: formData.lastName,
				})

				if (result.success) {
					setSuccessMessage('Регистрация успешна! Перенаправляем...')
					// Очищаем форму
					setFormData({
						firstName: '',
						lastName: '',
						email: '',
						password: '',
						confirmPassword: '',
						agreedToTerms: false,
					})
					setErrors({})
					setTouched({})

					// ПЕРЕНАПРАВЛЕНИЕ НА /courses ЧЕРЕЗ 2 СЕКУНДЫ
					setTimeout(() => {
						navigate('/courses')
					}, 2000)
				} else {
					// Обработка ошибок из результата
					const error = result.error
					if (error && error.code) {
						switch (error.code) {
							case 'auth/email-already-in-use':
								setErrors({
									email: 'Пользователь с таким email уже существует',
								})
								break
							case 'auth/invalid-email':
								setErrors({ email: 'Неверный формат email' })
								break
							case 'auth/weak-password':
								setErrors({
									password:
										'Пароль слишком слабый. Используйте не менее 6 символов',
								})
								break
							default:
								setErrors({
									general: 'Ошибка при создании аккаунта. Попробуйте еще раз',
								})
						}
					} else {
						setErrors({
							general: 'Ошибка при создании аккаунта. Попробуйте еще раз',
						})
					}

					const form = e.target
					form.style.animation = `shake 0.5s ease-in-out`
					setTimeout(() => {
						form.style.animation = ''
					}, 500)
				}
			} catch (error) {
				console.error('Ошибка регистрации:', error)
				setErrors({
					general: 'Ошибка при создании аккаунта. Попробуйте еще раз',
				})
			} finally {
				setIsLoading(false)
			}
		} else {
			// Используем анимацию напрямую
			const form = e.target
			form.style.animation = `shake 0.5s ease-in-out`
			setTimeout(() => {
				form.style.animation = ''
			}, 500)
		}
	}

	const togglePasswordVisibility = () => {
		setShowPassword(prev => !prev)
	}

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(prev => !prev)
	}

	const isFormValid =
		formData.firstName.trim() &&
		formData.lastName.trim() &&
		validateEmail(formData.email) &&
		isPasswordValid &&
		passwordsMatch

	return (
		<AuthContainer>
			<Particles />

			<AuthCard>
				<AuthHeader>
					<AuthTitle>Создать аккаунт</AuthTitle>
				</AuthHeader>

				<AuthForm onSubmit={handleSubmit}>
					{errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
					{successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

					<FormRow>
						<FormGroup>
							<FormLabel>Имя</FormLabel>
							<FormInput
								type='text'
								name='firstName'
								placeholder='Иван'
								value={formData.firstName}
								onChange={handleChange}
								onBlur={() => handleBlur('firstName')}
								$hasError={touched.firstName && errors.firstName}
								$isValid={
									touched.firstName &&
									!errors.firstName &&
									formData.firstName.length >= 2
								}
								required
								disabled={isLoading}
							/>
							{touched.firstName && errors.firstName && (
								<ErrorMessage>{errors.firstName}</ErrorMessage>
							)}
						</FormGroup>

						<FormGroup>
							<FormLabel>Фамилия</FormLabel>
							<FormInput
								type='text'
								name='lastName'
								placeholder='Иванов'
								value={formData.lastName}
								onChange={handleChange}
								onBlur={() => handleBlur('lastName')}
								$hasError={touched.lastName && errors.lastName}
								$isValid={
									touched.lastName &&
									!errors.lastName &&
									formData.lastName.length >= 2
								}
								required
								disabled={isLoading}
							/>
							{touched.lastName && errors.lastName && (
								<ErrorMessage>{errors.lastName}</ErrorMessage>
							)}
						</FormGroup>
					</FormRow>

					<FormGroup>
						<FormLabel>Email</FormLabel>
						<FormInput
							type='email'
							name='email'
							placeholder='your@email.com'
							value={formData.email}
							onChange={handleChange}
							onBlur={() => handleBlur('email')}
							$hasError={touched.email && errors.email}
							$isValid={
								touched.email && !errors.email && validateEmail(formData.email)
							}
							required
							disabled={isLoading}
						/>
						{touched.email && errors.email && (
							<ErrorMessage>{errors.email}</ErrorMessage>
						)}
					</FormGroup>

					<FormGroup>
						<FormLabel>Пароль</FormLabel>
						<FormInput
							type={showPassword ? 'text' : 'password'}
							name='password'
							placeholder='••••••••'
							value={formData.password}
							onChange={handleChange}
							onBlur={() => handleBlur('password')}
							$hasError={touched.password && errors.password}
							$isValid={touched.password && !errors.password && isPasswordValid}
							required
							disabled={isLoading}
						/>
						<PasswordToggle
							type='button'
							onClick={togglePasswordVisibility}
							aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							disabled={isLoading}
						>
							<EyeIcon show={showPassword} />
						</PasswordToggle>

						<PasswordRequirements>
							{passwordRequirements.map(req => (
								<Requirement key={req.id} $valid={req.valid}>
									{req.text}
								</Requirement>
							))}
						</PasswordRequirements>

						{touched.password && errors.password && (
							<ErrorMessage>{errors.password}</ErrorMessage>
						)}
					</FormGroup>

					<FormGroup>
						<FormLabel>Подтвердите пароль</FormLabel>
						<FormInput
							type={showConfirmPassword ? 'text' : 'password'}
							name='confirmPassword'
							placeholder='••••••••'
							value={formData.confirmPassword}
							onChange={handleChange}
							onBlur={() => handleBlur('confirmPassword')}
							$hasError={touched.confirmPassword && errors.confirmPassword}
							$isValid={
								touched.confirmPassword &&
								!errors.confirmPassword &&
								passwordsMatch &&
								formData.confirmPassword
							}
							required
							disabled={isLoading}
						/>
						<PasswordToggle
							type='button'
							onClick={toggleConfirmPasswordVisibility}
							aria-label={
								showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'
							}
							disabled={isLoading}
						>
							<EyeIcon show={showConfirmPassword} />
						</PasswordToggle>

						{touched.confirmPassword && errors.confirmPassword && (
							<ErrorMessage>{errors.confirmPassword}</ErrorMessage>
						)}
					</FormGroup>

					<SubmitButton type='submit' disabled={isLoading || !isFormValid}>
						{isLoading ? (
							<>
								<svg width='20' height='20' viewBox='0 0 24 24'>
									<path
										fill='currentColor'
										d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
										opacity='.25'
									/>
									<path
										fill='currentColor'
										d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'
									>
										<animateTransform
											attributeName='transform'
											type='rotate'
											dur='0.75s'
											values='0 12 12;360 12 12'
											repeatCount='indefinite'
										/>
									</path>
								</svg>
								Регистрация...
							</>
						) : (
							'Создать аккаунт'
						)}
					</SubmitButton>

					<AuthFooter>
						Уже есть аккаунт?
						<AuthLink to='/login'>Войти</AuthLink>
					</AuthFooter>
				</AuthForm>
			</AuthCard>
		</AuthContainer>
	)
}

export default Register
