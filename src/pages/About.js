import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';




const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(90deg); }
  50% { transform: translate(-5px, -25px) rotate(180deg); }
  75% { transform: translate(-15px, -10px) rotate(270deg); }
`;

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


const AboutContainer = styled.div`
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

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto 4rem;
  animation: ${slideUp} 0.8s ease-out 0.2s both;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #6366F1, transparent);
  }
`;

const SectionText = styled.p`
  font-size: 1.2rem;
  color: #a0a0a0;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const MissionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;



const MissionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

const MissionDescription = styled.p`
  color: #a0a0a0;
  line-height: 1.6;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;



const TeamName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const TeamRole = styled.div`
  color: #6366F1;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const TeamBio = styled.p`
  color: #a0a0a0;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 3rem;
  margin: 4rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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


const StatLabel = styled.div`
  color: #a0a0a0;
  font-size: 1.1rem;
  font-weight: 600;
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


const About = () => {
  const missionItems = [
    {
      title: 'Инновации в образовании',
      description: 'Мы внедряем самые современные технологии и методики обучения',
      delay: '0s'
    },
    {
      title: 'Практические знания',
      description: 'Все курсы построены на реальных кейсах и практических заданиях',
      delay: '0.1s'
    },
    {
      title: 'Поддержка студентов',
      description: 'Каждому студенту обеспечиваем персональное сопровождение',
      delay: '0.2s'
    }
  ];

  const teamMembers = [
    {
      name: 'Анна Петрова',
      role: 'Основатель & CEO',
      bio: '15+ лет в IT-образовании, экс-руководитель образовательных программ',
      delay: '0s'
    },
    {
      name: 'Максим Иванов',
      role: 'CTO',
      bio: 'Fullstack разработчик с 10-летним опытом, эксперт в e-learning',
      delay: '0.1s'
    },
    {
      name: 'Елена Смирнова',
      role: 'Head of Education',
      bio: 'Педагог с 12-летним стажем, специалист по дистанционному обучению',
      delay: '0.2s'
    }
  ];

  const stats = [
    { number: '3', label: 'Года на рынке', delay: '0s' },
    { number: '50+', label: 'Преподавателей', delay: '0.1s' },
    { number: '95%', label: 'Успеваемости', delay: '0.2s' },
    { number: '24/7', label: 'Поддержка', delay: '0.3s' }
  ];

  return (
    <AboutContainer>
      
      <Particles />
      <PageHeader>
        <h1>О нашей платформе</h1>
        <p>Узнайте больше о миссии, ценностях и команде Корочки.есть</p>
      </PageHeader>

      <ContentSection>
        <SectionTitle>Наша миссия</SectionTitle>
        <SectionText>
          «Корочки.есть» — это инновационная образовательная платформа, созданная для того, 
          чтобы сделать качественное IT-образование доступным для каждого. Мы верим, что 
          современные технологии должны служить развитию человеческого потенциала.
        </SectionText>
        <SectionText>
          Наша цель — помочь людям освоить востребованные профессии, развить навыки 
          и построить успешную карьеру в digital-сфере, независимо от их начального уровня 
          и географического положения.
        </SectionText>

        <MissionGrid>
          {missionItems.map((item, index) => (
            <MissionCard key={index} delay={item.delay}>
              <MissionTitle>{item.title}</MissionTitle>
              <MissionDescription>{item.description}</MissionDescription>
            </MissionCard>
          ))}
        </MissionGrid>
      </ContentSection>

      <StatsSection>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem key={index} delay={stat.delay}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </StatsSection>

      <ContentSection>
        <SectionTitle>Наша команда</SectionTitle>
        <SectionText>
          Мы собрали команду профессионалов, которые горят своим делом и готовы 
          делиться знаниями с каждым студентом. Наши эксперты — практики с реальным 
          опытом работы в ведущих IT-компаниях.
        </SectionText>

        <TeamGrid>
          {teamMembers.map((member, index) => (
            <TeamCard key={index} delay={member.delay}>
              <TeamName>{member.name}</TeamName>
              <TeamRole>{member.role}</TeamRole>
              <TeamBio>{member.bio}</TeamBio>
            </TeamCard>
          ))}
        </TeamGrid>
      </ContentSection>
    </AboutContainer>
  );
};

export default About;