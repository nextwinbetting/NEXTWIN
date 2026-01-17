export enum Page {
  Home = 'ACCUEIL',
  HowItWorks = 'COMMENT ÇA MARCHE ?',
  Bankroll = 'BANKROLL',
  Markets = 'SPORTS & MARCHÉS ANALYSÉS',
  StrategyInfo = 'NOTRE STRATÉGIE – ACCÈS MEMBRES',
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

export enum Sport {
  Football = 'FOOTBALL',
  Basketball = 'BASKETBALL',
  Tennis = 'TENNIS',
}

export interface Prediction {
  id: string;
  sport: Sport;
  match: string;
  betType: string;
  date: string;
  time: string;
  probability: number;
  analysis: string;
  status?: 'won' | 'lost' | 'pending';
}

export interface Bankroll {
  id: string;
  name: string;
  initialCapital: number;
  currentCapital: number;
  bets: Bet[];
}

export interface Bet {
  id: string;
  sport: Sport;
  match: string;
  stake: number;
  odds: number;
  result: 'won' | 'lost' | 'pending';
  profit: number;
  date: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  analysis: string;
  probability: number;
  keyData: string[];
  recommendedBet: string;
  recommendationReason: string;
  matchDate: string;
  matchTime: string;
  sources?: GroundingSource[];
}

export interface ArchivedAnalysis extends AnalysisResult {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  betType: string;
  analysisDate: string;
}