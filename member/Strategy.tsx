import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

const StrategySection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b-2 border-orange-500/30 inline-block">{title}</h2>
        <div className="space-y-4 text-brand-light-gray leading-relaxed">{children}</div>
    </div>
);

const RuleCard: React.FC<{ title: string; description: string; rules?: string[]; icon: React.ReactNode; }> = ({ title, description, rules, icon }) => (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-brand text-white">
                {icon}
            </div>
            <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">{description}</p>
        {rules && (
            <ul className="mt-3 space-y-2 text-sm">
                {rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 h-4 w-4 text-red-500 mt-1 mr-2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>{rule}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const Strategy: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.strategy_title}</h1>
                <p className="mt-4 text-lg text-brand-light-gray">
                    {t.strategy_subtitle}
                </p>
            </div>

            <div className="mt-12 bg-brand-card border border-gray-800 rounded-2xl p-6 sm:p-10">
                <StrategySection title={t.strategy_s1_title}>
                    <p>{t.strategy_s1_desc}</p>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <RuleCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
                            title={t.strategy_s1_c1_title}
                            description={t.strategy_s1_c1_desc}
                        />
                         <RuleCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>}
                            title={t.strategy_s1_c2_title}
                            description={t.strategy_s1_c2_desc}
                            rules={[t.strategy_s1_c2_rule1, t.strategy_s1_c2_rule2]}
                        />
                    </div>
                </StrategySection>

                <StrategySection title={t.strategy_s2_title}>
                    <p>{t.strategy_s2_desc}</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                        <li>{t.strategy_s2_item1}</li>
                        <li>{t.strategy_s2_item2}</li>
                    </ul>
                </StrategySection>

                <StrategySection title={t.strategy_s3_title}>
                    <p>{t.strategy_s3_desc}</p>
                     <ul className="list-disc list-inside space-y-2 mt-4">
                        <li>{t.strategy_s3_item1}</li>
                        <li>{t.strategy_s3_item2}</li>
                    </ul>
                </StrategySection>

                <StrategySection title={t.strategy_s4_title}>
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                        <div className="grid sm:grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-sm text-gray-400">{t.strategy_s4_start_bk}</p>
                                <p className="text-2xl font-bold text-white">1000 €</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{t.strategy_s4_stake_calc}</p>
                                <p className="text-2xl font-bold text-orange-400">50 €</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">{t.strategy_s4_new_bk}</p>
                                <p className="text-2xl font-bold text-green-400">1007.50 €</p>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-gray-700 pt-6">
                            <h4 className="font-semibold text-white text-center">{t.strategy_s4_scenario}</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li className="flex justify-between p-2 rounded-md bg-green-900/30"><span>{t.strategy_s4_s_item1}</span> <span className="font-bold text-green-400">+30.00 €</span></li>
                                <li className="flex justify-between p-2 rounded-md bg-green-900/30"><span>{t.strategy_s4_s_item2}</span> <span className="font-bold text-green-400">+27.50 €</span></li>
                                <li className="flex justify-between p-2 rounded-md bg-red-900/30"><span>{t.strategy_s4_s_item3}</span> <span className="font-bold text-red-400">-50.00 €</span></li>
                            </ul>
                            <div className="mt-4 text-center font-bold text-lg flex items-center justify-center">
                                <span>{t.strategy_s4_profit} : </span>
                                <span className="ml-2 text-green-400">{t.strategy_s4_profit_value}</span>
                            </div>
                        </div>
                         <p className="mt-4 text-center text-xs text-gray-500">{t.strategy_s4_conclusion}</p>
                    </div>
                </StrategySection>

                <StrategySection title={t.strategy_s5_title}>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[t.strategy_s5_item1, t.strategy_s5_item2, t.strategy_s5_item3, t.strategy_s5_item4, t.strategy_s5_item5].map((item, index) => (
                             <div key={index} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 h-5 w-5 text-green-400 mr-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </StrategySection>
                
                <div className="mt-12 border-t border-gray-800 pt-6">
                     <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-center">
                        <h3 className="font-bold text-red-400">{t.strategy_s6_title}</h3>
                        <p className="mt-2 text-sm text-gray-300">{t.strategy_s6_desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Strategy;