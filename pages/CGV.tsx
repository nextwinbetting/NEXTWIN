
import React from 'react';
import { Language, Page } from '../types';
import { CGVIllustration } from '../components/CGVIllustration';

interface CGVProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const CGVSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="space-y-3 text-brand-light-gray leading-relaxed">{children}</div>
    </div>
);

const CGV: React.FC<CGVProps> = ({ language, onNavigate }) => {
    // For now, the text is only in French.
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <CGVIllustration className="w-40 h-40" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">Conditions Générales de Vente</h1>
                    <p className="mt-4 text-lg text-brand-light-gray">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <div className="mt-12 bg-brand-card border border-gray-800 rounded-2xl p-8 sm:p-12">
                    <p className="text-brand-light-gray">Les présentes conditions générales de vente (ci-après "CGV") régissent l'utilisation des services proposés par NEXTWIN Digital Technologies LLC sur le site NEXTWIN (ci-après "le Site").</p>

                    <CGVSection title="Article 1 : Objet">
                        <p>Les présentes CGV ont pour objet de définir les conditions dans lesquelles les utilisateurs (ci-après "l'Utilisateur") peuvent accéder et utiliser les services payants proposés par le Site, notamment l'accès aux pronostics générés par l'IA, à l'analyseur de match et à l'outil de gestion de bankroll (ci-après "le Service").</p>
                    </CGVSection>

                    <CGVSection title="Article 2 : Accès au Service">
                        <p>L'accès au Service est subordonné à la création d'un compte utilisateur et à la souscription d'un abonnement payant. L'Utilisateur doit être une personne physique majeure et juridiquement capable. Le Service est destiné à un usage strictement personnel et non commercial.</p>
                    </CGVSection>

                    <CGVSection title="Article 3 : Abonnement">
                        <p>Le Service est proposé sous la forme d'un abonnement mensuel ("Pass NextWin Pro"). L'abonnement est sans engagement de durée et est reconduit tacitement chaque mois à sa date anniversaire. L'Utilisateur peut résilier son abonnement à tout moment depuis son espace "Profil". La résiliation prendra effet à la fin de la période de facturation en cours.</p>
                    </CGVSection>

                    <CGVSection title="Article 4 : Prix et Modalités de Paiement">
                        <p>Le prix de l'abonnement est indiqué en euros toutes taxes comprises sur la page "Nous Rejoindre". NEXTWIN Digital Technologies LLC se réserve le droit de modifier ses tarifs. Le cas échéant, les Utilisateurs seront informés par courrier électronique au moins 30 jours avant l'entrée en vigueur des nouveaux tarifs.</p>
                        <p>Le paiement s'effectue par carte bancaire via la plateforme sécurisée Stripe. L'abonnement est payable d'avance pour la période à venir.</p>
                    </CGVSection>

                    <CGVSection title="Article 5 : Absence de Droit de Rétractation">
                        <p>Conformément à la législation en vigueur pour la fourniture de contenu numérique non fourni sur un support matériel, l'Utilisateur reconnaît et accepte expressément que l'exécution du Service commence dès la validation de son paiement. En conséquence, l'Utilisateur renonce expressément à son droit de rétractation.</p>
                    </CGVSection>

                     <CGVSection title="Article 6 : Responsabilité et Avertissement">
                        <p>Le Service fourni par NEXTWIN est un outil d'aide à la décision basé sur des analyses algorithmiques. Il ne constitue en aucun cas un conseil en investissement, une garantie de gain ou une incitation à parier.</p>
                        <p>L'Utilisateur reconnaît que les paris sportifs impliquent des risques de perte financière. NEXTWIN Digital Technologies LLC ne pourra en aucun cas être tenue responsable des pertes subies par l'Utilisateur. Il est de la seule responsabilité de l'Utilisateur de jouer de manière modérée et responsable.</p>
                         <p className="border-l-4 border-orange-500 pl-4 text-gray-400">
                            Les jeux d’argent et de hasard sont interdits aux mineurs. Jouer comporte des risques : endettement, isolement, dépendance. Pour être aidé, appelez le 09-74-75-13-13 (appel non surtaxé).
                        </p>
                    </CGVSection>

                    <CGVSection title="Article 7 : Modification des CGV">
                        <p>NEXTWIN Digital Technologies LLC se réserve le droit de modifier les présentes CGV à tout moment. Les nouvelles conditions seront portées à la connaissance de l'Utilisateur par notification sur le Site ou par e-mail. L'Utilisateur est réputé avoir accepté la version en vigueur des CGV à chaque utilisation du Service.</p>
                    </CGVSection>

                    <CGVSection title="Article 8 : Droit Applicable">
                         <p>Les présentes CGV sont soumises au droit des Émirats Arabes Unis. Tout litige relatif à leur interprétation et/ou à leur exécution relève de la compétence exclusive des tribunaux de Dubaï.</p>
                    </CGVSection>
                </div>
            </div>
        </div>
    );
};

export default CGV;