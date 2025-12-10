import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Container = styled.div`
	max-width: 1200px;
	margin: 120px auto 60px;
	padding: 0 2rem;
`

const DashboardHeader = styled.div`
	text-align: center;
	margin-bottom: 3rem;
`

const WelcomeText = styled.h1`
	font-size: 3rem;
	background: ${props => props.theme.colors.gradient.primary};
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 1rem;
`

const SectionTitle = styled.h2`
	font-size: 2rem;
	margin-bottom: 2rem;
	color: ${props => props.theme.colors.text.primary};
`

const CoursesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 2rem;
`

const CourseCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	overflow: hidden;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	height: 100%;

	&:hover {
		transform: translateY(-5px);
		border-color: rgba(99, 102, 241, 0.3);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}
`

const CourseContent = styled.div`
	padding: 1.5rem;
	flex: 1;
	display: flex;
	flex-direction: column;
`

const CourseTitle = styled.h3`
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
	color: ${props => props.theme.colors.text.primary};
`

const CourseDescription = styled.p`
	color: ${props => props.theme.colors.text.secondary};
	margin-bottom: 1rem;
	font-size: 0.9rem;
	flex: 1;
	min-height: 60px;
`

const ProgressBar = styled.div`
	background: rgba(255, 255, 255, 0.1);
	height: 6px;
	border-radius: 3px;
	margin-bottom: 1rem;
	overflow: hidden;
`

const ProgressFill = styled.div`
	width: ${props => props.progress}%;
	height: 100%;
	background: ${props => props.theme.colors.gradient.primary};
	border-radius: 3px;
`

const ProgressText = styled.div`
	font-size: 0.8rem;
	color: ${props => props.theme.colors.text.secondary};
	text-align: right;
	margin-bottom: 10px;
`

const ActionButton = styled(Link)`
	display: block;
	width: 100%;
	padding: 1rem;
	background: ${props => props.theme.colors.gradient.primary};
	border: none;
	border-radius: 12px;
	color: white;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	margin-top: auto;
	text-align: center;
	text-decoration: none;
	min-height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
	}
`

const EmptyState = styled.div`
	text-align: center;
	padding: 4rem 2rem;
	background: rgba(26, 26, 26, 0.3);
	border: 2px dashed rgba(99, 102, 241, 0.2);
	border-radius: 20px;

	h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: ${props => props.theme.colors.text.primary};
	}

	p {
		color: ${props => props.theme.colors.text.secondary};
		margin-bottom: 2rem;
	}
`

const Dashboard = () => {
	const { currentUser, userData, getPurchasedCourses } = useAuth()
	const [purchasedCourses, setPurchasedCourses] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchPurchasedCourses = async () => {
			try {
				setLoading(true)
				setError('')

				if (currentUser) {
					console.log('Загружаем курсы для пользователя:', currentUser.uid)
					const courses = await getPurchasedCourses()
					console.log('Полученные курсы:', courses)

					if (Array.isArray(courses)) {
						setPurchasedCourses(courses)
					} else {
						console.error('Получены неверные данные курсов:', courses)
						setPurchasedCourses([])
					}
				} else {
					console.log('Пользователь не авторизован')
					setPurchasedCourses([])
				}
			} catch (error) {
				console.error('Ошибка загрузки курсов:', error)
				setError('Не удалось загрузить курсы')
				setPurchasedCourses([])
			} finally {
				setLoading(false)
			}
		}

		fetchPurchasedCourses() // eslint-disable-next-line
	}, [currentUser])

	if (loading) {
		return (
			<Container>
				<div style={{ textAlign: 'center', padding: '4rem' }}>
					<div
						style={{
							width: '50px',
							height: '50px',
							border: '3px solid rgba(99, 102, 241, 0.3)',
							borderTopColor: '#6366f1',
							borderRadius: '50%',
							margin: '0 auto',
							animation: 'spin 1s linear infinite',
						}}
					/>
					<p style={{ marginTop: '1rem', color: '#a0a0a0' }}>
						Загрузка ваших курсов...
					</p>
				</div>
			</Container>
		)
	}

	return (
		<Container>
			<DashboardHeader>
				<WelcomeText>
					Добро пожаловать,{' '}
					{userData?.displayName || currentUser?.email?.split('@')[0]}!
				</WelcomeText>
				<p style={{ color: '#a0a0a0', fontSize: '1.1rem' }}>
					Здесь находятся все ваши приобретенные курсы
				</p>
			</DashboardHeader>

			<SectionTitle>Мои курсы</SectionTitle>

			{error && (
				<div
					style={{
						background: 'rgba(239, 68, 68, 0.1)',
						border: '1px solid rgba(239, 68, 68, 0.3)',
						borderRadius: '10px',
						padding: '1rem',
						marginBottom: '2rem',
						color: '#ef4444',
					}}
				>
					{error}
				</div>
			)}

			{purchasedCourses && purchasedCourses.length > 0 ? (
				<CoursesGrid>
					{purchasedCourses.map(course => (
						<CourseCard key={course.id}>
							<CourseContent>
								<CourseTitle>{course.title}</CourseTitle>
								<CourseDescription>{course.description}</CourseDescription>

								<ProgressBar>
									<ProgressFill progress={course.progress || 0} />
								</ProgressBar>
								<ProgressText>Прогресс: {course.progress || 0}%</ProgressText>

								<ActionButton to={`/course/${course.id}`}>
									{course.progress > 0
										? 'Продолжить обучение →'
										: 'Начать обучение →'}
								</ActionButton>
							</CourseContent>
						</CourseCard>
					))}
				</CoursesGrid>
			) : (
				<EmptyState>
					<h3>У вас пока нет купленных курсов</h3>
					<p>Начните свой путь к новым знаниям прямо сейчас!</p>
					<ActionButton to='/courses'>Выбрать курс</ActionButton>
				</EmptyState>
			)}
		</Container>
	)
}

export default Dashboard
