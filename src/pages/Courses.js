import React, { useState, useMemo, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { LoadMoreLoader } from '../components/common/Loader'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(90deg); }
  50% { transform: translate(-5px, -25px) rotate(180deg); }
  75% { transform: translate(-15px, -10px) rotate(270deg); }
`

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
  }
`

const PaymentModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.9);
	backdrop-filter: blur(15px);
	display: ${props => (props.$isOpen ? 'flex' : 'none')};
	align-items: center;
	justify-content: center;
	z-index: 9999;
	animation: ${fadeIn} 0.3s ease-out;
	padding: 2rem;
`

const PaymentModal = styled.div`
	background: rgba(20, 20, 20, 0.95);
	backdrop-filter: blur(25px);
	border-radius: 30px;
	padding: 3rem;
	width: 100%;
	max-width: 700px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 30px 100px rgba(0, 0, 0, 0.6),
		inset 0 1px 0 rgba(255, 255, 255, 0.1);
	position: relative;
	overflow: hidden;
	animation: ${scaleIn} 0.4s ease-out;
	z-index: 10000;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #6366f1, #8b5cf6);
	}
`

const ModalContent = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 3rem;
	align-items: start;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 2rem;
	}
`

const LeftColumn = styled.div`
	padding-right: 1.5rem;
	border-right: 1px solid rgba(255, 255, 255, 0.1);

	@media (max-width: 768px) {
		padding-right: 0;
		border-right: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 2rem;
	}
`

const RightColumn = styled.div`
	padding-left: 1.5rem;

	@media (max-width: 768px) {
		padding-left: 0;
	}
`

const CourseInfoSidebar = styled.div`
	text-align: left;
	margin-bottom: 2rem;
`

const CourseTitleSidebar = styled.h2`
	font-size: 1.8rem;
	font-weight: 800;
	color: white;
	margin-bottom: 1rem;
	line-height: 1.3;
`

const CourseCategorySidebar = styled.div`
	display: inline-block;
	background: rgba(99, 102, 241, 0.1);
	color: #6366f1;
	padding: 0.5rem 1rem;
	border-radius: 12px;
	font-size: 0.9rem;
	font-weight: 600;
	margin-bottom: 1.5rem;
	border: 1px solid rgba(99, 102, 241, 0.3);
`

const PriceDisplay = styled.div`
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const CurrentPrice = styled.div`
	font-size: 2.5rem;
	font-weight: 800;
	color: #6366f1;
	margin-bottom: 0.5rem;
`

const OriginalPrice = styled.div`
	font-size: 1.2rem;
	color: #666;
	text-decoration: line-through;
	margin-bottom: 0.5rem;
`

const DiscountBadge = styled.div`
	background: #f59e0b;
	color: #000;
	padding: 0.4rem 0.8rem;
	border-radius: 8px;
	font-size: 0.9rem;
	font-weight: 700;
	display: inline-block;
`

const ModalHeaderCompact = styled.div`
	text-align: center;
	margin-bottom: 2rem;
	grid-column: 1 / -1;
`

const ModalTitleCompact = styled.h2`
	font-size: 2rem;
	font-weight: 800;
	background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 0.5rem;
`

const CloseButton = styled.button`
	position: absolute;
	top: 20px;
	right: 20px;
	background: rgba(255, 255, 255, 0.1);
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	color: white;
	font-size: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	z-index: 10;

	&:hover {
		background: rgba(99, 102, 241, 0.3);
	}
`

const ModalSubtitle = styled.p`
	color: #a0a0a0;
	font-size: 1.1rem;
`

const CoursePrice = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;

	.current {
		font-size: 1.8rem;
		font-weight: 800;
		color: #6366f1;
		margin-bottom: 0.5rem;
	}

	.original {
		font-size: 1.2rem;
		color: #666;
		text-decoration: line-through;
		margin-bottom: 0.5rem;
	}

	.discount {
		background: #f59e0b;
		color: #000;
		padding: 0.3rem 0.6rem;
		border-radius: 10px;
		font-size: 0.8rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}
`

