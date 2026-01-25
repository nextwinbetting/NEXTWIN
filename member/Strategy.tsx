
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

const ProtocolStep: React.FC<{
    num: string;
    title: string;
    desc: string;
    tags: string[];
    isHighlight?: boolean;
}> = ({ num, title, desc, tags, isHighlight }) => (
    <div className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
        isHighlight 
        ? 'bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.05)]' 
        : 'bg-white/[0.03] border-white/5 hover:border-white/20'
    }`}>
        <div className="absolute -top-4 -right-4 text-8xl font-black italic opacity-[0.03] select-none text-white">{num}</div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <span className={`h-1.5 w-6 rounded-full ${isHighlight ? 'bg-orange-500' : 'bg-gray-600'}`}></span>
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{title}</h3>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-6 italic">{desc}</p>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest">{tag}</span>
                ))}
            </div>
        </div>
    </div>
);

const Strategy: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-24">
            {/* Header Masterclass */}
            <div className="mb-20">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] italic">PROTOCOLE D'ÉLITE V1.4</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                    LA MÉTHODE <br/> <span className="text-transparent bg-clip-text bg-gradient-brand">MATRICIELLE</span>
                </h1>
                <p className="mt-8 text-gray-500 text-sm font-bold uppercase tracking-[0.3em] italic leading-relaxed max-w-2xl">
                    Le succès n'est pas une question de chance, mais de probabilités exploitées avec une discipline de fer.
                </p>
            </div>

            {/* Piliers Fondamentaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                <ProtocolStep 
                    num="01"
                    title="Analyse par IA"
                    desc="Notre moteur scanne 150 championnats pour identifier les cotes mal ajustées par les bookmakers."
                    tags={["Modélisation xG", "H2H Technologique", "Zéro Émotion"]}
                    isHighlight
                />
                <ProtocolStep 
                    num="02"
                    title="La Loi des 5%"
                    desc="Ne jouez jamais plus de 5% de votre capital sur un match. C'est l'assurance vie de votre bankroll."
                    tags={["Risque Maîtrisé", "Anti-Bust", "Scalabilité"]}
                />
            </div>

            {/* Matrice d'Exécution */}
            <div className="bg-[#1a1d26] border border-white/5 rounded-[3rem] p-12 mb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[100px] rounded-full"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 border-l-4 border-orange-500 pl-6">MATRICE D'EXÉCUTION</h2>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 italic">Configuration 1 : Sécurité</p>
                            <div className="p-8 bg-black/30 border border-white/5 rounded-3xl group hover:border-orange-500/30 transition-all">
                                <p className="text-3xl font-black text-white mb-1">Cote ≥ 1.50</p>
                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Jouer en Simple</p>
                                <p className="mt-4 text-[10px] text-gray-500 leading-relaxed uppercase italic">Optimise la régularité et réduit l'impact de la variance sur le long terme.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 italic">Configuration 2 : Rendement</p>
                            <div className="p-8 bg-black/30 border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all">
                                <p className="text-3xl font-black text-white mb-1">Cote < 1.50</p>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Combiner x2</p>
                                <p className="mt-4 text-[10px] text-gray-500 leading-relaxed uppercase italic">Permet d'atteindre une cote cible de 2.00 tout en conservant une probabilité élevée.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 italic">Configuration 3 : Bankroll</p>
                            <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl group hover:border-orange-500/30 transition-all">
                                <p className="text-3xl font-black text-white mb-1">Fixe : 5%</p>
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Mise Statique</p>
                                <p className="mt-4 text-[10px] text-gray-500 leading-relaxed uppercase italic">Votre mise doit être identique pour chaque prono d'une même session.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mindset Footer */}
            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] text-center">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6">Mantra de l'Investisseur</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] italic">
                    <span className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-orange-500 rounded-full"></span> Discipline</span>
                    <span className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-orange-500 rounded-full"></span> Patience</span>
                    <span className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-orange-500 rounded-full"></span> Data-Only</span>
                </div>
            </div>
        </div>
    );
};

export default Strategy;
