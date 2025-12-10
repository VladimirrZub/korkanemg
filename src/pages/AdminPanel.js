// pages/AdminPanel.js
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import {
	getCourseTitleById,
	allCoursesList,
	validateCourseData,
} from '../utils/courseUtils'

const AdminContainer = styled.div`
	max-width: 1200px;
	margin: 120px auto 60px;
	padding: 0 2rem;
`

const AdminHeader = styled.div`
	text-align: center;
	margin-bottom: 3rem;
`

const AdminTitle = styled.h1`
	font-size: 3rem;
	background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 1rem;
`

const DebugSection = styled.div`
	background: rgba(59, 130, 246, 0.1);
	border: 1px solid rgba(59, 130, 246, 0.3);
	border-radius: 15px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	font-family: monospace;
	font-size: 0.9rem;
	color: #93c5fd;
	white-space: pre-wrap;
	max-height: 300px;
	overflow-y: auto;
`

const SearchSection = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(255, 107, 107, 0.1);
	border-radius: 20px;
	padding: 2rem;
	margin-bottom: 2rem;
`

const SearchInput = styled.input`
	width: 100%;
	padding: 1rem 1.5rem;
	background: rgba(255, 255, 255, 0.05);
	border: 2px solid rgba(255, 107, 107, 0.2);
	border-radius: 12px;
	color: white;
	font-size: 1rem;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
		border-color: #ff6b6b;
		box-shadow: 0 0 20px rgba(255, 107, 107, 0.2);
	}

	&::placeholder {
		color: #666;
	}
`

const UserCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(255, 107, 107, 0.1);
	border-radius: 20px;
	padding: 1.5rem;
	margin-bottom: 1.5rem;
`

const UserEmail = styled.h3`
	font-size: 1.2rem;
	color: ${props => props.theme.colors.text.primary};
	margin: 0 0 0.5rem 0;
`

const CourseList = styled.div`
	margin-top: 1rem;
`

const CourseItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 10px;
	margin-bottom: 0.5rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
`

const CourseInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	flex: 1;
`

const CourseTitle = styled.span`
	color: ${props => props.theme.colors.text.primary};
	font-weight: 600;
	font-size: 1rem;
`

const CourseId = styled.span`
	color: #a0a0a0;
	font-size: 0.8rem;
	font-family: monospace;
`

const DeleteButton = styled.button`
	padding: 0.5rem 1rem;
	background: rgba(239, 68, 68, 0.2);
	border: 1px solid rgba(239, 68, 68, 0.3);
	border-radius: 8px;
	color: #ef4444;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	white-space: nowrap;
	min-width: 100px;

	&:hover {
		background: rgba(239, 68, 68, 0.3);
		transform: translateY(-2px);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
`

const LoadingSpinner = styled.div`
	text-align: center;
	padding: 3rem;

	.spinner {
		width: 50px;
		height: 50px;
		border: 3px solid rgba(255, 107, 107, 0.3);
		border-top-color: #ff6b6b;
		border-radius: 50%;
		margin: 0 auto;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`

const ErrorMessage = styled.div`
	background: rgba(239, 68, 68, 0.1);
	border: 1px solid rgba(239, 68, 68, 0.3);
	border-radius: 15px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	color: #ef4444;
`

const ActionButtons = styled.div`
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
`

const ActionButton = styled.button`
	padding: 0.75rem 1.5rem;
	background: ${props =>
		props.$variant === 'danger'
			? 'rgba(239, 68, 68, 0.2)'
			: 'rgba(99, 102, 241, 0.2)'};
	border: 1px solid
		${props =>
			props.$variant === 'danger'
				? 'rgba(239, 68, 68, 0.3)'
				: 'rgba(99, 102, 241, 0.3)'};
	border-radius: 12px;
	color: ${props => (props.$variant === 'danger' ? '#ef4444' : '#6366f1')};
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		background: ${props =>
			props.$variant === 'danger'
				? 'rgba(239, 68, 68, 0.3)'
				: 'rgba(99, 102, 241, 0.3)'};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const StatsCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
`

const StatItem = styled.div`
	text-align: center;

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: #6366f1;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: ${props => props.theme.colors.text.secondary};
		font-size: 0.9rem;
	}
`

