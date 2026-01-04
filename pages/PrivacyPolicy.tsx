
import React from 'react';
import { Language, Page } from '../types';
import { PrivacyIllustration } from '../components/PrivacyIllustration';

interface PrivacyPolicyProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const PrivacySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="space-y-3 text-brand-light-gray leading-relaxed">{children}</div>
    </div>
);

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ language, onNavigate }) => {
    // For now, the text is only in French.
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <PrivacyIllustration className="w-40 h-40" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">Politique de Confidentialité</h1>
                    <p className="mt-4 text-lg text-brand-light-gray">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <div className="mt-12 bg-brand-card border border-gray-800 rounded-2xl p-8 sm:p-12">
                    <PrivacySection title="Préambule">
                        <p>NEXTWIN Digital Technologies LLC s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons, et quels sont vos droits concernant vos données personnelles lorsque vous utilisez le site NEXTWIN (ci-après "le Site").</p>
                    </PrivacySection>

                    <PrivacySection title="Article 1 : Responsable du Traitement">
                        <p>Le responsable du traitement de vos données personnelles est NEXTWIN Digital Technologies LLC, dont les coordonnées sont disponibles dans nos <button onClick={() => onNavigate(Page.Legal)} className="text-orange-400 hover:underline">Mentions Légales</button>.</p>
                    </PrivacySection>

                    <PrivacySection title="Article 2 : Données Collectées">
                        <p>Nous collectons différentes catégories de données :</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Données d'identification :</strong> Nom d'utilisateur et adresse e-mail que vous fournissez lors de la création de votre compte.</li>
                            <li><strong>Données de paiement :</strong> Les informations de paiement sont traitées directement par notre partenaire sécurisé Stripe. Nous ne stockons jamais vos informations de carte bancaire sur nos serveurs.</li>
                            <li><strong>Données d'utilisation :</strong> Informations sur la manière dont vous interagissez avec nos services (pages visitées, fonctionnalités utilisées) à des fins d'amélioration du service. Ces données sont autant que possible anonymisées.</li>
                            <li><strong>Données de communication :</strong> Le contenu de vos échanges avec notre support client.</li>
                        </ul>
                    </PrivacySection>

                    <PrivacySection title="Article 3 : Finalités du Traitement">
                        <p>Vos données sont utilisées pour les finalités suivantes :</p>
                         <ul className="list-disc list-inside space-y-2">
                            <li>Fournir, gérer et maintenir nos services, y compris la gestion de votre compte et de votre abonnement.</li>
                            <li>Améliorer la pertinence de nos algorithmes et l'expérience utilisateur sur le Site.</li>
                            <li>Communiquer avec vous, notamment pour répondre à vos demandes de support et vous informer des mises à jour importantes du service.</li>
                            <li>Assurer la sécurité de notre plateforme et prévenir les fraudes.</li>
                        </ul>
                        <p>Nous ne vendons, ni ne louons, ni ne partageons vos données personnelles à des tiers à des fins de marketing sans votre consentement explicite.</p>
                    </PrivacySection>

                    <PrivacySection title="Article 4 : Sécurité des Données">
                        <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l'accès, la modification, la divulgation ou la destruction non autorisés. Cela inclut l'utilisation du cryptage SSL et le choix de partenaires reconnus pour leur haut niveau de sécurité (Stripe, Vercel).</p>
                    </PrivacySection>

                    <PrivacySection title="Article 5 : Vos Droits">
                        <p>Conformément à la réglementation applicable, vous disposez des droits suivants concernant vos données personnelles :</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Droit d'accès, de rectification et d'effacement de vos données.</li>
                            <li>Droit à la limitation du traitement.</li>
                            <li>Droit à la portabilité de vos données.</li>
                            <li>Droit d'opposition au traitement de vos données.</li>
                        </ul>
                        <p>Pour exercer ces droits, vous pouvez nous contacter à l'adresse <a href="mailto:legal@nextwin.ai" className="text-orange-400 hover:underline">legal@nextwin.ai</a>.</p>
                    </PrivacySection>

                    <PrivacySection title="Article 6 : Cookies">
                        <p>Le Site utilise des cookies essentiels au bon fonctionnement du service (par exemple, pour maintenir votre session de connexion). Nous utilisons également des cookies de performance anonymes pour analyser l'utilisation du Site afin de l'améliorer. Vous pouvez gérer l'utilisation des cookies via les paramètres de votre navigateur.</p>
                    </PrivacySection>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;