import React from 'react';
import { Page, Language } from '../types';
import NextWinLogo from './NextWinLogo';

interface FooterProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const FooterColumn: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col gap-10">
        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.6em] italic border-b border-white/10 pb-4">{title}</h4>
        <div className="flex flex-col gap-6">
            {children}
        </div>
    </div>
);

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-sm font-bold text-white/60 hover:text-brand-orange transition-all text-left italic uppercase tracking-widest hover:translate-x-2">
        {children}
    </button>
);

const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  return (
    <footer className="bg-brand-surface pt-40 pb-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-pro opacity-30"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          {/* Brand Col */}
          <div className="flex flex-col gap-10">
            <NextWinLogo />
            <p className="text-sm text-white/50 font-bold leading-relaxed max-w-xs italic uppercase tracking-widest">
                L'architecture prédictive de référence mondiale. Gérée par la data, validée par l'intelligence artificielle.
            </p>
            <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-orange hover:border-brand-orange transition-all cursor-pointer">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                    </div>
                ))}
            </div>
          </div>

          <FooterColumn title="PLATEFORME">
            <FooterLink onClick={() => onNavigate(Page.Home)}>Accueil</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.HowItWorks)}>Le Protocole Engine</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.StrategyInfo)}>Stratégie Elite</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.Markets)}>Analyse Marchés</FooterLink>
          </FooterColumn>

          <FooterColumn title="MEMBRES">
            <FooterLink onClick={() => onNavigate(Page.Dashboard)}>Terminal IA</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.Bankroll)}>Gestion Bankroll</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.FAQ)}>Centre d'Aide</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.Contact)}>Assistance Tech</FooterLink>
          </FooterColumn>

          <FooterColumn title="LEGAL">
            <FooterLink onClick={() => onNavigate(Page.Legal)}>Mentions Légales</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.CGV)}>Conditions de Vente</FooterLink>
            <FooterLink onClick={() => onNavigate(Page.PrivacyPolicy)}>Confidentialité</FooterLink>
          </FooterColumn>
        </div>

        <div className="pt-20 border-t border-white/5 flex flex-col lg:grid lg:grid-cols-3 items-center gap-12 text-center">
            <div className="flex flex-col gap-3 text-left">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em] italic">© 2025 NEXTWIN ENGINE TECHNOLOGY</p>
                <div className="flex gap-6 text-[9px] text-white/30 font-black uppercase italic tracking-[0.3em]">
                    <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> System Online</span>
                    <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-brand-violet"></div> AI Active</span>
                </div>
            </div>
            
            <div className="flex justify-center">
                <img src="https://stripe.com/img/v3/home/social.png" alt="Stripe Secure" className="h-8 opacity-20 grayscale invert" />
            </div>

            <p className="text-[9px] text-white/40 font-bold leading-relaxed uppercase italic tracking-widest text-right">
                Avertissement : Les paris sportifs comportent des risques. NextWin est un outil d'aide à la décision mathématique. 
                Aucun gain n'est garanti à 100%. Jouez de manière responsable.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;