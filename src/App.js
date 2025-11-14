import React, { useState, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import styled from 'styled-components';

import Preloader from './components/layout/Preloader';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Скелетоны
import SkeletonHome from './components/skeletons/SkeletonHome';
import SkeletonCourses from './components/skeletons/SkeletonCourses';
import SkeletonAbout from './components/skeletons/SkeletonAbout';
import SkeletonReviews from './components/skeletons/SkeletonReviews';
import SkeletonContacts from './components/skeletons/SkeletonContacts';

// Lazy loading для страниц
const Home = React.lazy(() => import('./pages/Home'));
const Courses = React.lazy(() => import('./pages/Courses'));
const About = React.lazy(() => import('./pages/About'));
const Reviews = React.lazy(() => import('./pages/Reviews'));
const Contacts = React.lazy(() => import('./pages/Contacts'));

const MainContent = styled.main`
  min-height: 100vh;
`;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderFinish = () => {
    setIsLoaded(true);
  };

  if (!isLoaded) {
    return <Preloader onLoaded={handlePreloaderFinish} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Header />
          <MainContent>
            <ScrollToTop />
            <Suspense fallback={
              <Routes>
                <Route path="/" element={<SkeletonHome />} />
                <Route path="/courses" element={<SkeletonCourses />} />
                <Route path="/about" element={<SkeletonAbout />} />
                <Route path="/reviews" element={<SkeletonReviews />} />
                <Route path="/contacts" element={<SkeletonContacts />} />
              </Routes>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/about" element={<About />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/contacts" element={<Contacts />} />
              </Routes>
            </Suspense>
          </MainContent>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;