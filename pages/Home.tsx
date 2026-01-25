import React from 'react';
import { Page, Language } from '../types';

const DetailedNeuralNexus = () => (
    <div className="relative w-full max-w-2xl aspect-square scale-110 lg:scale-125">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_80px_rgba(139,92,246,0.25)]">
            <defs>
                <linearGradient id="nexus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="ultra-glow">
                    <feGaussianBlur stdDeviation="20" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            {/* Massive Orbital Rings */}
            <g transform="translate(250, 250)">
                <circle r="220" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" className="animate-[spin_90s_linear_infinite]" />
                <circle r="190" fill="none" stroke="url(#nexus-grad)" strokeWidth="0.5" strokeDasharray="10 40" opacity="0.2" className="animate-[spin_45s_linear_infinite_reverse]" />
                <ellipse rx="240" ry="100" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" transform="rotate(45)" className="animate-[spin_60s_linear_infinite]" />
                <ellipse rx="240" ry="100" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" transform="rotate(-45)" className="animate-[spin_50s_linear_infinite_reverse]" />
                
                {/* Internal Geometry & Pulse */}
                <g filter="url(#ultra-glow)" className="animate-[pulse_4s_ease-in-out_infinite]">
                    <circle r="85" fill="url(#nexus-grad)" opacity="0.1" />
                    <circle r="75" fill="url(#nexus-grad)" opacity="0.8" />
                    <circle r="68" fill="#020205" />
                    
                    {/* Neural Connections inside Core */}
                    <g opacity="0.6">
                        <circle cx="-15" cy="-15" r="4" fill="white" />
                        <circle cx="20" cy="10" r="3" fill="white" />
                        <circle cx="-10" cy="25" r="3" fill="white" />
                        <path d="M-15 -15 L20 10 L-10 25 Z" stroke="white" strokeWidth="0.5" fill="none" />
                    </g>
                    
                    <text y="14" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" className="font-sans italic tracking-tighter">NW</text>
                </g>

                {/* Satellite Data Streams */}
                {[...Array(16)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 22.5})`}>
                        <circle 
                            cx="180" 
                            cy="0" 
                            r="2.5" 
                            fill="white" 
                            className="animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                        />
                        <path 
                            d="M 180 0 L 220 0" 
                            stroke="white" 
                            strokeWidth="0.5" 
                            strokeDasharray="1 5" 
                            opacity="0.1" 
                        />
                    </g>
                ))}
            </g>
        </svg>
    </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; label: string }> = ({ icon, title, desc, color, label }) => (
    <div className="glass-premium p-12 rounded-[4rem] hover-reveal group flex flex-col h-full border-white/5 transition-all duration-700">
        <div className="flex justify-between items-start mb-12">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${color} shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6`}>
                {icon}
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic opacity-60">{label}</span>
        </div>
        <h3 className="text-3xl font-sans font-black text-white italic uppercase tracking-tighter mb-6">{title}</h3>
        <p className="text-white text-sm font-bold uppercase tracking-widest leading-relaxed italic flex-grow">{desc}</p>
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Intelligence Artificielle Active</span>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ name: string; profit: string; text: string; id: number }> = ({ name, profit, text, id }) => (
    <div className="w-[480px] mx-10 p-10 glass-premium rounded-[3.5rem] flex flex-col gap-10 shrink-0 transition-all hover:bg-white/[0.06] border-white/5">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-2 border-brand-violet/20 p-1 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${id}`} alt={name} className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <div>
                <p className="font-sans font-black text-white uppercase text-base tracking-tight">{name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic">{profit} GÉNÉRÉS</span>
                </div>
            </div>
        </div>
        <p className="text-lg text-white font-medium leading-relaxed italic border-l-2 border-white/10 pl-8">"{text}"</p>
    </div>
);

const Home: React.FC<{ onNavigate: (page: Page) => void; language: Language }> = ({ onNavigate, language }) => {
    const allTestimonials = Array.from({ length: 50 }, (_, i) => ({
        name: ["Marc D.", "Julien S.", "Sarah B.", "Thomas L.", "Karim F.", "Alice M."][i % 6] + ` #${i+100}`,
        profit: ["+1,420€", "+890€", "+2,100€", "+450€", "+1,120€", "+3,200€"][i % 6],
        text: "La précision du moteur neural sur le football européen est tout simplement chirurgicale. Une nouvelle ère de paris.",
        id: i + 100
    }));

    return (
        <div className="pt-40 lg:pt-64 pb-32 overflow-hidden">
            {/* HERO SECTION RAFFINÉE */}
            <section className="container mx-auto px-6 mb-72">
                <div className="grid lg:grid-cols-2 gap-32 items-center">
                    <div className="space-y-16">
                        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass-premium border-brand-orange/20">
                            <div className="h-2 w-2 rounded-full bg-brand-orange animate-ping"></div>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">Neural Protocol V4.2 — Actif</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-sans font-black text-white impact-title uppercase italic">
                            L’ANALYSE IA AU <br/> SERVICE DE <br/>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-violet">VOS GAINS SPORTIFS.</span>
                        </h1>

                        <p className="max-w-xl text-xl text-white font-bold italic uppercase tracking-tighter leading-snug">
                            Nous fusionnons le Big Data mondial et les réseaux neuronaux pour transformer l'incertitude en stratégie mathématique.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 pt-8">
                            <button 
                                onClick={() => onNavigate(Page.JoinUs)}
                                className="px-20 py-8 bg-gradient-to-r from-brand-orange to-brand-violet text-white rounded-full font-sans font-black text-xs uppercase tracking-[0.4em] italic hover:scale-105 transition-all shadow-[0_30px_70px_rgba(249,115,22,0.3)]"
                            >
                                ACTIVER MON TERMINAL
                            </button>
                            <button 
                                onClick={() => onNavigate(Page.HowItWorks)}
                                className="px-20 py-8 glass-premium text-white rounded-full font-sans font-black text-xs uppercase tracking-[0.4em] italic hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-violet transition-all"
                            >
                                COMMENT ÇA MARCHE ?
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <DetailedNeuralNexus />
                    </div>
                </div>
            </section>

            {/* BENTO GRID RAFFINÉE */}
            <section className="container mx-auto px-6 mb-80">
                <div className="text-center mb-40 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-sans font-black text-white italic uppercase tracking-tighter leading-none">
                        VOTRE ÉCOSYSTÈME <br/> <span className="text-brand-orange">HAUTE PERFORMANCE.</span>
                    </h2>
                    <p className="text-white font-black uppercase tracking-[0.8em] italic text-xs opacity-60">Ingénierie de Données Appliquée</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-16">
                    <FeatureCard 
                        label="SIGNAUX"
                        color="bg-brand-orange"
                        title="Neural Signals"
                        desc="8 pronostics quotidiens filtrés par nos modèles mathématiques de pointe. Taux de réussite certifié de 81%."
                        icon={<svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    />
                    <FeatureCard 
                        label="PILOTAGE"
                        color="bg-brand-violet"
                        title="Capital Pilot"
                        desc="L'IA calcule automatiquement votre mise idéale selon la règle des 5%. La protection de votre capital est notre priorité."
                        icon={<svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    />
                    <FeatureCard 
                        label="ACCÈS"
                        color="bg-white/10"
                        title="Elite Terminal"
                        desc="Votre cockpit membre avec scanner de matchs en temps réel et archives complètes de toutes les analyses passées."
                        icon={<svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    />
                </div>
            </section>

            {/* MARQUEE ULTRA LENT */}
            <section className="py-40 border-y border-white/5 bg-brand-surface/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-violet/5 blur-[150px] rounded-full -translate-x-1/2"></div>
                <div className="container mx-auto px-6 mb-24 flex items-center justify-between relative z-10">
                    <h2 className="text-[12px] font-black text-white uppercase tracking-[0.8em] italic opacity-60">FLUX CERTIFIÉ • COMMUNAUTÉ NEXTWIN</h2>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic animate-pulse">Synchronisation Directe</span>
                </div>
                <div className="animate-marquee-slow hover:[animation-play-state:paused] relative z-10">
                    {allTestimonials.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                    {allTestimonials.map((t, i) => (
                        <TestimonialCard key={`dup-${i}`} {...t} />
                    ))}
                </div>
            </section>

            {/* CALL TO ACTION FINAL */}
            <section className="container mx-auto px-6 py-64">
                <div className="relative glass-premium p-24 lg:p-56 rounded-[6rem] text-center overflow-hidden border-brand-orange/30 group">
                    <div className="absolute inset-0 bg-gradient-main opacity-5 group-hover:opacity-10 transition-opacity duration-1000"></div>
                    <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-brand-orange/10 blur-[200px] group-hover:scale-125 transition-all duration-1000"></div>
                    
                    <h2 className="text-6xl md:text-8xl font-sans font-black text-white mb-24 uppercase italic tracking-tighter leading-none">
                        VOTRE NOUVELLE <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-violet">ÈRE COMMENCE.</span>
                    </h2>
                    
                    <button 
                        onClick={() => onNavigate(Page.JoinUs)}
                        className="px-32 py-12 bg-white text-black rounded-full font-sans font-black text-2xl italic uppercase tracking-widest hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-violet hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                        ACCÉDER AU TERMINAL
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;