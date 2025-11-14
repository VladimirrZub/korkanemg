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

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  padding: 6rem 2rem;
`;

const SkeletonStatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  margin: 0 auto;
`;

const SkeletonIcon = styled(SkeletonItem)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const SkeletonNumber = styled(SkeletonItem)`
  width: 120px;
  height: 48px;
  margin-bottom: 0.5rem;
`;

const SkeletonLabel = styled(SkeletonItem)`
  width: 100px;
  height: 20px;
`;

const SkeletonStats = () => {
  return (
    <SkeletonContainer>
      {Array.from({ length: 4 }, (_, index) => (
        <SkeletonStatCard key={index}>
          <SkeletonIcon />
          <SkeletonNumber />
          <SkeletonLabel />
        </SkeletonStatCard>
      ))}
    </SkeletonContainer>
  );
};

export default SkeletonStats;