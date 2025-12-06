import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

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


const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(90deg); }
  50% { transform: translate(-5px, -25px) rotate(180deg); }
  75% { transform: translate(-15px, -10px) rotate(270deg); }
`;


const ParticlesBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled.div`
  position: fixed;
  width: ${props => props.size || '4px'};
  height: ${props => props.size || '4px'};
  background: rgba(99, 102, 241, ${props => props.opacity || '0.6'});
  border-radius: 50%;
  animation: ${particleFloat} ${props => props.duration || '20s'} linear infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation-delay: ${props => props.delay || '0s'};
`;



const ReviewsContainer = styled.div`
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

const StatsSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideUp} 0.8s ease-out 0.2s both;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled.div`
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #6366F1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  color: #a0a0a0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const FiltersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  animation: ${slideUp} 0.8s ease-out 0.4s both;
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

const ReviewsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const ReviewCard = styled.div`
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
  position: relative;
  overflow: hidden;

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
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;


const ReviewerInfo = styled.div`
  flex: 1;
  
  h3 {
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .course {
    color: #6366F1;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .date {
    color: #666;
    font-size: 0.9rem;
  }
`;

const Rating = styled.div`
  display: flex;
  gap: 0.2rem;
  
  .star {
    color: #F59E0B;
    font-size: 1.2rem;
  }
`;

const ReviewText = styled.p`
  color: #a0a0a0;
  line-height: 1.6;
  font-style: italic;
  font-size: 1.1rem;
`;

const AddReviewSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 3rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideUp} 0.8s ease-out 0.6s both;
  
  h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #a0a0a0;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const AddReviewButton = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  }
`;




const generateParticles = () => {
  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: `${Math.random() * 3 + 2}px`,
      opacity: Math.random() * 0.4 + 0.3,
      duration: `${Math.random() * 15 + 10}s`,
      delay: `${Math.random() * 5}s`
    });
  }
  return particles;
};
const Particles = React.memo(() => {
  const particles = useMemo(() => generateParticles(), []);
  
  return (
    <ParticlesBackground>
      {particles.map(particle => (
        <Particle key={particle.id} {...particle} />
      ))}
    </ParticlesBackground>
  );
});


const Reviews = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = ['Все', 'Программирование', 'Дизайн', 'Маркетинг', 'Менеджмент'];

  const reviews = [
    {
      id: 1,
      name: 'Анна Козлова',
      course: 'Fullstack JavaScript',
      category: 'Программирование',
      rating: 5,
      date: '15.12.2024',
      text: 'Прошел курс Fullstack JavaScript и уже через 2 месяца нашел работу джуном! Преподаватели - настоящие профессионалы, много практики и поддержки.'
    },
    {
      id: 2,
      name: 'Дмитрий Соколов',
      course: 'UX/UI Дизайн',
      category: 'Дизайн',
      rating: 5,
      date: '10.12.2024',
      text: 'Отличный курс для начинающих дизайнеров. Все очень структурированно, много реальных кейсов. Преподаватель всегда на связи и помогает.'
    },
    {
      id: 3,
      name: 'Мария Иванова',
      course: 'Digital Marketing',
      category: 'Маркетинг',
      rating: 4,
      date: '05.12.2024',
      text: 'Очень полезный курс, много практических инструментов. Немного не хватило времени на некоторые темы, но в целом очень довольна.'
    },
    {
      id: 4,
      name: 'Сергей Петров',
      course: 'Python для анализа данных',
      category: 'Программирование',
      rating: 5,
      date: '28.11.2024',
      text: 'Курс превзошел ожидания! Отличный баланс теории и практики. Теперь уверенно работаю с данными и даже автоматизировал процессы на работе.'
    },
    {
      id: 5,
      name: 'Елена Морозова',
      course: 'Project Management',
      category: 'Менеджмент',
      rating: 5,
      date: '20.11.2024',
      text: 'Идеальный курс для систематизации знаний в управлении проектами. Очень пригодились шаблоны документов и методики планирования.'
    },
    {
      id: 6,
      name: 'Алексей Кузнецов',
      course: 'Веб-разработка',
      category: 'Программирование',
      rating: 4,
      date: '15.11.2024',
      text: 'Хороший интенсивный курс. Много практики, интересные проекты. Преподаватель всегда помогает с сложными моментами. Рекомендую!'
    }
  ];

  const filteredReviews = selectedCategory === 'Все' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <ReviewsContainer>
      
      <Particles />
      <PageHeader>
        <h1>Отзывы студентов</h1>
        <p>Узнайте, что говорят выпускники о наших курсах и их опыте обучения</p>
      </PageHeader>

      <StatsSection>
        <StatsGrid>
          <StatItem delay="0s">
            <StatNumber>4.9/5</StatNumber>
            <StatLabel>Средняя оценка</StatLabel>
          </StatItem>
          <StatItem delay="0.1s">
            <StatNumber>2,500+</StatNumber>
            <StatLabel>Отзывов</StatLabel>
          </StatItem>
          <StatItem delay="0.2s">
            <StatNumber>95%</StatNumber>
            <StatLabel>Рекомендуют нас</StatLabel>
          </StatItem>
          <StatItem delay="0.3s">
            <StatNumber>10,000+</StatNumber>
            <StatLabel>Выпускников</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <FiltersSection>
        <CategoryFilters>
          {categories.map((category, index) => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryFilters>
      </FiltersSection>

      <ReviewsGrid>
        {filteredReviews.map((review, index) => (
          <ReviewCard key={review.id} delay={`${0.6 + index * 0.1}s`}>
            <ReviewHeader>
              <ReviewerInfo>
                <h3>{review.name}</h3>
                <div className="course">{review.course}</div>
                <div className="date">{review.date}</div>
              </ReviewerInfo>
              <Rating>
                <div className="star">{renderStars(review.rating)}</div>
              </Rating>
            </ReviewHeader>
            <ReviewText>"{review.text}"</ReviewText>
          </ReviewCard>
        ))}
      </ReviewsGrid>

      <AddReviewSection>
        <h2>Поделитесь своим опытом</h2>
        <p>
          Расскажите о своих впечатлениях от обучения и помогите другим 
          сделать правильный выбор
        </p>
        <AddReviewButton>
          Оставить отзыв
        </AddReviewButton>
      </AddReviewSection>
    </ReviewsContainer>
  );
};

export default Reviews;