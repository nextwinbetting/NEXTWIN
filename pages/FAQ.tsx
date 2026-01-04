
import React, { useState } from 'react';
import { FaqItem, Language } from '../types';
import { translations } from '../translations';
import { FAQIllustration } from '../components/FAQIllustration';

interface AccordionItemProps {
    item: FaqItem;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick }) => (
    <div className="border-b border-gray-800 last:border-b-0">
        <h2>
            <button
                type="button"
                className="flex justify-between items-center w-full py-5 px-1 font-semibold text-left text-white text-base hover:text-orange-400 transition-colors duration-300"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="flex-1 pr-4">{item.question}</span>
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-full">
                    <svg className={`w-4 h-4 shrink-0 transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </button>
        </h2>
        <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <div className="pb-5 px-1">
                    <p className="text-brand-light-gray leading-relaxed text-sm">{item.answer}</p>
                </div>
            </div>
        </div>
    </div>
);

interface FaqCategory {
    name: string;
    icon: React.ReactNode;
    questions: FaqItem[];
}

const FAQ: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    const faqData: FaqCategory[] = [
        {
            name: "Général",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
            questions: [
                { question: t.faq_q1, answer: t.faq_a1 },
                { question: "Quels sports sont couverts par NEXTWIN ?", answer: "Actuellement, notre IA est spécialisée et entraînée pour le Football, le Basketball et le Tennis. Nous travaillons constamment à l'amélioration de nos modèles et pourrions ajouter de nouveaux sports à l'avenir en fonction de la demande et de la fiabilité des données disponibles." },
                { question: t.faq_q5, answer: t.faq_a5 },
            ],
        },
        {
            name: "Technologie & Fiabilité",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 .5-.1 1-.2 1.5"/><path d="m2.5 15.2.7-1.4.7 1.4"/><path d="M2.5 19h2.8"/><path d="M12 22a10 10 0 0 0 10-10c0-.5.1-1 .2-1.5"/><path d="m21.5 8.8-.7 1.4-.7-1.4"/><path d="M21.5 5h-2.8"/></svg>,
            questions: [
                { question: "Pourquoi un seuil de probabilité de 70% ?", answer: "Ce seuil est le résultat de tests rigoureux. Il représente un équilibre optimal entre la quantité d'opportunités de qualité et un taux de réussite élevé. En dessous de ce seuil, la volatilité augmente considérablement. Nous préférons fournir moins de pronostics, mais plus fiables." },
                { question: t.faq_q2, answer: t.faq_a2 },
                { question: "Puis-je faire confiance à 100% à l'IA ?", answer: "Aucun système prédictif n'est infaillible. Le sport contient une part d'incertitude que même la meilleure IA ne peut éliminer. NEXTWIN est un outil puissant d'aide à la décision conçu pour vous donner un avantage statistique. Il doit être utilisé en complément d'une gestion de bankroll rigoureuse et d'un esprit critique." },
            ],
        },
        {
            name: "Abonnement & Compte",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            questions: [
                { question: t.faq_q3, answer: t.faq_a3 },
                { question: t.faq_q4, answer: t.faq_a4 },
                { question: "Comment puis-je mettre à jour mes informations de paiement ?", answer: "Vous pouvez gérer vos informations de paiement, consulter vos factures et gérer votre abonnement directement depuis la section 'Abonnement' de votre tableau de bord une fois connecté." },
            ],
        },
    ];

    const [activeCategory, setActiveCategory] = useState(faqData[0].name);
    const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
    
    const currentCategory = faqData.find(c => c.name === activeCategory);

    const handleCategoryClick = (categoryName: string) => {
        setActiveCategory(categoryName);
        setOpenQuestionIndex(0); // Open the first question of the new category
    };
    
    const handleToggle = (index: number) => {
        setOpenQuestionIndex(openQuestionIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
             <div className="relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">
                        {t.faq_title}
                    </h1>
                    <p className="mt-4 text-lg text-brand-light-gray">
                        {t.faq_subtitle}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mt-12 flex justify-center">
                    <FAQIllustration className="w-full h-auto max-w-lg" />
                </div>
                
                <div className="mt-12 max-w-5xl mx-auto bg-brand-card border border-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Categories Navigation */}
                        <div className="md:col-span-1">
                             <div className="space-y-2 sticky top-24">
                                {faqData.map(category => (
                                    <button 
                                        key={category.name}
                                        onClick={() => handleCategoryClick(category.name)}
                                        className={`relative w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-300 ${activeCategory === category.name ? 'bg-gray-800/80 text-white' : 'text-brand-light-gray hover:bg-gray-800/50 hover:text-white'}`}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-brand transition-transform duration-300 ${activeCategory === category.name ? 'scale-y-100' : 'scale-y-0'}`}></div>
                                        <div className="flex-shrink-0">{category.icon}</div>
                                        <span className="font-semibold text-sm">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Questions Accordion */}
                        <div className="md:col-span-3">
                             <div className="px-2">
                                {currentCategory && currentCategory.questions.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        item={item}
                                        isOpen={openQuestionIndex === index}
                                        onClick={() => handleToggle(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;