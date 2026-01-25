import React, { useState } from 'react';
import { Bankroll, Bet, Sport } from '../types';

const StatCard: React.FC<{ title: string; value: string; subtext: string; color: string; roi?: string; }> = ({ title, value, subtext, color, roi }) => (
    <div className="bg-brand-card border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
        <div>
            <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{title}</p>
                {roi && <span className={`text-[9px] font-black px-3 py-1 rounded-lg border italic ${parseFloat(roi) >= 0 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5'}`}>{roi}</span>}
            </div>
            <p className={`text-3xl font-black mt-4 italic tracking-tighter uppercase ${color}`}>{value}</p>
            <p className="text-[9px] text-gray-600 font-bold mt-2 uppercase italic">{subtext}</p>
        </div>
    </div>
);

const BankrollManagement: React.FC = () => {
    const [bankroll, setBankroll] = useState<Bankroll>({
        id: '1',
        name: 'Main Bankroll',
        initialCapital: 1000,
        currentCapital: 1000,
        bets: [],
    });

    const [newBetSport, setNewBetSport] = useState<Sport>(Sport.Football);
    const [newBetMatch, setNewBetMatch] = useState('');
    const [newBetOdds, setNewBetOdds] = useState('');
    const [newBetStake, setNewBetStake] = useState('');
    const [fundAmount, setFundAmount] = useState('');

    const handleAddBet = (e: React.FormEvent) => {
        e.preventDefault();
        const stake = parseFloat(newBetStake);
        const odds = parseFloat(newBetOdds);

        if (isNaN(stake) || isNaN(odds) || stake <= 0 || odds <= 1 || !newBetMatch.trim()) {
            alert("Veuillez remplir tous les champs correctement.");
            return;
        }
        if (stake > bankroll.currentCapital) {
            alert("La mise ne peut pas dépasser votre bankroll actuelle.");
            return;
        }

        const newBet: Bet = {
            id: Date.now().toString(),
            sport: newBetSport,
            match: newBetMatch.trim(),
            stake,
            odds,
            result: 'pending',
            profit: 0,
            date: new Date().toLocaleDateString('fr-FR'),
        };

        setBankroll(prev => ({
            ...prev,
            currentCapital: prev.currentCapital - stake,
            bets: [newBet, ...prev.bets],
        }));

        setNewBetMatch('');
        setNewBetOdds('');
        setNewBetStake('');
    };
    
    const handleFundBankroll = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Veuillez entrer un montant valide.");
            return;
        }

        setBankroll(prev => ({
            ...prev,
            initialCapital: prev.initialCapital + amount,
            currentCapital: prev.currentCapital + amount,
        }));
        
        setFundAmount('');
    };

    const handleBetResult = (betId: string, result: 'won' | 'lost') => {
        const bet = bankroll.bets.find(b => b.id === betId);
        if (!bet || bet.result !== 'pending') return;

        let profit = 0;
        let capitalUpdate = 0;

        if (result === 'won') {
            profit = (bet.stake * bet.odds) - bet.stake;
            capitalUpdate = bet.stake * bet.odds;
        } else { // lost
            profit = -bet.stake;
            capitalUpdate = 0; 
        }

        setBankroll(prev => ({
            ...prev,
            currentCapital: prev.currentCapital + capitalUpdate,
            bets: prev.bets.map(b => 
                b.id === betId ? { ...b, result, profit } : b
            ),
        }));
    };

    const profitValue = bankroll.currentCapital - bankroll.initialCapital;
    const totalStaked = bankroll.bets.reduce((sum, bet) => sum + (bet.result !== 'pending' ? bet.stake : 0), 0);
    const yieldValue = totalStaked > 0 ? (profitValue / totalStaked) * 100 : 0;
    
    const concludedBets = bankroll.bets.filter(b => b.result !== 'pending');
    const successRate = concludedBets.length > 0 ? (concludedBets.filter(b => b.result === 'won').length / concludedBets.length) * 100 : 0;
    const suggestedBet = bankroll.currentCapital * 0.05;

    return (
        <div className="pb-20 animate-fade-in">
            <header className="mb-16">
                <div className="inline-block bg-brand-orange/5 border border-brand-orange/20 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.5em] italic">RISK MANAGEMENT: 5% ACTIVE</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">GESTION DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-violet">CAPITAL.</span></h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard title="Capital Actuel" value={`${bankroll.currentCapital.toFixed(2)}€`} subtext={`${bankroll.initialCapital.toFixed(2)}€ investis`} color="text-white" roi={`${yieldValue.toFixed(1)}% ROI`} />
                <StatCard title="Profit Net" value={`${profitValue >= 0 ? '+' : ''}${profitValue.toFixed(2)}€`} subtext="Performance cumulée" color={profitValue >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                <StatCard title="Yield Engine" value={`${yieldValue >= 0 ? '+' : ''}${yieldValue.toFixed(1)}%`} subtext="Rentabilité brute" color={yieldValue >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                <StatCard title="Success Rate" value={`${successRate.toFixed(0)}%`} subtext={`${concludedBets.length} signaux terminés`} color="text-white" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8 border-l-4 border-brand-orange pl-6">ENREGISTRER SIGNAL</h3>
                        <div className="bg-brand-orange/5 border border-brand-orange/20 p-5 rounded-2xl text-center mb-8">
                            <p className="text-[9px] font-black text-brand-orange uppercase tracking-widest italic mb-1">MISE SUGGÉRÉE (NEURAL 5%)</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{suggestedBet.toFixed(2)}€</p>
                        </div>
                        <form onSubmit={handleAddBet} className="space-y-6">
                             <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">SPORT</label>
                                <select value={newBetSport} onChange={e => setNewBetSport(e.target.value as Sport)} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase focus:border-brand-orange transition-all">
                                    <option value={Sport.Football}>Football</option>
                                    <option value={Sport.Basketball}>Basketball</option>
                                    <option value={Sport.Tennis}>Tennis</option>
                                </select>
                            </div>
                             <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">MATCH</label>
                                <input type="text" placeholder="ÉQUIPES" value={newBetMatch} onChange={e => setNewBetMatch(e.target.value)} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase focus:border-brand-orange transition-all placeholder:text-gray-800" />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">COTE</label>
                                    <input type="number" step="0.01" min="1.01" placeholder="1.85" value={newBetOdds} onChange={e => setNewBetOdds(e.target.value)} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase focus:border-brand-orange transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">MISE (€)</label>
                                    <input type="number" step="0.01" min="0.01" value={newBetStake} onChange={e => setNewBetStake(e.target.value)} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase focus:border-brand-orange transition-all" />
                                </div>
                            </div>
                             <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-violet px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] italic text-white shadow-xl shadow-brand-orange/20 transition-transform transform hover:scale-105 active:scale-95">
                               AJOUTER AU CAPITAL
                            </button>
                        </form>
                     </div>
                </div>

                 <div className="lg:col-span-2 bg-brand-card border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8 border-l-4 border-brand-violet pl-6">HISTORIQUE DES OPÉRATIONS</h3>
                     {bankroll.bets.length === 0 ? (
                         <div className="py-32 text-center opacity-20">
                            <p className="text-[11px] font-black uppercase tracking-[0.8em] italic">Aucun mouvement détecté</p>
                        </div>
                     ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-white/5">
                                    <tr>
                                        <th className="py-5 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic">MATCH / DATE</th>
                                        <th className="py-5 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic">MISE</th>
                                        <th className="py-5 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic">COTE</th>
                                        <th className="py-5 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic">STATUT</th>
                                        <th className="py-5 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic">P&L</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bankroll.bets.map(bet => (
                                        <tr key={bet.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-6">
                                                <p className="text-sm font-black text-white italic uppercase tracking-tighter">{bet.match}</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic">{bet.sport} • {bet.date}</p>
                                            </td>
                                            <td className="py-6 text-xs font-black text-white italic">{bet.stake.toFixed(2)}€</td>
                                            <td className="py-6 text-xs font-black text-white italic">{bet.odds.toFixed(2)}</td>
                                            <td className="py-6">
                                                {bet.result === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleBetResult(bet.id, 'won')} className="px-3 py-1 text-[9px] font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 rounded-lg hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest italic">GAGNÉ</button>
                                                        <button onClick={() => handleBetResult(bet.id, 'lost')} className="px-3 py-1 text-[9px] font-black text-red-400 border border-red-500/20 bg-red-500/5 rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest italic">PERDU</button>
                                                    </div>
                                                ) : (
                                                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest italic rounded-lg border ${bet.result === 'won' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5'}`}>
                                                        {bet.result === 'won' ? 'WIN' : 'LOSS'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`py-6 text-right text-sm font-black italic tracking-tighter ${bet.profit > 0 ? 'text-emerald-400' : bet.profit < 0 ? 'text-red-400' : 'text-white/40'}`}>
                                                {bet.profit >= 0 ? '+' : ''}{bet.profit.toFixed(2)}€
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default BankrollManagement;