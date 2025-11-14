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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
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
`;

const SkeletonImage = styled(SkeletonItem)`
  height: 200px;
  width: 100%;
`;

const SkeletonText = styled(SkeletonItem)`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.margin || '8px'};
`;

const SkeletonContent = styled.div`
  padding: 1.5rem;
`;

const SkeletonCard = () => {
  return (
    <SkeletonContainer>
      <SkeletonImage />
      <SkeletonContent>
        <SkeletonText width="40%" height="20px" margin="0 0 16px 0" />
        <SkeletonText height="24px" margin="0 0 12px 0" />
        <SkeletonText height="16px" margin="0 0 8px 0" />
        <SkeletonText height="16px" width="80%" margin="0 0 16px 0" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <SkeletonText width="30%" height="14px" />
          <SkeletonText width="30%" height="14px" />
        </div>
        <SkeletonText height="40px" margin="0" />
      </SkeletonContent>
    </SkeletonContainer>
  );
};

export default SkeletonCard;