import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadMoreLoader } from '../components/common/Loader';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CoursesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  padding: 2rem;
  padding-top: 120px;
`;

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
`;

const ControlsSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  animation: ${slideUp} 0.8s ease-out 0.2s both;
`;

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
      border-color: #6366F1;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
    }
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 25px;
  color: ${props => props.active ? 'white' : '#a0a0a0'};
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-2px);
    ${props => !props.active && `
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(99, 102, 241, 0.3);
    `}
  }
`;

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
      color: #6366F1;
      font-weight: 700;
    }
  }
`;

const CoursesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CourseCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    
    &::before {
      left: 100%;
    }
    
    .course-image {
      transform: scale(1.05);
    }
  }
`;

const CourseImage = styled.div`
  height: 200px;
  background: ${props => {
    switch (props.category) {
      case 'Программирование': return `linear-gradient(135deg, #111827 0%, #6B7280 100%)`;
      case 'Дизайн': return `linear-gradient(135deg, #111827 0%, #6B7280 100%)`;
      case 'Маркетинг': return `linear-gradient(135deg, #111827 0%, #6B7280 100%)`;
      case 'Менеджмент': return `linear-gradient(135deg, #111827 0%, #6B7280 100%)`;
      case 'Аналитика': return `linear-gradient(135deg, #111827 0%, #6B7280 100%)`;
      default: return `linear-gradient(135deg, #111827 0%, #6B7280 100%)`;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0,0,0,0.1), transparent);
  }
`;

const CourseBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CourseContent = styled.div`
  padding: 1.5rem;
`;

const CourseCategory = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: #6366F1;
  padding: 0.4rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const CourseTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const CourseDescription = styled.p`
  color: #a0a0a0;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

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
`;

const CoursePrice = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .current {
    font-size: 1.8rem;
    font-weight: 800;
    color: #6366F1;
  }
  
  .original {
    font-size: 1.2rem;
    color: #666;
    text-decoration: line-through;
  }
  
  .discount {
    background: #F59E0B;
    color: #000;
    padding: 0.3rem 0.6rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 700;
  }
`;

const EnrollButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  }
`;

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
`;
const allCourses = [
  
  {
    id: 1,
    title: 'Веб-разработка на React',
    category: 'Программирование',
    description: 'Освойте современную фронтенд-разработку с использованием React, Redux и современных инструментов',
    duration: '3 месяца',
    students: 1250,
    price: 29900,
    originalPrice: 39900,
    level: 'Начальный'
  },
  {
    id: 2,
    title: 'Python для анализа данных',
    category: 'Программирование',
    description: 'Изучите Python и библиотеки для анализа данных: Pandas, NumPy, Matplotlib и Scikit-learn',
    duration: '4 месяца',
    students: 2100,
    price: 31900,
    originalPrice: 41900,
    level: 'Средний'
  },
  {
    id: 3,
    title: 'Мобильная разработка iOS',
    category: 'Программирование',
    description: 'Создание приложений для iOS на Swift с нуля до публикации в App Store',
    duration: '4 месяца',
    students: 630,
    price: 38900,
    originalPrice: 48900,
    level: 'Продвинутый'
  },
  {
    id: 4,
    title: 'Fullstack JavaScript',
    category: 'Программирование',
    description: 'Полный курс по JavaScript: от основ до создания полноценных веб-приложений',
    duration: '5 месяцев',
    students: 1800,
    price: 34900,
    originalPrice: 44900,
    level: 'Средний'
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
    level: 'Продвинутый'
  },
  {
    id: 6,
    title: 'Frontend с Vue.js',
    category: 'Программирование',
    description: 'Современная фронтенд-разработка с Vue 3, Composition API и экосистемой',
    duration: '3 месяца',
    students: 870,
    price: 27900,
    originalPrice: 37900,
    level: 'Начальный'
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
    level: 'Средний'
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
    level: 'Продвинутый'
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
    level: 'Начальный'
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
    level: 'Средний'
  },

 
  {
    id: 11,
    title: 'UX/UI Дизайн',
    category: 'Дизайн',
    description: 'Научитесь создавать интуитивные и красивые интерфейсы для веб и мобильных приложений',
    duration: '4 месяца',
    students: 890,
    price: 34900,
    originalPrice: 44900,
    level: 'Начальный'
  },
  {
    id: 12,
    title: 'Графический дизайн',
    category: 'Дизайн',
    description: 'Освойте Adobe Photoshop, Illustrator и создавайте профессиональные дизайны',
    duration: '3 месяца',
    students: 1250,
    price: 29900,
    originalPrice: 39900,
    level: 'Начальный'
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
    level: 'Средний'
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
    level: 'Продвинутый'
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
    level: 'Продвинутый'
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
    level: 'Средний'
  },

  
  {
    id: 17,
    title: 'Digital-маркетинг',
    category: 'Маркетинг',
    description: 'Полный курс по digital-маркетингу: SMM, контекстная реклама, SEO и аналитика',
    duration: '2 месяца',
    students: 1560,
    price: 25900,
    originalPrice: 35900,
    level: 'Средний'
  },
  {
    id: 18,
    title: 'SMM Продвижение',
    category: 'Маркетинг',
    description: 'Эффективное продвижение в социальных сетях: Instagram, VK, Telegram',
    duration: '2 месяца',
    students: 1340,
    price: 22900,
    originalPrice: 32900,
    level: 'Начальный'
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
    level: 'Средний'
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
    level: 'Начальный'
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
    level: 'Начальный'
  },
  {
    id: 22,
    title: 'Performance Marketing',
    category: 'Маркетинг',
    description: 'Работа с performance-каналами и оптимизация рекламных бюджетов',
    duration: '3 месяца',
    students: 430,
    price: 33900,
    originalPrice: 43900,
    level: 'Продвинутый'
  },

  {
    id: 23,
    title: 'Project Management',
    category: 'Менеджмент',
    description: 'Управление проектами по методологии Agile, Scrum и классическим подходам',
    duration: '2 месяца',
    students: 740,
    price: 27900,
    originalPrice: 37900,
    level: 'Средний'
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
    level: 'Продвинутый'
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
    level: 'Средний',
  
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
    level: 'Продвинутый'
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
    level: 'Средний'
  },
  {
    id: 28,
    title: 'Web Analytics',
    category: 'Аналитика',
    description: 'Настройка и анализ веб-метрик в Google Analytics и Яндекс.Метрика',
    duration: '2 месяца',
    students: 540,
    price: 26900,
    originalPrice: 36900,
    level: 'Начальный'
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
    level: 'Продвинутый'
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
    level: 'Продвинутый'
  }
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Все', 'Программирование', 'Дизайн', 'Маркетинг', 'Менеджмент', 'Аналитика'];

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesCategory = selectedCategory === 'Все' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const {
    visibleItems: visibleCourses,
    loadMoreRef,
    loading,
    hasMore,
    loadedCount,
    totalCount
  } = useInfiniteScroll(filteredCourses, 6);

  const calculateDiscount = (price, originalPrice) => {
    return Math.round((1 - price / originalPrice) * 100);
  };

  return (
    <CoursesContainer>
      <PageHeader>
        <h1>Все курсы</h1>
        <p>Выберите направление и начните свой путь в IT с лучшими экспертами</p>
      </PageHeader>

      <ControlsSection>
        <SearchBox>
          <input
            type="text"
            placeholder="Поиск курсов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="count">
          Найдено: <span className="highlight">{filteredCourses.length} курсов</span>
        </div>
        <div className="count">
          Показано: <span className="highlight">{loadedCount}</span> из {totalCount}
        </div>
      </ResultsInfo>

      {filteredCourses.length === 0 ? (
        <NoResults>
          <div className="icon"></div>
          <h3>Курсы не найдены</h3>
          <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
        </NoResults>
      ) : (
        <>
          <CoursesGrid>
            {visibleCourses.map((course, index) => (
              <CourseCard key={course.id} delay={`${0.5 + (index % 6) * 0.1}s`}>
                <CourseImage category={course.category}>
                  <CourseBadge>{course.level}</CourseBadge>
                </CourseImage>
                
                <CourseContent>
                  <CourseCategory>{course.category}</CourseCategory>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                  
                  <CourseMeta>
                    <div className="meta-item">
                      ⏱️ {course.duration}
                    </div>
                    <div className="meta-item">
                      👥 {course.students.toLocaleString()}
                    </div>
                  </CourseMeta>
                  
                  <CoursePrice>
                    <div className="current">{course.price.toLocaleString()} ₽</div>
                    {course.originalPrice > course.price && (
                      <>
                        <div className="original">{course.originalPrice.toLocaleString()} ₽</div>
                        <div className="discount">-{calculateDiscount(course.price, course.originalPrice)}%</div>
                      </>
                    )}
                  </CoursePrice>
                  
                  <EnrollButton>
                    Начать обучение 
                  </EnrollButton>
                </CourseContent>
              </CourseCard>
            ))}
          </CoursesGrid>

          {loading && <LoadMoreLoader />}
          {hasMore && !loading && <div ref={loadMoreRef} style={{ height: '1px' }} />}
          
          
        </>
      )}
    </CoursesContainer>
  );
};

export default Courses;