import React from 'react';
import styled from 'styled-components';
import SkeletonCard from './SkeletonCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SkeletonCourseGrid = ({ count = 6 }) => {
  return (
    <Grid>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
};

export default SkeletonCourseGrid;