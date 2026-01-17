import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { translations } from './translations';
import { Page, Language } from './types';

// --- Lazy Loading des Pages ---
const Home = lazy(() => import('./pages/Home'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Bankroll = lazy(() => import('./pages/Bankroll'));
const Markets = lazy(() => import('./pages/Markets'));
const StrategyInfo = lazy(() => import('./pages/StrategyInfo'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./member/Dashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const CGV = lazy(() => import('./pages/CGV'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

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
    setCurrentPage(page);
  }, []);

  const showLoginPage = () => {
    setCurrentPage(Page.Login);
  };

  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    // Pour la phase de test, toute connexion donne un accès "Pro".
    // Cette ligne sera modifiée pour gérer les vrais abonnements.
    setIsSubscribed(true); 
    handleNavigation(Page.Dashboard);
  };
  
  const handleLogout = () => {
      setIsLoggedIn(false);
      setIsSubscribed(false);
      handleNavigation(Page.Home);
  };

  const handleSubscribe = () => {
    if (isLoggedIn) {
      setIsSubscribed(true);
    }
  };
  
  const handleCancelSubscription = () => {
      setIsSubscribed(false);
  };

  const renderCurrentPage = () => {
    if (currentPage === Page.Dashboard && !isLoggedIn) {
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigation} language={language} />;
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
      case Page.StrategyInfo:
        return <StrategyInfo language={language} onNavigate={handleNavigation} />;
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
      case Page.Dashboard:
         return <Dashboard language={language} isSubscribed={isSubscribed} onSubscribe={handleSubscribe} onCancelSubscription={handleCancelSubscription} onNavigate={handleNavigation} />;
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
          {renderCurrentPage()}
        </Suspense>
      </main>
      {currentPage !== Page.Dashboard && <Footer onNavigate={handleNavigation} language={language} />}
    </div>
  );
};

export default App;