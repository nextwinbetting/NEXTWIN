
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface SubscriptionProps {
    isSubscribed: boolean;
    onSubscribe: () => void;
    language: Language;
}

const CheckIcon: React.FC = () => (
    <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

const Subscription: React.FC<SubscriptionProps> = ({ isSubscribed, onSubscribe, language }) => {
    const t = translations[language];

    if (isSubscribed) {
        return (
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Gérer l'Abonnement</h1>
                <p className="mt-4 text-lg text-brand-light-gray">
                    Gérez votre abonnement Pro en toute simplicité.
                </p>
                <div className="mt-12 bg-brand-card border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">Pass NextWin Pro</h2>
                            <p className="text-green-400">Statut : Actif</p>
                        </div>
                        <p className="text-2xl font-bold text-white">12,99€ / mois</p>
                    </div>
                    <div className="mt-6 border-t border-gray-700 pt-6 text-left space-y-2 text-brand-light-gray">
                       <p>Prochain renouvellement le : <strong>01/03/2026</strong></p>
                       <p>Moyen de paiement : <strong>Visa **** 4242</strong></p>
                    </div>
                    <div className="mt-6 flex space-x-4">
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-md transition-colors">Changer de moyen de paiement</button>
                        <button className="flex-1 bg-red-800 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition-colors">Résilier l'abonnement</button>
                    </div>
                     <p className="mt-4 text-xs text-gray-500">La résiliation est immédiate et sans frais.</p>
                </div>
            </div>
        );
    }

    return (
         <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Mon Abonnement</h1>
             <p className="mt-4 text-lg text-brand-light-gray">
                Statut actuel: <span className="font-bold text-red-400">Inactif</span>. Passez Pro pour accéder à tous les outils.
            </p>

            <div className="mt-8 flex justify-center">
                 <div className="max-w-md w-full bg-brand-card border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
                    <div className="relative z-10 text-center">
                        <span className="inline-block bg-gray-800 text-sm font-semibold text-transparent bg-clip-text bg-gradient-brand px-3 py-1 rounded-full">{t.join_pass}</span>
                        <h2 className="mt-4 text-5xl font-bold text-white">12,99€<span className="text-2xl text-brand-light-gray"> {t.join_price}</span></h2>
                        <p className="mt-2 text-sm text-yellow-400 bg-yellow-900/50 inline-block px-3 py-1 rounded-full">{t.join_commitment}</p>
                        <ul className="text-left mt-8 space-y-3 text-brand-light-gray">
                            <li className="flex items-center"><CheckIcon /><span className="ml-3">{t.join_feature_list_1}</span></li>
                            <li className="flex items-center"><CheckIcon /><span className="ml-3">{t.join_feature_list_2}</span></li>
                            <li className="flex items-center"><CheckIcon /><span className="ml-3">{t.join_feature_list_3}</span></li>
                        </ul>
                        <button onClick={onSubscribe} className="mt-8 w-full rounded-md bg-gradient-brand px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105">
                            {t.join_cta}
                        </button>
                        <p className="mt-4 text-xs text-gray-500">{t.join_info}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;