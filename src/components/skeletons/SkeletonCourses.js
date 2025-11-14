import React from 'react';
import styled, { keyframes } from 'styled-components';
import SkeletonCourseGrid from './SkeletonCourseGrid';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  padding: 2rem;
  padding-top: 100px;
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

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SkeletonTitle = styled(SkeletonItem)`
  height: 70px;
  width: 400px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 50px;
  }
`;

const SkeletonSubtitle = styled(SkeletonItem)`
  height: 24px;
  width: 500px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const ControlsSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
`;

const SkeletonSearch = styled(SkeletonItem)`
  height: 54px;
  width: 500px;
  margin: 0 auto 2rem;
  border-radius: 50px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SkeletonFilters = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SkeletonFilter = styled(SkeletonItem)`
  height: 40px;
  width: 120px;
  border-radius: 25px;
`;

const ResultsInfo = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
`;

const SkeletonInfo = styled(SkeletonItem)`
  height: 20px;
  width: 200px;
`;

const SkeletonCourses = () => {
  return (
    <Container>
      <PageHeader>
        <SkeletonTitle />
        <SkeletonSubtitle />
      </PageHeader>

      <ControlsSection>
        <SkeletonSearch />
        <SkeletonFilters>
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonFilter key={index} />
          ))}
        </SkeletonFilters>
      </ControlsSection>

      <ResultsInfo>
        <SkeletonInfo />
        <SkeletonInfo />
      </ResultsInfo>

      <SkeletonCourseGrid count={9} />
    </Container>
  );
};

export default SkeletonCourses;