import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Spinner = styled.div`
  border: 3px solid ${props => props.theme.colors.background};
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadMoreIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  
  .dot-flashing {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    animation: dotFlashing 1s infinite linear alternate;
    animation-delay: 0.5s;
    margin: 0 auto 1rem;
  }
  
  .dot-flashing::before, .dot-flashing::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }
  
  .dot-flashing::before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
  }
  
  .dot-flashing::after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
  }
  
  @keyframes dotFlashing {
    0% {
      background-color: ${props => props.theme.colors.primary};
    }
    50%, 100% {
      background-color: ${props => props.theme.colors.background};
    }
  }
`;

export const Loader = () => (
  <LoaderContainer>
    <Spinner />
    <div>Загрузка...</div>
  </LoaderContainer>
);

export const LoadMoreLoader = () => (
  <LoadMoreIndicator>
    <div className="dot-flashing"></div>
    <div>Загружаем еще курсы...</div>
  </LoadMoreIndicator>
);