import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
  }
`

const HeaderContainer = styled.header`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: rgba(26, 26, 26, 0.95);
	backdrop-filter: blur(20px);
	border-bottom: 1px solid rgba(99, 102, 241, 0.1);
	z-index: 1000;
	animation: ${slideDown} 0.8s ease-out;
	height: 80px;
	display: flex;
	align-items: center;
`

const Nav = styled.nav`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`

const Logo = styled(Link)`
	display: flex;
	align-items: center;
	gap: 1rem;
	text-decoration: none;
	transition: all 0.3s ease;
	height: 40px;
	min-width: 150px;
	flex-shrink: 0;

	&:hover {
		transform: translateY(-2px);
	}
`

const LogoText = styled.div`
	display: flex;
	flex-direction: column;
	white-space: nowrap;

	.main {
		font-size: 1.5rem;
		font-weight: 800;
		background: ${props => props.theme.colors.gradient.primary};
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
	}

	.subtitle {
		font-size: 0.6rem;
		color: ${props => props.theme.colors.text.secondary};
		letter-spacing: 2px;
		text-transform: uppercase;
		line-height: 1;
	}
`

const NavLinks = styled.div`
	display: flex;
	gap: 2rem;
	align-items: center;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	height: 40px;

	@media (max-width: 968px) {
		display: none;
	}
`

const NavLink = styled(Link)`
	color: ${props => props.theme.colors.text.secondary};
	text-decoration: none;
	font-weight: 600;
	padding: 0.5rem 1rem;
	border-radius: 25px;
	transition: all 0.3s ease;
	position: relative;
	height: 40px;
	display: flex;
	align-items: center;
	white-space: nowrap;

	&::before {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		width: 0;
		height: 2px;
		background: ${props => props.theme.colors.gradient.primary};
		transition: all 0.3s ease;
		transform: translateX(-50%);
	}

	&:hover,
	&.active {
		color: ${props => props.theme.colors.text.primary};

		&::before {
			width: 80%;
		}
	}

	&.active {
		background: rgba(99, 102, 241, 0.1);
	}
`

const AuthSection = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	height: 50px;
	min-width: 300px;
	justify-content: flex-end;
	flex-shrink: 0;

	@media (max-width: 968px) {
		display: none;
		min-width: auto;
	}
`

const AuthButton = styled(Link)`
	padding: 0.75rem 1.5rem;
	border-radius: 25px;
	font-weight: 600;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	white-space: nowrap;

	&.login {
		background: transparent;
		border: 2px solid ${props => props.theme.colors.primary};
		color: ${props => props.theme.colors.primary};

		&:hover {
			background: rgba(99, 102, 241, 0.1);
			transform: translateY(-2px);
			box-shadow: ${props => props.theme.shadows.glow};
		}
	}

	&.register {
		background: ${props => props.theme.colors.gradient.primary};
		border: none;
		color: white;
		animation: ${glow} 2s ease-in-out infinite;

		&:hover {
			transform: translateY(-2px);
			animation: none;
			box-shadow: ${props => props.theme.shadows.glowStrong};
		}
	}
`

const UserMenu = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	gap: 1rem;
	height: 50px;
	width: 100%;
	justify-content: flex-end;
`

const UserAvatar = styled.div`
	width: 45px;
	height: 45px;
	border-radius: 50%;
	background: ${props => props.theme.colors.gradient.primary};
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: bold;
	font-size: 1.2rem;
	cursor: pointer;
	border: 2px solid rgba(99, 102, 241, 0.3);
	transition: all 0.3s ease;
	flex-shrink: 0;

	&:hover {
		transform: scale(1.1);
		border-color: rgba(99, 102, 241, 0.6);
		box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
	}
`

const UserDropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 1rem;
	background: rgba(26, 26, 26, 0.98);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 15px;
	padding: 1rem;
	min-width: 250px;
	z-index: 1001;
	animation: ${slideDown} 0.3s ease-out;

	&::before {
		content: '';
		position: absolute;
		top: -6px;
		right: 20px;
		width: 12px;
		height: 12px;
		background: rgba(26, 26, 26, 0.98);
		border-left: 1px solid rgba(99, 102, 241, 0.1);
		border-top: 1px solid rgba(99, 102, 241, 0.1);
		transform: rotate(45deg);
	}
`

