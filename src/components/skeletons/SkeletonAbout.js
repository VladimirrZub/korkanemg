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
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SkeletonTitle = styled(SkeletonItem)`
  height: 70px;
  width: 500px;
  margin: 0 auto 1rem;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 50px;
  }
`;

const SkeletonSubtitle = styled(SkeletonItem)`
  height: 24px;
  width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 400px;
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
`;

const SkeletonText = styled(SkeletonItem)`
  height: 16px;
  width: 100%;
  margin-bottom: 1rem;
  
  &:nth-child(2) {
    width: 90%;
  }
  
  &:nth-child(3) {
    width: 95%;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SkeletonTeamCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonAvatar = styled(SkeletonItem)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1rem;
`;

const SkeletonName = styled(SkeletonItem)`
  height: 24px;
  width: 150px;
  margin: 0 auto 0.5rem;
`;

const SkeletonRole = styled(SkeletonItem)`
  height: 18px;
  width: 120px;
  margin: 0 auto 1rem;
`;

const SkeletonBio = styled(SkeletonItem)`
  height: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
  
  &:nth-child(2) {
    width: 90%;
  }
`;

const SkeletonAbout = () => {
  return (
    <Container>
      <PageHeader>
        <SkeletonTitle />
        <SkeletonSubtitle />
      </PageHeader>

      <ContentSection>
        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
        
        <TeamGrid>
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonTeamCard key={index}>
              <SkeletonAvatar />
              <SkeletonName />
              <SkeletonRole />
              <SkeletonBio />
              <SkeletonBio />
            </SkeletonTeamCard>
          ))}
        </TeamGrid>
      </ContentSection>
    </Container>
  );
};

export default SkeletonAbout;