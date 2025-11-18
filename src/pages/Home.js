import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(90deg); }
  50% { transform: translate(-5px, -25px) rotate(180deg); }
  75% { transform: translate(-15px, -10px) rotate(270deg); }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
  50% { text-shadow: 0 0 30px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4); }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
`;

const ParticlesBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(99, 102, 241, 0.6);
  border-radius: 50%;
  animation: ${particleFloat} ${props => props.duration || '20s'} linear infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation-delay: ${props => props.delay || '0s'};
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 2rem;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const TextContent = styled.div`
  animation: ${slideUp} 1s ease-out;
`;

const PreTitle = styled.div`
  font-size: 1.1rem;
  color: #6366F1;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::before {
    content: '';
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #6366F1, transparent);
  }
`;

const MainTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${textGlow} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #a0a0a0;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 500px;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;

  &.primary {
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    color: white;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-3px);
    }
  }

  .icon {
    font-size: 1.3rem;
    transition: transform 0.3s ease;
  }

  &:hover .icon {
    transform: translateX(5px);
  }
`;

const VisualContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${slideUp} 1s ease-out 0.3s both;
`;

const MainOrb = styled.div`
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at 30% 30%, #6366F1, transparent 50%),
              radial-gradient(circle at 70% 70%, #8B5CF6, transparent 50%);
  border-radius: 50%;
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
  box-shadow: 
    inset 0 0 50px rgba(99, 102, 241, 0.3),
    0 0 80px rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;


const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: rgba(10, 10, 10, 0.8);
  position: relative;
`;

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 4s ease-in-out infinite;
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

const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  position: relative;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${slideUp} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto 4rem;
  animation: ${slideUp} 0.8s ease-out 0.2s both;
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
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

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #a0a0a0;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const Home = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: `${20 + Math.random() * 20}s`,
      delay: `${Math.random() * 20}s`
    }));
    setParticles(newParticles);
  }, []);

  const stats = [
    { number: '10,000+', label: 'Выпускников', icon: '', delay: '0s' },
    { number: '150+', label: 'Курсов', icon: '', delay: '0.1s' },
    { number: '95%', label: 'Довольных студентов', icon: '', delay: '0.2s' },
    { number: '50+', label: 'Экспертов', icon: '', delay: '0.3s' }
  ];

  const features = [
    {
      icon: '',
      title: 'Инновационное обучение',
      description: 'Современные методики и технологии для максимальной эффективности образовательного процесса',
      delay: '0s'
    },
    {
      icon: '',
      title: 'Премиум качество',
      description: 'Только актуальные знания от практикующих экспертов с реальным опытом работы',
      delay: '0.1s'
    },
    {
      icon: '',
      title: 'Быстрый результат',
      description: 'Интенсивные программы, позволяющие быстро освоить новые навыки и начать применять их на практике',
      delay: '0.2s'
    }
  ];

  return (
    <HomeContainer>
      <ParticlesBackground>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            top={particle.top}
            left={particle.left}
            duration={particle.duration}
            delay={particle.delay}
          />
        ))}
      </ParticlesBackground>

      <HeroSection>
        <HeroContent>
          <TextContent>
            <PreTitle>Премиум образование</PreTitle>
            <MainTitle>
              Твой путь к
              <br />
              <span style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                профессии
              </span>
              <br />
              мечты
            </MainTitle>
            <Subtitle>
              Освойте востребованные навыки с помощью наших экспертных курсов. 
              Получите официальные документы и начните новую карьеру уже сегодня.
            </Subtitle>
            <CTAButtons>
              <CTAButton to="/courses" className="primary">
                <span>Начать обучение</span>
              </CTAButton>
              <CTAButton to="/about" className="secondary">
                <span>Узнать больше</span>
              </CTAButton>
            </CTAButtons>
          </TextContent>

          <VisualContent>
            <MainOrb>
            </MainOrb>
          </VisualContent>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index} delay={stat.delay}>
              <StatIcon>{stat.icon}</StatIcon>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <FeaturesSection>
        <SectionTitle>Почему выбирают нас</SectionTitle>
        <SectionSubtitle>
          Инновационный подход к образованию, который действительно работает
        </SectionSubtitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} delay={feature.delay}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;