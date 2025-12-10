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

	&:hover {
		transform: translateY(-5px);
		border-color: rgba(99, 102, 241, 0.3);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}
`

const CourseImage = styled.div`
	height: 200px;
	background: ${props =>
		`linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
	position: relative;
	overflow: hidden;

	&::after {
		content: 'ДОСТУПНО';
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(34, 197, 94, 0.2);
		color: rgba(34, 197, 94, 1);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
	}
`

const CourseContent = styled.div`
	padding: 1.5rem;
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
	margin-top: 1rem;
	text-align: center;
	text-decoration: none;

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

	// Загрузка купленных курсов из Firebase
	useEffect(() => {
		const fetchPurchasedCourses = async () => {
			try {
				setLoading(true)
				if (currentUser) {
					const courses = await getPurchasedCourses()
					console.log('Загруженные курсы:', courses) // Для отладки
					setPurchasedCourses(courses || [])
				} else {
					setPurchasedCourses([])
				}
			} catch (error) {
				console.error('Ошибка загрузки курсов:', error)
				setPurchasedCourses([])
			} finally {
				setLoading(false)
			}
		}

		fetchPurchasedCourses() // eslint-disable-next-line
	}, [currentUser, userData]) // Убрал зависимость от userData?.purchasedCourses

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
			</DashboardHeader>

			<SectionTitle>🎓 Мои курсы</SectionTitle>

			{purchasedCourses && purchasedCourses.length > 0 ? (
				<CoursesGrid>
					{purchasedCourses.map(course => (
						<CourseCard key={course.id}>
							<CourseImage />
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
