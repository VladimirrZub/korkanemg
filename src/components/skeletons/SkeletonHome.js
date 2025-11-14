import React from 'react';
import styled from 'styled-components';
import SkeletonHero from './SkeletonHero';
import SkeletonStats from './SkeletonStats';
import SkeletonCourseGrid from './SkeletonCourseGrid';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
`;

const FeaturesSection = styled.div`
  padding: 8rem 2rem;
`;

const SectionTitle = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
  text-align: center;
`;

const SkeletonHome = () => {
  return (
    <Container>
      <SkeletonHero />
      <SkeletonStats />
      <FeaturesSection>
        <SectionTitle>
          <SkeletonCourseGrid count={3} />
        </SectionTitle>
      </FeaturesSection>
    </Container>
  );
};

export default SkeletonHome;