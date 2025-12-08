import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(90deg); }
  50% { transform: translate(-5px, -25px) rotate(180deg); }
  75% { transform: translate(-15px, -10px) rotate(270deg); }
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

const InputFocus = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.4); }
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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
  position: absolute;
  width: ${props => props.size || '4px'};
  height: ${props => props.size || '4px'};
  background: rgba(99, 102, 241, ${props => props.opacity || '0.6'});
  border-radius: 50%;
  animation: ${particleFloat} ${props => props.duration || '20s'} linear infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation-delay: ${props => props.delay || '0s'};
`;

const AuthCard = styled.div`
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
  animation: ${slideUp} 0.8s ease-out;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6366F1, #8B5CF6);
    animation: ${InputFocus} 1.5s ease-out;
  }
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;


const AuthTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;


const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  color: #e0e0e0;
  font-weight: 600;
  font-size: 1rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1.2rem 3.5rem 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #6366F1;
    background: rgba(99, 102, 241, 0.05);
    animation: ${glow} 2s infinite;
  }

  &::placeholder {
    color: #666;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 52%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  width: 36px;
  height: 36px;

  &:hover {
    color: #6366F1;
    background: rgba(99, 102, 241, 0.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const SubmitButton = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #a0a0a0;
  font-size: 0.95rem;
`;

const AuthLink = styled(Link)`
  color: #6366F1;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #8B5CF6;
    text-decoration: underline;
  }
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  color: #a0a0a0;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #6366F1;
  }
`;

const EyeIcon = ({ show }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      </>
    )}
  </svg>
);


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

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Вход выполнен успешно!');
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <AuthContainer>
      <Particles />
      
      <AuthCard>
        <AuthHeader>
          <AuthTitle>Вход</AuthTitle>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput 
              type="email" 
              placeholder="your@email.com" 
              required 
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Пароль</FormLabel>
            <FormInput 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
            />
            <PasswordToggle 
              type="button" 
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <EyeIcon show={showPassword} />
            </PasswordToggle>
            <ForgotPassword to="/forgot-password">
              Забыли пароль?
            </ForgotPassword>
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                  <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                    <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
                  </path>
                </svg>
                Вход...
              </>
            ) : (
              'Войти в аккаунт'
            )}
          </SubmitButton>

          <AuthFooter>
            Нет аккаунта?
            <AuthLink to="/register">Зарегистрироваться</AuthLink>
          </AuthFooter>
        </AuthForm>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;