const UserInfo = styled.div`
	padding: 0.5rem 0;
	border-bottom: 1px solid rgba(99, 102, 241, 0.1);
	margin-bottom: 0.5rem;
`

const UserName = styled.div`
	font-size: 1.1rem;
	font-weight: 600;
	color: ${props => props.theme.colors.text.primary};
	margin-bottom: 0.25rem;
`

const UserEmail = styled.div`
	color: ${props => props.theme.colors.text.secondary};
	font-size: 0.9rem;
`

const DropdownItem = styled(Link)`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	color: ${props => props.theme.colors.text.secondary};
	text-decoration: none;
	border-radius: 10px;
	transition: all 0.3s ease;

	&:hover {
		background: rgba(99, 102, 241, 0.1);
		color: ${props => props.theme.colors.text.primary};
		transform: translateX(5px);
	}
`

const LogoutButton = styled.button`
	width: 100%;
	padding: 0.75rem 1rem;
	background: transparent;
	border: 2px solid rgba(239, 68, 68, 0.3);
	color: rgba(239, 68, 68, 0.8);
	border-radius: 10px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.3s ease;
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	&:hover {
		background: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.6);
		transform: translateX(5px);
	}
`

const MobileMenuButton = styled.button`
	display: none;
	background: rgba(99, 102, 241, 0.1);
	border: 1px solid rgba(99, 102, 241, 0.2);
	border-radius: 10px;
	padding: 0.75rem;
	color: ${props => props.theme.colors.primary};
	font-size: 1.2rem;
	transition: all 0.3s ease;
	width: 45px;
	height: 45px;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-left: auto;

	&:hover {
		background: rgba(99, 102, 241, 0.2);
		transform: scale(1.05);
	}

	@media (max-width: 968px) {
		display: flex;
	}
`

const MobileMenu = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(15, 15, 15, 0.98);
	backdrop-filter: blur(20px);
	z-index: 2000;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	animation: ${slideDown} 0.3s ease-out;
`

const MobileMenuHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 3rem;
`

const CloseButton = styled.button`
	background: rgba(255, 255, 255, 0.1);
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	color: ${props => props.theme.colors.text.primary};
	font-size: 1.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;

	&:hover {
		background: rgba(99, 102, 241, 0.3);
		transform: rotate(90deg);
	}
`

const MobileNavLinks = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	flex: 1;
`

const MobileNavItem = styled(Link)`
	padding: 1.5rem;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 15px;
	color: ${props => props.theme.colors.text.primary};
	text-decoration: none;
	font-size: 1.2rem;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: all 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.1);

	&:hover {
		background: rgba(99, 102, 241, 0.2);
		transform: translateX(10px);
		border-color: rgba(99, 102, 241, 0.3);
	}