const PaymentMethods = styled.div`
	margin-bottom: 2rem;
`

const PaymentMethod = styled.div`
	background: rgba(255, 255, 255, 0.05);
	border: 2px solid
		${props => (props.$selected ? '#6366F1' : 'rgba(255, 255, 255, 0.1)')};
	border-radius: 15px;
	padding: 1.2rem;
	margin-bottom: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 1rem;

	&:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(99, 102, 241, 0.5);
	}

	&:last-child {
		margin-bottom: 0;
	}
`

const MethodInfo = styled.div`
	flex: 1;

	h4 {
		color: white;
		font-size: 1.1rem;
		margin-bottom: 0.3rem;
	}

	p {
		color: #a0a0a0;
		font-size: 0.9rem;
		line-height: 1.4;
	}
`

const PaymentForm = styled.div`
	margin-bottom: 2rem;
`

const FormGroup = styled.div`
	margin-bottom: 1.5rem;

	&:last-child {
		margin-bottom: 0;
	}
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
	padding: 1.2rem 1.5rem;
	background: rgba(255, 255, 255, 0.05);
	border: 2px solid rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	color: white;
	font-size: 1.1rem;
	transition: all 0.3s ease;
	outline: none;

	&:focus {
		border-color: #6366f1;
		background: rgba(99, 102, 241, 0.05);
		animation: ${glow} 2s infinite;
	}

	&::placeholder {
		color: #666;
	}
`

const PhoneInputContainer = styled.div`
	position: relative;

	.country-code {
		position: absolute;
		left: 15px;
		top: 50%;
		transform: translateY(-50%);
		color: #a0a0a0;
		font-weight: 600;
	}

	input {
		padding-left: 20px;
	}
`

const SubmitButton = styled.button`
	width: 100%;
	padding: 1.3rem;
	background: ${props =>
		props.$isCash
			? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
			: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'};
	border: none;
	border-radius: 15px;
	color: white;
	font-weight: 700;
	font-size: 1.2rem;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.8rem;
	margin-top: 1rem;

	&:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}
`

const SuccessMessage = styled.div`
	background: rgba(16, 185, 129, 0.1);
	border: 1px solid rgba(16, 185, 129, 0.3);
	border-radius: 15px;
	padding: 1.5rem;
	text-align: center;
	margin-bottom: 1.5rem;

	h4 {
		color: #10b981;
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	p {
		color: #a0a0a0;
		font-size: 0.95rem;
		line-height: 1.4;
	}
`

const CoursesContainer = styled.div`
	min-height: 100vh;
	background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
	padding: 2rem;
	padding-top: 120px;
	z-index: 2;
`

const PageHeader = styled.div`
	text-align: center;
	margin-bottom: 4rem;
	animation: ${slideUp} 0.8s ease-out;

	h1 {
		font-size: 3.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	p {
		font-size: 1.3rem;
		color: #a0a0a0;
		max-width: 600px;
		margin: 0 auto;
	}
`

const ControlsSection = styled.div`
	max-width: 1200px;
	margin: 0 auto 3rem;
	animation: ${slideUp} 0.8s ease-out 0.2s both;
	z-index: 2;
`

const SearchBox = styled.div`
	position: relative;
	max-width: 500px;
	margin: 0 auto 2rem;

	input {
		width: 100%;
		padding: 1.2rem 1.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 50px;
		color: white;
		font-size: 1.1rem;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;

		&::placeholder {
			color: #666;
		}

		&:focus {
			outline: none;
			border-color: #6366f1;
			background: rgba(255, 255, 255, 0.08);
			box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
		}
	}
`

