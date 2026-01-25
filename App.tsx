import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Page, Language, User } from './types';

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
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

const LoadingFallback: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-brand-bg">
    <div className="relative h-20 w-20 mb-8">
      <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent animate-spin"></div>
    </div>
    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic animate-pulse">
      Initialisation du Moteur Neural...
    </p>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [language, setLanguage] = useState<Language>('FR');
  const [emailToReset, setEmailToReset] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigation = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const showLoginPage = () => {
    setCurrentPage(Page.Login);
  };

  const handleLoginSuccess = (user: User) => {
    if (!user) return;
    
    // SYSTEME ADMIN : Sécurisation du pseudo
    const username = (user.username || "").toLowerCase();
    const isAdminAccount = username.includes('admin') || username === 'nextwin_boss';
    
    const enhancedUser = {
        ...user,
        isAdmin: isAdminAccount
    };
    setCurrentUser(enhancedUser);
    setIsSubscribed(true); 
    handleNavigation(Page.Dashboard);
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    setIsSubscribed(true);
    handleNavigation(Page.Dashboard);
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      setIsSubscribed(false);
      handleNavigation(Page.Home);
  };

  const handleSubscribe = () => {
    if (currentUser) {
      setIsSubscribed(true);
    }
  };
  
  const handleCancelSubscription = () => {
      setIsSubscribed(false);
  };

  const renderCurrentPage = () => {
    if (currentPage === Page.Dashboard && !currentUser) {
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
        return <JoinUs language={language} onNavigate={handleNavigation} />;
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
      case Page.Register:
        return <Register onRegisterSuccess={handleRegisterSuccess} onNavigate={handleNavigation} language={language} />;
      case Page.ForgotPassword:
        return <ForgotPassword onNavigate={handleNavigation} language={language} onRequestReset={setEmailToReset} />;
      case Page.ResetPassword:
        return <ResetPassword email={emailToReset} onNavigate={handleNavigation} language={language} />;
      case Page.Dashboard:
         return <Dashboard currentUser={currentUser!} language={language} isSubscribed={isSubscribed} onSubscribe={handleSubscribe} onCancelSubscription={handleCancelSubscription} onNavigate={handleNavigation} />;
      default:
        return <Home onNavigate={handleNavigation} language={language}/>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans flex flex-col text-white">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigation} 
        isLoggedIn={!!currentUser}
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