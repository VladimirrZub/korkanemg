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

const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div``;

const SectionTitle = styled(SkeletonItem)`
  height: 32px;
  width: 250px;
  margin-bottom: 2rem;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SkeletonContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonIcon = styled(SkeletonItem)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-top: 0.25rem;
`;

const ContactContent = styled.div`
  flex: 1;
`;

const SkeletonContactTitle = styled(SkeletonItem)`
  height: 20px;
  width: 120px;
  margin-bottom: 0.5rem;
`;

const SkeletonContactLine = styled(SkeletonItem)`
  height: 16px;
  width: 200px;
  margin-bottom: 0.25rem;
  
  &:nth-child(3) {
    width: 180px;
  }
`;

const ContactForm = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const SkeletonLabel = styled(SkeletonItem)`
  height: 20px;
  width: 80px;
  margin-bottom: 0.5rem;
`;

const SkeletonInput = styled(SkeletonItem)`
  height: 48px;
  width: 100%;
  border-radius: 10px;
`;

const SkeletonTextarea = styled(SkeletonItem)`
  height: 120px;
  width: 100%;
  border-radius: 10px;
`;

const SkeletonSelect = styled(SkeletonItem)`
  height: 48px;
  width: 100%;
  border-radius: 10px;
`;

const SkeletonSubmitButton = styled(SkeletonItem)`
  height: 54px;
  width: 100%;
  border-radius: 12px;
`;

const MapSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
`;

const SkeletonMap = styled(SkeletonItem)`
  height: 400px;
  width: 100%;
  border-radius: 20px;
`;

const FAQSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const SkeletonFAQItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonQuestion = styled(SkeletonItem)`
  height: 24px;
  width: 100%;
  margin-bottom: 1rem;
`;

const SkeletonAnswer = styled(SkeletonItem)`
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

const SkeletonContacts = () => {
  return (
    <Container>
      <PageHeader>
        <SkeletonTitle />
        <SkeletonSubtitle />
      </PageHeader>

      <ContentGrid>
        <ContactInfo>
          <SectionTitle />
          <ContactList>
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonContactItem key={index}>
                <SkeletonIcon />
                <ContactContent>
                  <SkeletonContactTitle />
                  <SkeletonContactLine />
                  <SkeletonContactLine />
                </ContactContent>
              </SkeletonContactItem>
            ))}
          </ContactList>
        </ContactInfo>

        <ContactForm>
          <SectionTitle />
          {Array.from({ length: 5 }, (_, index) => (
            <FormGroup key={index}>
              <SkeletonLabel />
              {index === 3 ? (
                <SkeletonSelect />
              ) : index === 4 ? (
                <SkeletonTextarea />
              ) : (
                <SkeletonInput />
              )}
            </FormGroup>
          ))}
          <SkeletonSubmitButton />
        </ContactForm>
      </ContentGrid>

      <MapSection>
        <SectionTitle />
        <SkeletonMap />
      </MapSection>

      <FAQSection>
        <SectionTitle />
        <FAQGrid>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonFAQItem key={index}>
              <SkeletonQuestion />
              <SkeletonAnswer />
              <SkeletonAnswer />
            </SkeletonFAQItem>
          ))}
        </FAQGrid>
      </FAQSection>
    </Container>
  );
};

export default SkeletonContacts;