import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  padding-top: 100px;
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

const SkeletonItem = styled.div`
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.05) 8%,
    rgba(255, 255, 255, 0.1) 18%,
    rgba(255, 255, 255, 0.05) 33%
  );
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

const TextContent = styled.div`
  animation: fadeIn 1s ease-out;
`;

const SkeletonTitle = styled(SkeletonItem)`
  height: 80px;
  width: 100%;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const SkeletonSubtitle = styled(SkeletonItem)`
  height: 24px;
  width: 80%;
  margin-bottom: 2.5rem;
`;

const SkeletonButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const SkeletonButton = styled(SkeletonItem)`
  height: 54px;
  width: 180px;
  border-radius: 50px;
`;

const VisualContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SkeletonOrb = styled(SkeletonItem)`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const SkeletonHero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <TextContent>
          <SkeletonTitle />
          <SkeletonSubtitle />
          <SkeletonButtons>
            <SkeletonButton />
            <SkeletonButton />
          </SkeletonButtons>
        </TextContent>
        <VisualContent>
          <SkeletonOrb />
        </VisualContent>
      </HeroContent>
    </HeroContainer>
  );
};

export default SkeletonHero;