
export enum Page {
  Home = 'ACCUEIL',
  HowItWorks = 'COMMENT ÇA MARCHE ?',
  Bankroll = 'BANKROLL',
  Markets = 'MARCHÉS',
  StrategyInfo = 'STRATÉGIE',
  JoinUs = 'NOUS REJOINDRE',
  FAQ = 'FAQ',
  Contact = 'CONTACT',
  Login = 'CONNEXION',
  Dashboard = 'TERMINAL ELITE',
  Legal = 'LÉGAL',
  CGV = 'CGV',
  PrivacyPolicy = 'PRIVACY',
  Register = 'INSCRIPTION',
  ForgotPassword = 'RESET_PWD',
  ResetPassword = 'NEW_PWD',
}

export type Language = 'FR' | 'EN';

export enum DashboardNav {
  DashboardHome = "TABLEAU DE BORD",
  Predictions = "SIGNALS",
  Strategy = "STRATEGY",
  Bankroll = "CAPITAL",
  LiveScores = "LIVE",
  Archives = "ARCHIVES",
  Subscription = "MEMBERSHIP",
  Profile = "PROFILE",
  Support = "SUPPORT",
}

export enum Sport {
  Football = 'FOOTBALL',
  Basketball = 'BASKETBALL',
  Tennis = 'TENNIS',
}

export interface User {
  firstName: string;
  lastName: string;
  dob: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Prediction {
  id: string;
  sport: Sport;
  competition: string;
  match: string;
  betType: string;
  marketType?: string;
  category: 'Standard' | 'Bonus' | 'Gift' | 'Elite';
  date: string;
  time: string;
  probability: number;
  analysis: string;
  status?: 'won' | 'lost' | 'pending' | 'confirmed';
  sources?: GroundingSource[];
  isLive?: boolean;
}

export interface DailyPack {
  timestamp: number;
  isValidated: boolean;
  predictions: Prediction[];
  publishedBy: string;
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