`

const MobileAuthSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 2rem;
`

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [userDropdownOpen, setUserDropdownOpen] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()
	const { currentUser, userData, logout } = useAuth()

	const userMenuRef = useRef(null)
	const mobileMenuRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = event => {
			if (
				userDropdownOpen &&
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target)
			) {
				setUserDropdownOpen(false)
			}

			if (
				mobileMenuOpen &&
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target)
			) {
				setMobileMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [userDropdownOpen, mobileMenuOpen])

	useEffect(() => {
		setMobileMenuOpen(false)
		setUserDropdownOpen(false)
	}, [location])

	const handleLogoClick = e => {
		if (location.pathname === '/') {
			e.preventDefault()
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			})
		}
	}

	const handleLogout = async () => {
		try {
			await logout()
			setUserDropdownOpen(false)
			setMobileMenuOpen(false)
			navigate('/')
		} catch (error) {
			console.error('Ошибка при выходе:', error)
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

	const navItems = [
		{ path: '/courses', text: 'Курсы' },
		{ path: '/about', text: 'О нас' },
		{ path: '/reviews', text: 'Отзывы' },
		{ path: '/contacts', text: 'Контакты' },
	]

	return (
		<>
			<HeaderContainer>
				<Nav>
					<Logo to='/' onClick={handleLogoClick}>
						<LogoText>
							<div className='main'>Корочки.есть</div>
						</LogoText>
					</Logo>

					<NavLinks>
						{navItems.map(item => (
							<NavLink
								key={item.path}
								to={item.path}
								className={location.pathname === item.path ? 'active' : ''}
							>
								{item.text}
							</NavLink>
						))}
					</NavLinks>

					<AuthSection>
						{currentUser ? (
							<UserMenu ref={userMenuRef}>
								<UserAvatar
									onClick={() => setUserDropdownOpen(!userDropdownOpen)}
									title='Личный кабинет'
								>
									{getInitials()}
								</UserAvatar>

								{userDropdownOpen && (
									<UserDropdown>
										<UserInfo>
											<UserName>
												{userData?.displayName || 'Пользователь'}
											</UserName>
											<UserEmail>{currentUser.email}</UserEmail>
										</UserInfo>
										{currentUser?.email === 'admin@admin.da' && (
											<DropdownItem
												to='/admin'
												onClick={() => setUserDropdownOpen(false)}
											>
												Админ панель
											</DropdownItem>
										)}
										<DropdownItem
											to='/dashboard'
											onClick={() => setUserDropdownOpen(false)}
										>
											Личный кабинет
										</DropdownItem>

										<DropdownItem
											to='/profile'
											onClick={() => setUserDropdownOpen(false)}
										>
											Настройки профиля
										</DropdownItem>

										<LogoutButton onClick={handleLogout}>
											<span>Выйти</span>
										</LogoutButton>
									</UserDropdown>
								)}
							</UserMenu>
						) : (
							<>
								<AuthButton to='/login' className='login'>
									Войти
								</AuthButton>
								<AuthButton to='/register' className='register'>
									Регистрация
								</AuthButton>
							</>
						)}
					</AuthSection>

					<MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
						☰
					</MobileMenuButton>
				</Nav>
			</HeaderContainer>

			{mobileMenuOpen && (
				<MobileMenu ref={mobileMenuRef}>
					<MobileMenuHeader>
						<Logo to='/' onClick={() => setMobileMenuOpen(false)}>
							<LogoText>
								<div className='main'>Корочки.есть</div>
							</LogoText>
						</Logo>
						<CloseButton onClick={() => setMobileMenuOpen(false)}>
							✕
						</CloseButton>
					</MobileMenuHeader>

					<MobileNavLinks>
						{navItems.map(item => (
							<MobileNavItem
								key={item.path}
								to={item.path}
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.text}
							</MobileNavItem>
						))}

						{currentUser && (
							<>
								<MobileNavItem
									to='/dashboard'
									onClick={() => setMobileMenuOpen(false)}
								>
									Личный кабинет
								</MobileNavItem>

								<MobileNavItem
									to='/profile'
									onClick={() => setMobileMenuOpen(false)}
								>
									Настройки профиля
								</MobileNavItem>
							</>
						)}
					</MobileNavLinks>

					<MobileAuthSection>
						{currentUser ? (
							<button
								onClick={handleLogout}
								style={{
									padding: '1rem',
									background: 'rgba(239, 68, 68, 0.1)',
									border: '2px solid rgba(239, 68, 68, 0.3)',
									color: 'rgba(239, 68, 68, 0.8)',
									borderRadius: '12px',
									cursor: 'pointer',
									fontWeight: '600',
									fontSize: '1rem',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '0.5rem',
								}}
							>
								<span>Выйти</span>
							</button>
						) : (
							<>
								<AuthButton
									to='/login'
									className='login'
									style={{ fontSize: '1rem', textAlign: 'center' }}
								>
									Войти
								</AuthButton>
								<AuthButton
									to='/register'
									className='register'
									style={{ fontSize: '1rem', textAlign: 'center' }}
								>
									Регистрация
								</AuthButton>
							</>
						)}
					</MobileAuthSection>
				</MobileMenu>
			)}
		</>
	)
}

export default Header
