import React from 'react';
import styled from 'styled-components';

const SkeletonContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SkeletonCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;


const SkeletonTitle = styled.div`
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
`;

const SkeletonSubtitle = styled.div`
  height: 20px;
  width: 70%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  animation: pulse 1.5s ease-in-out infinite;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonInput = styled.div`
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin-bottom: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite;
`;

const SkeletonButton = styled.div`
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin-top: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
`;

const SkeletonRegister = () => {
  return (
    <SkeletonContainer>
      <SkeletonCard>
        <SkeletonHeader>
          <SkeletonTitle />
          <SkeletonSubtitle />
        </SkeletonHeader>
        <SkeletonRow>
          <SkeletonInput />
          <SkeletonInput />
        </SkeletonRow>
        <SkeletonInput />
        <SkeletonInput />
        <SkeletonInput />
        <SkeletonButton />
      </SkeletonCard>
    </SkeletonContainer>
  );
};

export default SkeletonRegister;