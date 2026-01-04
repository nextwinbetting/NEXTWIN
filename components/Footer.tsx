
import React from 'react';
import { Page, Language } from '../types';
import NextWinLogo from './NextWinLogo';
import { translations } from '../translations';

interface FooterProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const SocialIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
        {children}
    </div>
);

const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  const t = translations[language];

  return (
    <footer className="bg-brand-dark border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4 flex flex-col items-center md:items-start">
            <NextWinLogo className="h-10" />
            <p className="text-brand-light-gray text-sm text-center md:text-left">{t.footer_tagline}</p>
            <div className="flex space-x-4">
              <SocialIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </SocialIcon>
              <SocialIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </SocialIcon>
               <SocialIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </SocialIcon>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-wider">{t.footer_nav}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={() => onNavigate(Page.HowItWorks)} className="text-brand-light-gray hover:text-white transition-colors">{t.footer_nav_how_it_works}</button></li>
              <li><button onClick={() => onNavigate(Page.Markets)} className="text-brand-light-gray hover:text-white transition-colors">Sports & Marchés Analysés</button></li>
              <li><button onClick={() => onNavigate(Page.JoinUs)} className="text-brand-light-gray hover:text-white transition-colors">Tarifs</button></li>
              <li><button onClick={() => onNavigate(Page.FAQ)} className="text-brand-light-gray hover:text-white transition-colors">{t.nav_faq}</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-wider">{t.footer_legal}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={() => onNavigate(Page.Legal)} className="text-brand-light-gray hover:text-white transition-colors">Mentions légales</button></li>
              <li><button onClick={() => onNavigate(Page.CGV)} className="text-brand-light-gray hover:text-white transition-colors">CGV</button></li>
              <li><button onClick={() => onNavigate(Page.PrivacyPolicy)} className="text-brand-light-gray hover:text-white transition-colors">Politique de confidentialité</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-wider">{t.footer_support}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={() => onNavigate(Page.Contact)} className="text-brand-light-gray hover:text-white transition-colors">{t.footer_nav_contact}</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
             <p className="text-sm text-gray-500 mb-4">
                {t.footer_legal_warning}
            </p>
            <p className="text-base text-brand-light-gray">&copy; {new Date().getFullYear()} NextWin</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;