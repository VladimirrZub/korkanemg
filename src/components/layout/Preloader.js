import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

const orbit = keyframes`
  0% { 
    transform: rotate(0deg) translateX(40px) rotate(0deg);
  }
  100% { 
    transform: rotate(360deg) translateX(40px) rotate(-360deg);
  }
`;

const textGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  }
  50% { 
    text-shadow: 0 0 30px rgba(99, 102, 241, 0.8);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    visibility: visible;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const progressBar = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  } 
`;

const PreloaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeOut} 0.5s ease-in-out 2.5s forwards;
`;

const PreloaderContent = styled.div`
  text-align: center;
  position: relative;
`;

const LogoOrb = styled.div`
  width: 120px;
  height: 120px;
  background: radial-gradient(circle at 30% 30%, #6366F1, transparent 50%),
              radial-gradient(circle at 70% 70%, #8B5CF6, transparent 50%);
  border-radius: 50%;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 
    inset 0 0 50px rgba(99, 102, 241, 0.3),
    0 0 80px rgba(99, 102, 241, 0.2);
  position: relative;
`;

const OrbitingDot = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${orbit} 3s linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  &:nth-child(1) { animation-duration: 2s; }
  &:nth-child(2) { animation-duration: 2.5s; animation-delay: -1s; }
  &:nth-child(3) { animation-duration: 3s; animation-delay: -0.5s; }
`;

const LogoText = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${textGlow} 2s ease-in-out infinite;
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6366F1, #8B5CF6);
  border-radius: 2px;
  animation: ${progressBar} 2.5s ease-in-out forwards;
`;




const Preloader = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      if (onLoaded) {
        onLoaded();
      }
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onLoaded]);

  return (
    <PreloaderContainer>
      <PreloaderContent>
        <LogoOrb>
          <OrbitingDot />
          <OrbitingDot />
          <OrbitingDot />
        </LogoOrb>
        
        <LogoText>Корочки.есть</LogoText>
        
        <ProgressBar>
          <ProgressFill style={{ width: `${progress}%` }} />
        </ProgressBar>
        
       
      </PreloaderContent>
    </PreloaderContainer>
  );
};

export default Preloader;