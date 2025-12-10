// utils/courseUtils.js
// Создайте этот файл для работы с курсами

// Локальный список всех курсов (должен совпадать с тем, что в pages/Courses.js)
export const allCoursesList = [
	{
		id: 1,
		title: 'Веб-разработка на React',
		category: 'Программирование',
		description:
			'Освойте современную фронтенд-разработку с использованием React, Redux и современных инструментов',
		duration: '3 месяца',
		students: 1250,
		price: 29900,
		originalPrice: 39900,
	},
	{
		id: 2,
		title: 'Python для анализа данных',
		category: 'Программирование',
		description:
			'Изучите Python и библиотеки для анализа данных: Pandas, NumPy, Matplotlib и Scikit-learn',
		duration: '4 месяца',
		students: 2100,
		price: 31900,
		originalPrice: 41900,
	},
	{
		id: 3,
		title: 'Мобильная разработка iOS',
		category: 'Программирование',
		description:
			'Создание приложений для iOS на Swift с нуля до публикации в App Store',
		duration: '4 месяца',
		students: 630,
		price: 38900,
		originalPrice: 48900,
	},
	{
		id: 4,
		title: 'Fullstack JavaScript',
		category: 'Программирование',
		description:
			'Полный курс по JavaScript: от основ до создания полноценных веб-приложений',
		duration: '5 месяцев',
		students: 1800,
		price: 34900,
		originalPrice: 44900,
	},
	{
		id: 5,
		title: 'Java для enterprise',
		category: 'Программирование',
		description: 'Разработка корпоративных приложений на Java Spring Framework',
		duration: '6 месяцев',
		students: 950,
		price: 41900,
		originalPrice: 51900,
	},
	{
		id: 6,
		title: 'Frontend с Vue.js',
		category: 'Программирование',
		description:
			'Современная фронтенд-разработка с Vue 3, Composition API и экосистемой',
		duration: '3 месяца',
		students: 870,
		price: 27900,
		originalPrice: 37900,
	},
	{
		id: 7,
		title: 'Backend с Node.js',
		category: 'Программирование',
		description: 'Создание серверных приложений на Node.js с Express и MongoDB',
		duration: '4 месяца',
		students: 1100,
		price: 32900,
		originalPrice: 42900,
	},
	{
		id: 8,
		title: 'DevOps и Docker',
		category: 'Программирование',
		description: 'Автоматизация развертывания и управление инфраструктурой',
		duration: '3 месяца',
		students: 720,
		price: 36900,
		originalPrice: 46900,
	},
	{
		id: 9,
		title: 'Тестирование ПО',
		category: 'Программирование',
		description: 'Автоматизированное тестирование веб и мобильных приложений',
		duration: '2 месяца',
		students: 540,
		price: 24900,
		originalPrice: 34900,
	},
	{
		id: 10,
		title: 'Game Development',
		category: 'Программирование',
		description: 'Разработка игр на Unity и C# для разных платформ',
		duration: '5 месяцев',
		students: 680,
		price: 38900,
		originalPrice: 48900,
	},
	{
		id: 11,
		title: 'UX/UI Дизайн',
		category: 'Дизайн',
		description:
			'Научитесь создавать интуитивные и красивые интерфейсы для веб и мобильных приложений',
		duration: '4 месяца',
		students: 890,
		price: 34900,
		originalPrice: 44900,
	},
	{
		id: 12,
		title: 'Графический дизайн',
		category: 'Дизайн',
		description:
			'Освойте Adobe Photoshop, Illustrator и создавайте профессиональные дизайны',
		duration: '3 месяца',
		students: 1250,
		price: 29900,
		originalPrice: 39900,
	},
	{
		id: 13,
		title: 'Motion Design',
		category: 'Дизайн',
		description: 'Создание анимации и визуальных эффектов в After Effects',
		duration: '4 месяца',
		students: 480,
		price: 37900,
		originalPrice: 47900,
	},
	{
		id: 14,
		title: '3D моделирование',
		category: 'Дизайн',
		description: 'Основы 3D моделирования в Blender для начинающих',
		duration: '5 месяцев',
		students: 320,
		price: 41900,
		originalPrice: 51900,
	},
	{
		id: 15,
		title: 'Product Design',
		category: 'Дизайн',
		description: 'Полный цикл проектирования digital-продуктов',
		duration: '6 месяцев',
		students: 290,
		price: 45900,
		originalPrice: 55900,
	},
	{
		id: 16,
		title: 'Бренд-дизайн',
		category: 'Дизайн',
		description: 'Создание айдентики и фирменного стиля для компаний',
		duration: '3 месяца',
		students: 410,
		price: 32900,
		originalPrice: 42900,
	},
	{
		id: 17,
		title: 'Digital-маркетинг',
		category: 'Маркетинг',
		description:
			'Полный курс по digital-маркетингу: SMM, контекстная реклама, SEO и аналитика',
		duration: '2 месяца',
		students: 1560,
		price: 25900,
		originalPrice: 35900,
	},
	{
		id: 18,
		title: 'SMM Продвижение',
		category: 'Маркетинг',
		description:
			'Эффективное продвижение в социальных сетях: Instagram, VK, Telegram',
		duration: '2 месяца',
		students: 1340,
		price: 22900,
		originalPrice: 32900,
	},
	{
		id: 19,
		title: 'SEO Оптимизация',
		category: 'Маркетинг',
		description: 'Продвижение сайтов в поисковых системах Яндекс и Google',
		duration: '3 месяца',
		students: 980,
		price: 28900,
		originalPrice: 38900,
	},
	{
		id: 20,
		title: 'Контент-маркетинг',
		category: 'Маркетинг',
		description: 'Создание и продвижение контента для привлечения клиентов',
		duration: '2 месяца',
		students: 760,
		price: 24900,
		originalPrice: 34900,
	},
	{
		id: 21,
		title: 'Email-маркетинг',
		category: 'Маркетинг',
		description: 'Автоматизация email-рассылок и повышение конверсии',
		duration: '1 месяц',
		students: 520,
		price: 19900,
		originalPrice: 29900,
	},
	{
		id: 22,
		title: 'Performance Marketing',
		category: 'Маркетинг',
		description:
			'Работа с performance-каналами и оптимизация рекламных бюджетов',
		duration: '3 месяца',
		students: 430,
		price: 33900,
		originalPrice: 43900,
	},
	{
		id: 23,
		title: 'Project Management',
		category: 'Менеджмент',
		description:
			'Управление проектами по методологии Agile, Scrum и классическим подходам',
		duration: '2 месяца',
		students: 740,
		price: 27900,
		originalPrice: 37900,
	},
	{
		id: 24,
		title: 'Product Management',
		category: 'Менеджмент',
		description: 'Управление digital-продуктами от идеи до запуска и развития',
		duration: '4 месяца',
		students: 380,
		price: 35900,
		originalPrice: 45900,
	},
	{
		id: 25,
		title: 'HR Management',
		category: 'Менеджмент',
		description: 'Современные подходы к управлению персоналом в IT-компаниях',
		duration: '3 месяца',
		students: 290,
		price: 29900,
		originalPrice: 39900,
	},
	{
		id: 26,
		title: 'Team Leadership',
		category: 'Менеджмент',
		description: 'Развитие лидерских качеств и управление командами разработки',
		duration: '2 месяца',
		students: 210,
		price: 31900,
		originalPrice: 41900,
	},
	{
		id: 27,
		title: 'Data Analytics',
		category: 'Аналитика',
		description: 'Анализ данных с помощью SQL, Python и визуализация в Tableau',
		duration: '4 месяца',
		students: 670,
		price: 34900,
		originalPrice: 44900,
	},
	{
		id: 28,
		title: 'Web Analytics',
		category: 'Аналитика',
		description:
			'Настройка и анализ веб-метрик в Google Analytics и Яндекс.Метрика',
		duration: '2 месяца',
		students: 540,
		price: 26900,
		originalPrice: 36900,
	},
	{
		id: 29,
		title: 'Business Intelligence',
		category: 'Аналитика',
		description: 'Построение систем бизнес-аналитики и дашбордов',
		duration: '3 месяца',
		students: 320,
		price: 38900,
		originalPrice: 48900,
	},
	{
		id: 30,
		title: 'Machine Learning Basics',
		category: 'Аналитика',
		description: 'Введение в машинное обучение для анализа данных',
		duration: '5 месяцев',
		students: 480,
		price: 41900,
		originalPrice: 51900,
	},
]
export function getCourseTitleById(courseId) {
	if (!courseId && courseId !== 0) {
		console.warn('⚠️ getCourseTitleById получил undefined/null курс ID')
		return 'Неизвестный курс'
	}

	const courseIdNum = parseInt(courseId)
	const course = allCoursesList.find(c => c.id === courseIdNum)

	if (!course) {
		console.warn(`⚠️ Курс с ID ${courseId} не найден в локальном списке`)
		return `Курс #${courseId}`
	}

	return course.title
}

// Функция для получения полной информации о курсе по ID
export function getCourseById(courseId) {
	if (!courseId && courseId !== 0) return null

	const courseIdNum = parseInt(courseId)
	return allCoursesList.find(c => c.id === courseIdNum)
}

// Функция для безопасного форматирования ID курса
export function formatCourseId(courseId) {
	if (courseId === undefined || courseId === null) {
		console.warn('⚠️ formatCourseId получил undefined/null')
		return 'undefined'
	}
	return String(courseId)
}

// Функция для валидации данных курса
export function validateCourseData(course) {
	if (!course) return false

	const requiredFields = ['id', 'title']
	for (const field of requiredFields) {
		if (!course[field]) {
			console.warn(`⚠️ Курс не имеет обязательного поля: ${field}`, course)
			return false
		}
	}

	return true
}
