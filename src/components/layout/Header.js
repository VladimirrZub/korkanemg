import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';



const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
  }
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  z-index: 1000;
  animation: ${slideDown} 0.8s ease-out;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;



const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  
  .main {
    font-size: 1.5rem;
    font-weight: 800;
    background: ${props => props.theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    font-size: 0.6rem;
    color: ${props => props.theme.colors.text.secondary};
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${props => props.theme.colors.gradient.primary};
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover, &.active {
    color: ${props => props.theme.colors.text.primary};
    
    &::before {
      width: 80%;
    }
  }

  &.active {
    background: rgba(99, 102, 241, 0.1);
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 968px) {
    display: none;
  }
`;

const AuthButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.login {
    background: transparent;
    border: 2px solid ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};

    &:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.glow};
    }
  }

  &.register {
    background: ${props => props.theme.colors.gradient.primary};
    border: none;
    color: white;
    animation: ${glow} 2s ease-in-out infinite;

    &:hover {
      transform: translateY(-2px);
      animation: none;
      box-shadow: ${props => props.theme.shadows.glowStrong};
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: scale(1.05);
  }

  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  z-index: 2000;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  animation: ${slideDown} 0.3s ease-out;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.3);
    transform: rotate(90deg);
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const MobileNavItem = styled(Link)`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateX(10px);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const MobileAuthSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  button {
    flex: 1;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;



const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

   useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleTextClick = (e) => {
    if ( location.pathname === '/courses' || location.pathname === '/about' || location.pathname === '/reviews' || location.pathname === '/contacts') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { path: '/courses', text: 'Курсы' },
    { path: '/about',  text: 'О нас' },
    { path: '/reviews',  text: 'Отзывы' },
    { path: '/contacts',  text: 'Контакты' }
  ];

  return (
    <>
      <HeaderContainer>
        <Nav>
          <Logo to="/" onClick={handleLogoClick}>
            <LogoText>
              <div className="main">Корочки.есть</div>
            </LogoText>
          </Logo>

          <NavLinks onClick={handleTextClick}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.text}
              </NavLink>
            ))}
          </NavLinks>

          <AuthSection>
            <AuthButton className="login">Войти</AuthButton>
            <AuthButton className="register">Регистрация</AuthButton>
          </AuthSection>

          <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
            ☰
          </MobileMenuButton>
        </Nav>
      </HeaderContainer>

      {mobileMenuOpen && (
        <MobileMenu>
          <MobileMenuHeader>
            <Logo to="/" onClick={() => setMobileMenuOpen(false)}>
              <LogoText>
                <div className="main">Корочки.есть</div>
              </LogoText>
            </Logo>
            <CloseButton onClick={() => setMobileMenuOpen(false)}>
              ✕
            </CloseButton>
          </MobileMenuHeader>

          <MobileNavLinks>
            {navItems.map((item) => (
              <MobileNavItem
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.icon}</span>
                {item.text}
              </MobileNavItem>
            ))}
          </MobileNavLinks>

          <MobileAuthSection>
            <AuthButton className="login" style={{ fontSize: '1rem' }}>
              Войти
            </AuthButton>
            <AuthButton className="register" style={{ fontSize: '1rem' }}>
              Регистрация
            </AuthButton>
          </MobileAuthSection>
        </MobileMenu>
      )}
    </>
  );
};

export default Header;