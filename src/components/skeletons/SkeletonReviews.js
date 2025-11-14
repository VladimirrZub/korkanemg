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

const StatsSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const SkeletonStatCard = styled.div`
  text-align: center;
`;

const SkeletonStatNumber = styled(SkeletonItem)`
  height: 48px;
  width: 120px;
  margin: 0 auto 0.5rem;
`;

const SkeletonStatLabel = styled(SkeletonItem)`
  height: 20px;
  width: 100px;
  margin: 0 auto;
`;

const FiltersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
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

const ReviewsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const SkeletonReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SkeletonAvatar = styled(SkeletonItem)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ReviewerInfo = styled.div`
  flex: 1;
`;

const SkeletonName = styled(SkeletonItem)`
  height: 20px;
  width: 150px;
  margin-bottom: 0.5rem;
`;

const SkeletonCourse = styled(SkeletonItem)`
  height: 16px;
  width: 120px;
  margin-bottom: 0.25rem;
`;

const SkeletonDate = styled(SkeletonItem)`
  height: 14px;
  width: 80px;
`;

const SkeletonRating = styled(SkeletonItem)`
  height: 20px;
  width: 100px;
`;

const SkeletonReviewText = styled(SkeletonItem)`
  height: 16px;
  width: 100%;
  margin-bottom: 0.5rem;
  
  &:nth-child(2) {
    width: 95%;
  }
  
  &:nth-child(3) {
    width: 90%;
  }
`;

const AddReviewSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonAddReviewTitle = styled(SkeletonItem)`
  height: 32px;
  width: 300px;
  margin: 0 auto 1rem;
`;

const SkeletonAddReviewText = styled(SkeletonItem)`
  height: 20px;
  width: 400px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const SkeletonButton = styled(SkeletonItem)`
  height: 54px;
  width: 200px;
  margin: 0 auto;
  border-radius: 25px;
`;

const SkeletonReviews = () => {
  return (
    <Container>
      <PageHeader>
        <SkeletonTitle />
        <SkeletonSubtitle />
      </PageHeader>

      <StatsSection>
        <StatsGrid>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonStatCard key={index}>
              <SkeletonStatNumber />
              <SkeletonStatLabel />
            </SkeletonStatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <FiltersSection>
        <SkeletonFilters>
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonFilter key={index} />
          ))}
        </SkeletonFilters>
      </FiltersSection>

      <ReviewsGrid>
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonReviewCard key={index}>
            <ReviewHeader>
              <SkeletonAvatar />
              <ReviewerInfo>
                <SkeletonName />
                <SkeletonCourse />
                <SkeletonDate />
              </ReviewerInfo>
              <SkeletonRating />
            </ReviewHeader>
            <SkeletonReviewText />
            <SkeletonReviewText />
            <SkeletonReviewText />
          </SkeletonReviewCard>
        ))}
      </ReviewsGrid>

      <AddReviewSection>
        <SkeletonAddReviewTitle />
        <SkeletonAddReviewText />
        <SkeletonButton />
      </AddReviewSection>
    </Container>
  );
};

export default SkeletonReviews;