const CategoryFilters = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
`

const CategoryButton = styled.button`
	padding: 0.8rem 1.5rem;
	background: ${props =>
		props.active
			? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
			: 'rgba(255, 255, 255, 0.05)'};
	border: 2px solid
		${props => (props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)')};
	border-radius: 25px;
	color: ${props => (props.active ? 'white' : '#a0a0a0')};
	font-weight: 600;
	transition: all 0.3s ease;
	backdrop-filter: blur(10px);

	&:hover {
		transform: translateY(-2px);
		${props =>
			!props.active &&
			`
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(99, 102, 241, 0.3);
    `}
	}
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
	position: fixed;
	width: ${props => props.size || '4px'};
	height: ${props => props.size || '4px'};
	background: rgba(99, 102, 241, ${props => props.opacity || '0.6'});
	border-radius: 50%;
	animation: ${particleFloat} ${props => props.duration || '20s'} linear
		infinite;
	top: ${props => props.top}%;
	left: ${props => props.left}%;
	animation-delay: ${props => props.delay || '0s'};
	z-index: 1;
`

const ResultsInfo = styled.div`
	max-width: 1200px;
	margin: 0 auto 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #a0a0a0;
	animation: ${slideUp} 0.8s ease-out 0.4s both;

	.count {
		font-size: 1.1rem;

		.highlight {
			color: #6366f1;
			font-weight: 700;
		}
	}
`

const CoursesGrid = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
	gap: 2rem;
	margin-bottom: 3rem;
	z-index: 2;
	align-items: stretch;
`
const CourseCard = styled.div`
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 20px;
	overflow: hidden;
	backdrop-filter: blur(10px);
	transition: all 0.3s ease;
	animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	height: 100%;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(99, 102, 241, 0.1),
			transparent
		);
		transition: left 0.6s ease;
	}

	&:hover {
		transform: translateY(-10px);
		border-color: rgba(99, 102, 241, 0.3);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

		&::before {
			left: 100%;
		}
	}
`
const CourseContent = styled.div`
	padding: 1.5rem;
	flex: 1;
	display: flex;
	flex-direction: column;
`

const CourseCategory = styled.div`
	display: inline-block;
	background: rgba(255, 255, 255, 0.1);
	color: #6366f1;
	padding: 0.4rem 1rem;
	border-radius: 15px;
	font-size: 0.9rem;
	font-weight: 600;
	margin-bottom: 1rem;
	border: 1px solid rgba(99, 102, 241, 0.2);
`

const CourseTitle = styled.h3`
	font-size: 1.4rem;
	font-weight: 700;
	color: white;
	margin-bottom: 1rem;
	line-height: 1.3;
`

const CourseDescription = styled.p`
	color: #a0a0a0;
	line-height: 1.5;
	margin-bottom: 1.5rem;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	flex: 1;
	min-height: 48px;
`

const CourseMeta = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
	color: #a0a0a0;
	font-size: 0.9rem;

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
`

const EnrollButton = styled.button`
	width: 100%;
	padding: 1rem;
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
	border: none;
	border-radius: 15px;
	color: white;
	font-weight: 700;
	font-size: 1.1rem;
	transition: all 0.3s ease;
	margin-top: auto;
	min-height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
	}
`

const NoResults = styled.div`
	text-align: center;
	padding: 4rem 2rem;
	color: #a0a0a0;
	animation: ${slideUp} 0.8s ease-out;

	.icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	h3 {
		color: white;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}