const NoCoursesMessage = styled.div`
	color: #a0a0a0;
	text-align: center;
	padding: 1rem;
	font-style: italic;
	border: 1px dashed rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	margin-top: 1rem;
`

const AdminPanel = () => {
	const { currentUser, getAllUsers, deleteUserCourse } = useAuth()
	const [users, setUsers] = useState([])
	const [filteredUsers, setFilteredUsers] = useState([])
	const [searchEmail, setSearchEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [deletingCourse, setDeletingCourse] = useState(null)
	const [error, setError] = useState('')
	const [debugInfo, setDebugInfo] = useState(
		'Нажмите "Загрузить пользователей" для начала'
	)
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalCourses: 0,
		activeUsers: 0,
	})

	const enrichCourses = useCallback(courses => {
		if (!courses || !Array.isArray(courses)) {
			return []
		}

		return courses
			.map(course => {
				if (!course) {
					console.warn('⚠️ Найден пустой курс в массиве')
					return null
				}

				const courseId = course.id ? String(course.id) : 'unknown'

				const courseIdNum = parseInt(courseId)
				const localCourse = allCoursesList.find(c => c.id === courseIdNum)

				const enrichedCourse = {
					...course,
					id: courseId,
					title: localCourse?.title || course.title || `Курс ${courseId}`,
					description:
						localCourse?.description || course.description || 'Нет описания',
					category: localCourse?.category || course.category || 'Без категории',
					formattedId: courseId,
					isValid: validateCourseData({
						id: courseId,
						title: localCourse?.title || course.title,
					}),
					duration: localCourse?.duration || 'Не указано',
					price: course.price || localCourse?.price || 0,
					originalPrice: localCourse?.originalPrice || course.price || 0,
					students: localCourse?.students || 0,
					progress: course.progress || 0,
					purchaseDate: course.purchaseDate || new Date().toISOString(),
				}

				return enrichedCourse
			})
			.filter(course => course !== null)
	}, [])

	const loadUsers = useCallback(async () => {
		try {
			setLoading(true)
			setError('')
			setDebugInfo(' Загрузка пользователей...')

			const usersData = await getAllUsers()

			console.log('Получены данные пользователей:', usersData)

			const enrichedUsers = usersData.map(user => {
				console.log(
					'Обогащаем курсы пользователя:',
					user.email,
					user.purchasedCourses
				)
				const enrichedCourses = enrichCourses(user.purchasedCourses)

				return {
					...user,
					purchasedCourses: enrichedCourses,
					totalCourses: enrichedCourses.length,
				}
			})

			console.log('Обогащенные пользователи:', enrichedUsers)

			setUsers(enrichedUsers)
			setFilteredUsers(enrichedUsers)

			const totalCourses = enrichedUsers.reduce(
				(sum, user) => sum + user.totalCourses,
				0
			)
			const activeUsers = enrichedUsers.filter(
				user => user.totalCourses > 0
			).length

			setStats({
				totalUsers: enrichedUsers.length,
				totalCourses,
				activeUsers,
			})

			setDebugInfo(
				` Успешно загружено ${enrichedUsers.length} пользователей\n` +
					` Статистика:\n` +
					`   • Всего пользователей: ${enrichedUsers.length}\n` +
					`   • Всего курсов: ${totalCourses}\n` +
					`   • Активных пользователей: ${activeUsers}\n\n` +
					`Пример первого пользователя:\n` +
					JSON.stringify(enrichedUsers[0] || 'Нет пользователей', null, 2)
			)
		} catch (error) {
			console.error('Ошибка загрузки пользователей:', error)
			const errorMsg = error?.message || 'Неизвестная ошибка'
			setError(`Ошибка загрузки: ${errorMsg}`)
			setDebugInfo(` Ошибка загрузки: ${errorMsg}\n\n${error?.stack || ''}`)
		} finally {
			setLoading(false)
		}
	}, [getAllUsers, enrichCourses])

	useEffect(() => {
		loadUsers()
	}, [loadUsers])

	const handleDeleteCourse = async (userId, courseId, courseTitle) => {
		if (!userId || !courseId) {
			setError('Ошибка: не указан userId или courseId')
			return
		}

		if (
			!window.confirm(
				`Вы уверены, что хотите удалить курс "${courseTitle}" у пользователя?`
			)
		) {
			return
		}

		try {
			setDeletingCourse(`${userId}-${courseId}`)
			setDebugInfo(
				prev =>
					`${prev}\n\n Удаление курса "${courseTitle}" (ID: ${courseId})...`
			)

			const result = await deleteUserCourse(userId, courseId)

			if (result.success) {
				setDebugInfo(
					prev =>
						`${prev}\n Курс "${courseTitle}" успешно удален. Удалено курсов: ${result.removed}`
				)
			} else {
				setDebugInfo(prev => `${prev}\n⚠️ Курс не был удален или не найден`)
			}

			await loadUsers()
		} catch (error) {
			console.error('Ошибка удаления курса:', error)
			const errorMsg = error?.message || 'Неизвестная ошибка'
			setError(`Ошибка удаления курса: ${errorMsg}`)
			setDebugInfo(prev => `${prev}\n Ошибка удаления: ${errorMsg}`)
		} finally {
			setDeletingCourse(null)
		}
	}

	const handleClearDebug = () => {
		setDebugInfo(
			'Отладочная информация очищена.\nНажмите "Загрузить пользователей" для обновления данных.'
		)
		setError('')
	}

	const handleTestCourseData = () => {
		const testInfo =
			` Тест данных курсов:\n` +
			`Локальный список содержит ${allCoursesList.length} курсов.\n\n` +
			`Примеры функций:\n` +
			`   • getCourseTitleById(1) = "${getCourseTitleById(1)}"\n` +
			`   • getCourseTitleById("2") = "${getCourseTitleById('2')}"\n` +
			`   • getCourseTitleById(null) = "${getCourseTitleById(null)}"\n` +
			`   • getCourseTitleById(undefined) = "${getCourseTitleById(
				undefined
			)}"\n\n` +
			`Первые 5 курсов:\n` +
			allCoursesList
				.slice(0, 5)
				.map(course => `   • ID: ${course.id}, Название: "${course.title}"`)
				.join('\n')

		setDebugInfo(testInfo)
	}

	const handleFixInvalidCourses = async () => {
		try {
			setDebugInfo('🔄 Исправление невалидных курсов...')

			await loadUsers()

			setDebugInfo(
				prev => `${prev}\n Данные обновлены. Проверьте список пользователей.`
			)
		} catch (error) {
			setDebugInfo(
				prev => `${prev}\n Ошибка обновления данных: ${error.message}`
			)
		}
	}

	useEffect(() => {
		if (searchEmail.trim() === '') {
			setFilteredUsers(users)
		} else {
			const filtered = users.filter(user =>
				user.email.toLowerCase().includes(searchEmail.toLowerCase())
			)
			setFilteredUsers(filtered)
		}
	}, [searchEmail, users])

	if (loading && users.length === 0) {
		return (
			<AdminContainer>
				<LoadingSpinner>
					<div className='spinner' />
					<p style={{ marginTop: '1rem', color: '#a0a0a0' }}>
						Загрузка данных...
					</p>
				</LoadingSpinner>
			</AdminContainer>
		)
	}

	return (
		<AdminContainer>
			<AdminHeader>
				<AdminTitle>Админ Панель</AdminTitle>
				<p style={{ color: '#a0a0a0' }}>
					Текущий администратор: {currentUser?.email || 'Не авторизован'}
				</p>
			</AdminHeader>

			<StatsCard>
				<StatItem>
					<div className='stat-number'>{stats.totalUsers}</div>
					<div className='stat-label'>Всего пользователей</div>
				</StatItem>
				<StatItem>
					<div className='stat-number'>{stats.totalCourses}</div>
					<div className='stat-label'>Куплено курсов</div>
				</StatItem>
				<StatItem>
					<div className='stat-number'>{stats.activeUsers}</div>
					<div className='stat-label'>Активных пользователей</div>
				</StatItem>
			</StatsCard>

			<DebugSection>
				<strong>Отладочная информация:</strong>
				<div style={{ marginTop: '0.5rem' }}>{debugInfo}</div>
			</DebugSection>

			{error && (
				<ErrorMessage>
					<strong>Ошибка:</strong> {error}
				</ErrorMessage>
			)}

			<ActionButtons>
				<ActionButton onClick={loadUsers} disabled={loading}>
					{loading ? ' Загрузка...' : ' Загрузить пользователей'}
				</ActionButton>
				<ActionButton onClick={handleTestCourseData} disabled={loading}>
					Тест данных курсов
				</ActionButton>
				<ActionButton onClick={handleFixInvalidCourses}>
					Обновить данные
				</ActionButton>
				<ActionButton onClick={handleClearDebug} $variant='danger'>
					Очистить отладку
				</ActionButton>
			</ActionButtons>

			<SearchSection>
				<SearchInput
					type='email'
					placeholder='Поиск пользователя по email...'
					value={searchEmail}
					onChange={e => setSearchEmail(e.target.value)}
					disabled={loading}
				/>
			</SearchSection>

			<div style={{ marginBottom: '1rem', color: '#a0a0a0' }}>
				Найдено пользователей: {filteredUsers.length}
				{loading && ' (обновление...)'}
			</div>

			{filteredUsers.length === 0 ? (
				<div
					style={{
						textAlign: 'center',
						padding: '3rem',
						background: 'rgba(26, 26, 26, 0.3)',
						borderRadius: '20px',
						color: '#a0a0a0',
					}}
				>
					<h3 style={{ color: '#fff', marginBottom: '1rem' }}>
						Пользователи не найдены
					</h3>
					<p>Создайте пользователей через регистрацию на сайте</p>
					<ActionButton
						onClick={() => (window.location.href = '/register')}
						style={{ marginTop: '1rem' }}
					>
						👤 Перейти к регистрации
					</ActionButton>
				</div>
			) : (
				<div>
					{filteredUsers.map(user => (
						<UserCard key={user.id}>
							<div>
								<UserEmail>{user.email}</UserEmail>
								<div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
									Имя: {user.displayName || 'Не указано'} | Курсов:{' '}
									{user.totalCourses || 0} | Зарегистрирован:{' '}
									{user.createdAt
										? new Date(user.createdAt).toLocaleDateString('ru-RU')
										: 'нет даты'}
								</div>
							</div>

							{user.totalCourses > 0 ? (
								<CourseList>
									<h4 style={{ color: '#a0a0a0', marginBottom: '0.5rem' }}>
										Купленные курсы ({user.totalCourses}):
										{user.purchasedCourses.some(c => !c.isValid) && (
											<span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>
												(есть невалидные данные)
											</span>
										)}
									</h4>
									{user.purchasedCourses.map((course, index) => (
										<CourseItem key={`${course.id}-${index}`}>
											<CourseInfo>
												<CourseTitle>
													{course.title || `Курс #${course.id}`}
													{!course.isValid && (
														<span
															style={{
																color: '#ef4444',
																marginLeft: '0.5rem',
																fontSize: '0.8rem',
															}}
														>
															(невалидный)
														</span>
													)}
												</CourseTitle>
												<CourseId>
													ID: {course.id} | Категория: {course.category} |
													Длительность: {course.duration} | Куплен:{' '}
													{course.purchaseDate
														? new Date(course.purchaseDate).toLocaleDateString(
																'ru-RU'
														  )
														: 'нет даты'}{' '}
													| Цена: {course.price?.toLocaleString('ru-RU') || '0'}{' '}
													₽ | Прогресс: {course.progress || 0}%
												</CourseId>
											</CourseInfo>
											<DeleteButton
												onClick={() =>
													handleDeleteCourse(
														user.id,
														course.id,
														course.title || `Курс ${course.id}`
													)
												}
												disabled={deletingCourse === `${user.id}-${course.id}`}
											>
												{deletingCourse === `${user.id}-${course.id}`
													? 'Удаление...'
													: ' Удалить'}
											</DeleteButton>
										</CourseItem>
									))}
								</CourseList>
							) : (
								<NoCoursesMessage>
									У пользователя нет купленных курсов
								</NoCoursesMessage>
							)}
						</UserCard>
					))}
				</div>
			)}
		</AdminContainer>
	)
}

export default AdminPanel
