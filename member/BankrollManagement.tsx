
import React, { useState } from 'react';
import { Bankroll, Bet, Sport } from '../types';

const StatCard: React.FC<{ title: string; value: string; subtext: string; color: string; roi?: string; }> = ({ title, value, subtext, color, roi }) => (
    <div className="bg-brand-card border border-gray-800 rounded-xl p-5 relative flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start">
                <p className="text-sm text-brand-light-gray uppercase">{title}</p>
                {roi && <span className={`text-xs font-bold px-2 py-1 rounded-full ${parseFloat(roi) >= 0 ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'}`}>{roi}</span>}
            </div>
            <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
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
            capitalUpdate = 0; // stake was already removed
        }

        setBankroll(prev => ({
            ...prev,
            currentCapital: prev.currentCapital + capitalUpdate,
            bets: prev.bets.map(b => 
                b.id === betId ? { ...b, result, profit } : b
            ),
        }));
    };

    const profit = bankroll.currentCapital - bankroll.initialCapital;
    const totalStaked = bankroll.bets.reduce((sum, bet) => sum + (bet.result !== 'pending' ? bet.stake : 0), 0);
    const yieldValue = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
    
    const concludedBets = bankroll.bets.filter(b => b.result !== 'pending');
    const successRate = concludedBets.length > 0 ? (concludedBets.filter(b => b.result === 'won').length / concludedBets.length) * 100 : 0;
    const suggestedBet = bankroll.currentCapital * 0.05;

    return (
        <div>
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Gestion Bankroll</h1>
                <div className="inline-block bg-gray-800/80 border border-yellow-500/50 rounded-full px-4 py-1.5 text-sm text-yellow-400 mt-4">
                   RISK MANAGEMENT: 5% ACTIVE
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <StatCard title="Bankroll Actuelle" value={`${bankroll.currentCapital.toFixed(2)}€`} subtext={`${bankroll.initialCapital.toFixed(2)}€ investis total`} color="text-white" roi={`${yieldValue.toFixed(1)}% ROI`} />
                <StatCard title="Profit / Perte" value={`${profit >= 0 ? '+' : ''}${profit.toFixed(2)}€`} subtext="Performance des paris" color={profit >= 0 ? 'text-green-400' : 'text-red-400'} />
                <StatCard title="Yield" value={`${yieldValue >= 0 ? '+' : ''}${yieldValue.toFixed(1)}%`} subtext="Rentabilité brute" color={yieldValue >= 0 ? 'text-green-400' : 'text-red-400'} />
                <StatCard title="Taux de réussite" value={`${successRate.toFixed(0)}%`} subtext={`${concludedBets.length} paris terminés`} color="text-white" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-brand-card border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-orange-400"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                           Ajouter un Pari Manuel
                        </h3>
                        <div className="bg-gray-900/50 border border-yellow-500/30 p-3 rounded-lg text-center mt-4">
                            <p className="text-xs font-semibold text-yellow-400">MISE SUGGÉRÉE (RISK MANAGEMENT 5%)</p>
                            <p className="text-2xl font-bold text-white mt-1">{suggestedBet.toFixed(2)}€</p>
                        </div>
                        <form onSubmit={handleAddBet} className="mt-4 space-y-4">
                             <div>
                                <label className="text-sm font-semibold text-brand-light-gray">Discipline Sportive</label>
                                <select value={newBetSport} onChange={e => setNewBetSport(e.target.value as Sport)} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500">
                                    <option value={Sport.Football}>Football</option>
                                    <option value={Sport.Basketball}>Basketball</option>
                                    <option value={Sport.Tennis}>Tennis</option>
                                </select>
                            </div>
                             <div>
                                <label className="text-sm font-semibold text-brand-light-gray">Équipes / Joueurs</label>
                                <input type="text" placeholder="Ex: Real Madrid vs Bayern" value={newBetMatch} onChange={e => setNewBetMatch(e.target.value)} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-brand-light-gray">Cote</label>
                                    <input type="number" step="0.01" min="1.01" placeholder="Ex: 1.85" value={newBetOdds} onChange={e => setNewBetOdds(e.target.value)} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-brand-light-gray">Mise (€)</label>
                                    <input type="number" step="0.01" min="0.01" placeholder={`Ex: ${suggestedBet.toFixed(2)}`} value={newBetStake} onChange={e => setNewBetStake(e.target.value)} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                            </div>
                             <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover">
                               AJOUTER LE PARI
                            </button>
                        </form>
                     </div>
                     <div className="bg-brand-card border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-green-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                           Approvisionner la Bankroll
                        </h3>
                        <p className="text-sm text-brand-light-gray mt-2">
                           Mettez à jour votre capital pour refléter un dépôt sur votre bookmaker.
                        </p>
                        <form onSubmit={handleFundBankroll} className="mt-4 space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-brand-light-gray">Montant à ajouter (€)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    min="0.01" 
                                    placeholder="Ex: 100" 
                                    value={fundAmount} 
                                    onChange={e => setFundAmount(e.target.value)}
                                    className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" 
                                />
                            </div>
                            <button type="submit" className="w-full rounded-md bg-gray-700 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-600">
                               APPROVISIONNER
                            </button>
                        </form>
                     </div>
                </div>
                 <div className="lg:col-span-2 bg-brand-card border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white">Historique des Paris</h3>
                     {bankroll.bets.length === 0 ? (
                         <div className="mt-6 flex items-center justify-center h-48 text-brand-light-gray">
                            <p>Aucun pari enregistré pour le moment.</p>
                        </div>
                     ) : (
                         <div className="mt-4 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">Match</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Mise</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Cote</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Statut</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {bankroll.bets.map(bet => (
                                                <tr key={bet.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                                                        <div className="font-medium text-white">{bet.match}</div>
                                                        <div className="text-gray-400">{bet.sport} - {bet.date}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{bet.stake.toFixed(2)}€</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{bet.odds.toFixed(2)}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        {bet.result === 'pending' ? (
                                                            <div className="flex space-x-2">
                                                                <button onClick={() => handleBetResult(bet.id, 'won')} className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-300 rounded-md hover:bg-green-400">Gagné</button>
                                                                <button onClick={() => handleBetResult(bet.id, 'lost')} className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-300 rounded-md hover:bg-red-400">Perdu</button>
                                                            </div>
                                                        ) : (
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bet.result === 'won' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                                                {bet.result === 'won' ? 'Gagné' : 'Perdu'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className={`whitespace-nowrap px-3 py-4 text-sm font-bold ${bet.profit > 0 ? 'text-green-400' : bet.profit < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                                                        {bet.profit >= 0 ? '+' : ''}{bet.profit.toFixed(2)}€
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default BankrollManagement;