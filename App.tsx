
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { translations } from './translations';

// --- Lazy Loading des Pages ---
const Home = lazy(() => import('./pages/Home'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Bankroll = lazy(() => import('./pages/Bankroll'));
const Markets = lazy(() => import('./pages/Markets'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./member/Dashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const CGV = lazy(() => import('./pages/CGV'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));


export enum Page {
  Home = 'ACCUEIL',
  HowItWorks = 'COMMENT ÇA MARCHE ?',
  Bankroll = 'BANKROLL',
  Markets = 'SPORTS & MARCHÉS ANALYSÉS',
  JoinUs = 'NOUS REJOINDRE',
  FAQ = 'FAQ',
  Contact = 'CONTACTEZ-NOUS',
  Login = 'CONNEXION',
  Dashboard = 'TABLEAU DE BORD',
  Legal = 'MENTIONS LÉGALES',
  CGV = 'CGV',
  PrivacyPolicy = 'POLITIQUE DE CONFIDENTIALITÉ',
}

export type Language = 'FR' | 'EN';

const LoadingFallback: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [language, setLanguage] = useState<Language>('FR');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigation = useCallback((page: Page) => {
    if (!isLoggedIn && (page === Page.Dashboard)) {
      setCurrentPage(Page.Login);
    } else if (!isLoggedIn && (page === Page.JoinUs)) {
      setCurrentPage(Page.JoinUs);
    } else {
      setCurrentPage(page);
    }
  }, [isLoggedIn]);

  const showLoginPage = () => {
    setCurrentPage(Page.Login);
  };

  const handleLoginSuccess = (email: string) => {
    const adminEmail = 'admin@nextwin.ai';

    setIsLoggedIn(true);
    if (email.toLowerCase() === adminEmail) {
      setIsSubscribed(true); // Admin gets automatic pro access
    } else {
      setIsSubscribed(false); // Regular user is logged in but not subscribed yet
    }
    setCurrentPage(Page.Dashboard);
  };
  
  const handleLogout = () => {
      setIsLoggedIn(false);
      setIsSubscribed(false);
      setCurrentPage(Page.Home);
  };

  const handleSubscribe = () => {
    if (isLoggedIn) {
      setIsSubscribed(true);
    }
  };

  const renderPage = () => {
    if (isLoggedIn) {
        return <Dashboard language={language} isSubscribed={isSubscribed} onSubscribe={handleSubscribe} />;
    }
    switch (currentPage) {
      case Page.Home:
        return <Home onNavigate={handleNavigation} language={language} />;
      case Page.HowItWorks:
        return <HowItWorks language={language} onNavigate={handleNavigation} />;
      case Page.Bankroll:
        return <Bankroll language={language} onNavigate={handleNavigation} />;
      case Page.Markets:
        return <Markets language={language} onNavigate={handleNavigation} />;
      case Page.JoinUs:
        return <JoinUs language={language} />;
      case Page.FAQ:
        return <FAQ language={language} />;
      case Page.Contact:
        return <Contact language={language} onNavigate={handleNavigation} />;
      case Page.Legal:
        return <Legal language={language} onNavigate={handleNavigation} />;
      case Page.CGV:
        return <CGV language={language} onNavigate={handleNavigation} />;
      case Page.PrivacyPolicy:
        return <PrivacyPolicy language={language} onNavigate={handleNavigation} />;
      case Page.Login:
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigation} language={language} />;
      default:
        return <Home onNavigate={handleNavigation} language={language}/>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark-blue font-sans flex flex-col">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigation} 
        isLoggedIn={isLoggedIn}
        onShowLogin={showLoginPage}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
      />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer onNavigate={handleNavigation} language={language} />
    </div>
  );
};

export default App;
