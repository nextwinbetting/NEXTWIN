
import React, { useState } from 'react';
import { ArchivedAnalysis } from '../types';

const ArchiveItem: React.FC<{ item: ArchivedAnalysis }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const probColor = item.probability >= 75 ? 'text-green-400' : item.probability >= 60 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="border-b border-gray-800 last:border-b-0 bg-brand-card/20 hover:bg-brand-card/40 transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-6 px-6 text-left"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">{item.sport}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{item.analysisDate}</span>
                    </div>
                    <p className="text-lg font-black text-white italic uppercase tracking-tighter truncate">{item.team1} <span className="text-gray-600">VS</span> {item.team2}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Scan : {item.betType}</p>
                </div>
                <div className="flex items-center gap-6 pl-4">
                    <div className="text-right">
                        <p className={`text-2xl font-black ${probColor}`}>{item.probability}%</p>
                    </div>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </button>
            
            {isOpen && (
                <div className="px-6 pb-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-800">
                        <div className="space-y-6">
                            <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2">Recommandation Expert</p>
                                <p className="text-xl font-black text-white italic uppercase tracking-tighter">{item.recommendedBet}</p>
                                <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed italic">"{item.recommendationReason}"</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 italic">Arguments Clés</p>
                                <div className="space-y-2">
                                    {item.keyData.map((d, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{d}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 italic">Analyse Technique Complète</p>
                                <p className="text-xs text-gray-300 font-medium leading-[1.8] italic">"{item.analysis}"</p>
                            </div>
                            {item.sources && item.sources.length > 0 && (
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 italic">Sources de données</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.sources.map((s, i) => (
                                            <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-orange-400 bg-orange-500/5 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest">
                                                {s.title || "Lien Source"}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Archives: React.FC<{ archives: ArchivedAnalysis[] }> = ({ archives }) => {
    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
            <div className="mb-12 text-center lg:text-left">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1 rounded-full mb-4">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] italic">HISTORIQUE DES SCANS</span>
                </div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">ARCHIVES & <span className="text-transparent bg-clip-text bg-gradient-brand">SUIVI ENGINE</span></h1>
            </div>

            <div className="bg-brand-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {archives.length === 0 ? (
                    <div className="py-32 text-center opacity-30">
                        <svg className="mx-auto h-16 w-16 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-sm font-black uppercase tracking-[0.8em]">Aucun scan archivé</p>
                    </div>
                ) : (
                    <div>
                        {archives.map(item => <ArchiveItem key={item.id} item={item} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archives;