`
const allCourses = [
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

const PaymentModalComponent = ({
	isOpen,
	onClose,
	course,
	onPurchaseSuccess,
}) => {
	// eslint-disable-next-line
	const { currentUser, purchaseCourse } = useAuth()
	const [selectedMethod, setSelectedMethod] = useState('phone')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (isOpen) {
			const scrollY = window.scrollY
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'
			document.body.style.overflow = 'hidden'

			return () => {
				document.body.style.position = ''
				document.body.style.top = ''
				document.body.style.width = ''
				document.body.style.overflow = ''
				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	const paymentMethods = [
		{
			id: 'phone',
			name: 'По номеру телефона',
			color: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
			description: 'Оплата через СМС или мобильный оператор',
		},
		{
			id: 'cash',
			name: 'Наличными',
			color: 'linear-gradient(135deg, #10b981, #34d399)',
			description: 'Оплата в офисе или курьеру',
		},
	]

	const formatPhoneNumber = value => {
		const numbers = value.replace(/\D/g, '')

		if (numbers.length === 0) return ''
		if (numbers.length <= 1) return `+7 (${numbers}`
		if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`
		if (numbers.length <= 7)
			return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`
		if (numbers.length <= 9)
			return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(
				4,
				7
			)}-${numbers.slice(7, 9)}`
		return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(
			7,
			9
		)}-${numbers.slice(9, 11)}`
	}

	const handlePayment = async () => {
		setIsProcessing(true)
		setError('')

		try {
			const result = await purchaseCourse(course.id.toString(), {
				title: course.title,
				price: course.price,
				category: course.category,
				description: course.description,
			})

			if (result.success) {
				setIsSuccess(true)

				setTimeout(() => {
					onClose()
					if (onPurchaseSuccess) {
						onPurchaseSuccess()
					}
				}, 2000)
			} else {
				setError(result.message || 'Ошибка при покупке курса')
			}
		} catch (error) {
			console.error('Ошибка покупки курса:', error)
			setError('Ошибка при покупке курса. Попробуйте еще раз.')
		} finally {
			setIsProcessing(false)
		}
	}

	if (!isOpen) return null

	const calculateDiscountN = (price, originalPrice) => {
		return Math.round((1 - price / originalPrice) * 100)
	}

	return (
		<PaymentModalOverlay $isOpen={isOpen} onClick={onClose}>
			<PaymentModal onClick={e => e.stopPropagation()}>
				<CloseButton onClick={onClose}>✕</CloseButton>

				{error && (
					<div
						style={{
							background: 'rgba(239, 68, 68, 0.1)',
							border: '1px solid rgba(239, 68, 68, 0.3)',
							borderRadius: '10px',
							padding: '1rem',
							marginBottom: '1rem',
							color: '#ef4444',
							textAlign: 'center',
						}}
					>
						{error}
					</div>
				)}

				{isSuccess ? (
					<>
						<ModalHeaderCompact>
							<ModalTitleCompact>Курс успешно приобретен!</ModalTitleCompact>
							<ModalSubtitle>Доступ к курсу открыт</ModalSubtitle>
						</ModalHeaderCompact>

						<SuccessMessage>
							<h4> Поздравляем!</h4>
							<p>
								Курс "{course?.title}" теперь доступен в вашем личном кабинете.
								Вы можете начать обучение прямо сейчас!
							</p>
						</SuccessMessage>

						<ModalContent>
							<LeftColumn>
								<CourseInfoSidebar>
									<CourseCategorySidebar>
										{course?.category || 'Программирование'}
									</CourseCategorySidebar>
									<CourseTitleSidebar>
										{course?.title || 'Название курса'}
									</CourseTitleSidebar>

									<PriceDisplay>
										<CurrentPrice>
											{course?.price?.toLocaleString() || '0'} ₽
										</CurrentPrice>
										{course?.originalPrice > course?.price && (
											<>
												<OriginalPrice>
													{course?.originalPrice?.toLocaleString() || '0'} ₽
												</OriginalPrice>
												<DiscountBadge>
													-
													{calculateDiscountN(
														course?.price || 0,
														course?.originalPrice || 0
													)}
													%
												</DiscountBadge>
											</>
										)}
									</PriceDisplay>
								</CourseInfoSidebar>
							</LeftColumn>

							<RightColumn>
								<p style={{ color: '#a0a0a0', marginBottom: '1rem' }}>
									Курс добавлен в ваш личный кабинет. Начните обучение прямо
									сейчас!
								</p>
							</RightColumn>
						</ModalContent>
					</>
				) : (
					<>
						<ModalHeaderCompact>
							<ModalTitleCompact>Оформление заявки</ModalTitleCompact>
							<ModalSubtitle>Выберите удобный способ оплаты</ModalSubtitle>
						</ModalHeaderCompact>

						<ModalContent>
							<LeftColumn>
								<CourseInfoSidebar>
									<CourseCategorySidebar>
										{course?.category || 'Программирование'}
									</CourseCategorySidebar>
									<CourseTitleSidebar>
										{course?.title || 'Название курса'}
									</CourseTitleSidebar>

									<PriceDisplay>
										<CurrentPrice>
											{course?.price?.toLocaleString() || '0'} ₽
										</CurrentPrice>
										{course?.originalPrice > course?.price && (
											<>
												<OriginalPrice>
													{course?.originalPrice?.toLocaleString() || '0'} ₽
												</OriginalPrice>
												<DiscountBadge>
													-
													{calculateDiscountN(
														course?.price || 0,
														course?.originalPrice || 0
													)}
													%
												</DiscountBadge>
											</>
										)}
									</PriceDisplay>
								</CourseInfoSidebar>
							</LeftColumn>

							<RightColumn>
								<PaymentMethods>
									<FormLabel>Способ оплаты</FormLabel>
									{paymentMethods.map(method => (
										<PaymentMethod
											key={method.id}
											$selected={selectedMethod === method.id}
											onClick={() => setSelectedMethod(method.id)}
										>
											<MethodInfo>
												<h4>{method.name}</h4>
												<p>{method.description}</p>
											</MethodInfo>
										</PaymentMethod>
									))}
								</PaymentMethods>

								{selectedMethod === 'phone' ? (
									<PaymentForm>
										<FormGroup>
											<FormLabel>Номер телефона</FormLabel>
											<PhoneInputContainer>
												<FormInput
													type='tel'
													placeholder='+7 (___) ___-__-__'
													value={phoneNumber}
													onChange={e =>
														setPhoneNumber(formatPhoneNumber(e.target.value))
													}
													maxLength='16'
												/>
											</PhoneInputContainer>
										</FormGroup>
									</PaymentForm>
								) : (
									<PaymentForm>
										<FormGroup>
											<FormLabel>Ваше имя</FormLabel>
											<FormInput type='text' placeholder='Иван Иванов' />
										</FormGroup>

										<FormGroup>
											<FormLabel>Номер телефона</FormLabel>
											<PhoneInputContainer>
												<FormInput
													type='tel'
													placeholder='+7 (___) ___-__-__'
													value={phoneNumber}
													onChange={e =>
														setPhoneNumber(formatPhoneNumber(e.target.value))
													}
													maxLength='16'
												/>
											</PhoneInputContainer>
										</FormGroup>
									</PaymentForm>
								)}

								<SubmitButton
									onClick={handlePayment}
									disabled={isProcessing}
									$isCash={selectedMethod === 'cash'}
								>
									{isProcessing ? (
										<>
											<span>Оформление покупки...</span>
											<div style={{ width: '20px', height: '20px' }}>
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
											</div>
										</>
									) : selectedMethod === 'phone' ? (
										'Купить курс'
									) : (
										'Оформить заявку'
									)}
								</SubmitButton>
							</RightColumn>
						</ModalContent>
					</>
				)}
			</PaymentModal>
		</PaymentModalOverlay>
	)
}

const Courses = () => {
	const { currentUser } = useAuth()
	const navigate = useNavigate()
	const [selectedCategory, setSelectedCategory] = useState('Все')
	const [searchQuery, setSearchQuery] = useState('')
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
	const [selectedCourse, setSelectedCourse] = useState(null)

	const categories = [
		'Все',
		'Программирование',
		'Дизайн',
		'Маркетинг',
		'Менеджмент',
		'Аналитика',
	]

	const filteredCourses = useMemo(() => {
		return allCourses.filter(course => {
			const matchesCategory =
				selectedCategory === 'Все' || course.category === selectedCategory
			const matchesSearch =
				course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.description.toLowerCase().includes(searchQuery.toLowerCase())
			return matchesCategory && matchesSearch
		})
	}, [selectedCategory, searchQuery])

	const {
		visibleItems: visibleCourses,
		loadMoreRef,
		loading,
		hasMore,
	} = useInfiniteScroll(filteredCourses, 6)

	const calculateDiscount = (price, originalPrice) => {
		return Math.round((1 - price / originalPrice) * 100)
	}

	const handleEnrollClick = course => {
		if (!currentUser) {
			navigate('/register')
			return
		}

		setSelectedCourse(course)
		setIsPaymentModalOpen(true)
	}

	const handlePurchaseSuccess = () => {
		console.log('Курс успешно куплен!')
	}

	return (
		<CoursesContainer>
			<Particles />
			<PageHeader>
				<h1>Все курсы</h1>
				<p>
					Выберите направление и начните свой путь в IT с лучшими экспертами
				</p>
			</PageHeader>

			<ControlsSection>
				<SearchBox>
					<input
						type='text'
						placeholder='Поиск курсов...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</SearchBox>

				<CategoryFilters>
					{categories.map((category, index) => (
						<CategoryButton
							key={category}
							active={selectedCategory === category}
							onClick={() => setSelectedCategory(category)}
							style={{ animationDelay: `${0.3 + index * 0.1}s` }}
						>
							{category}
						</CategoryButton>
					))}
				</CategoryFilters>
			</ControlsSection>

			<ResultsInfo>
				<div className='count'>
					Найдено:{' '}
					<span className='highlight'>{filteredCourses.length} курсов</span>
				</div>
			</ResultsInfo>

			{filteredCourses.length === 0 ? (
				<NoResults>
					<div className='icon'></div>
					<h3>Курсы не найдены</h3>
					<p>
						Попробуйте изменить параметры поиска или выбрать другую категорию
					</p>
				</NoResults>
			) : (
				<>
					<CoursesGrid>
						{visibleCourses.map((course, index) => (
							<CourseCard key={course.id} delay={`${0.5 + (index % 6) * 0.1}s`}>
								<CourseContent>
									<CourseCategory>{course.category}</CourseCategory>
									<CourseTitle>{course.title}</CourseTitle>
									<CourseDescription>{course.description}</CourseDescription>
									<CourseMeta>
										<div className='meta-item'>{course.duration}</div>
									</CourseMeta>

									<CoursePrice>
										<div className='current'>
											{course.price.toLocaleString()} ₽
										</div>
										{course.originalPrice > course.price && (
											<>
												<div className='original'>
													{course.originalPrice.toLocaleString()} ₽
												</div>
												<div className='discount'>
													-
													{calculateDiscount(
														course.price,
														course.originalPrice
													)}
													%
												</div>
											</>
										)}
									</CoursePrice>

									<EnrollButton onClick={() => handleEnrollClick(course)}>
										{currentUser
											? 'Купить курс'
											: 'Зарегистрироваться для покупки'}
									</EnrollButton>
								</CourseContent>
							</CourseCard>
						))}
					</CoursesGrid>

					{loading && <LoadMoreLoader />}
					{hasMore && !loading && (
						<div ref={loadMoreRef} style={{ height: '1px' }} />
					)}
				</>
			)}

			<PaymentModalComponent
				isOpen={isPaymentModalOpen}
				onClose={() => setIsPaymentModalOpen(false)}
				course={selectedCourse}
				onPurchaseSuccess={handlePurchaseSuccess}
			/>
		</CoursesContainer>
	)
}

export default Courses
