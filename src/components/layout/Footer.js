import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  padding: 4rem 2rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: white;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, #6366F1, transparent);
    }
  }
  
  p {
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  a {
    color: #a0a0a0;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      color: #6366F1;
      transform: translateX(5px);
    }
  }
`;



const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #a0a0a0;
    
    .icon {
      font-size: 1.2rem;
      color: #6366F1;
    }
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  margin-bottom: 1.5rem;
`;



const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  
  .main {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #6366F1 0%, #FFFFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    font-size: 0.6rem;
    color: #a0a0a0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo to="/">
            <LogoText>
              <div className="main">Корочки.есть</div>
            </LogoText>
          </Logo>
          <p>
            Ведущая платформа дополнительного профессионального образования. 
            Помогаем освоить востребованные навыки и построить успешную карьеру в IT.
          </p>
        </FooterSection>

        <FooterSection>
          <h3>Курсы</h3>
          <FooterLinks>
            <Link to="/courses">Все курсы</Link>
            <Link to="/courses">Программирование</Link>
            <Link to="/courses">Дизайн</Link>
            <Link to="/courses">Маркетинг</Link>
            <Link to="/courses">Менеджмент</Link>
            <Link to="/courses">Аналитика</Link>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Компания</h3>
          <FooterLinks>
            <Link to="/about">О нас</Link>
            <Link to="/reviews">Отзывы</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/careers">Карьера</Link>
            <Link to="/blog">Блог</Link>
            <Link to="/news">Новости</Link>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Контакты</h3>
          <ContactInfo>
            <div className="contact-item">
              <span className="icon">📧</span>
              <span>info@korochki.est</span>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <span>1 (123) 555-55-55</span>
            </div>
            <div className="contact-item">
              <span className="icon">📍</span>
              <span>Великий Ногвород</span>
            </div>
            <div className="contact-item">
              <span className="icon">🕒</span>
              <span>Пн-Пт: 9:00-18:00</span>
            </div>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © 2024 Корочки.есть. Все права защищены.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;