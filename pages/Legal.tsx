
import React from 'react';
import { Language, Page } from '../App';
import { LegalIllustration } from '../components/LegalIllustration';

interface LegalProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="space-y-3 text-brand-light-gray leading-relaxed">{children}</div>
    </div>
);

const Legal: React.FC<LegalProps> = ({ language, onNavigate }) => {
    // For now, the text is only in French as requested.
    // A real implementation would use the 'language' prop and translations.
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <LegalIllustration className="w-40 h-40" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">Mentions Légales</h1>
                    <p className="mt-4 text-lg text-brand-light-gray">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <div className="mt-12 bg-brand-card border border-gray-800 rounded-2xl p-8 sm:p-12">
                    <LegalSection title="1. Éditeur du Site">
                        <p>Le site web NEXTWIN (ci-après "le Site"), accessible à l'adresse [URL du site], est édité par :</p>
                        <p className="font-semibold text-white">NEXTWIN Digital Technologies LLC</p>
                        <address className="not-italic">
                            Innovation Tower, Tech District<br />
                            Sheikh Zayed Road, Dubai<br />
                            United Arab Emirates
                        </address>
                        <p>
                            Adresse de courrier électronique : <a href="mailto:legal@nextwin.ai" className="text-orange-400 hover:underline">legal@nextwin.ai</a>
                        </p>
                    </LegalSection>

                    <LegalSection title="2. Hébergement">
                        <p>Le Site est hébergé par Vercel Inc., dont le siège social est situé :</p>
                        <address className="not-italic">
                            340 S Lemon Ave #4133<br />
                            Walnut, CA 91789<br />
                            United States of America
                        </address>
                    </LegalSection>

                    <LegalSection title="3. Propriété Intellectuelle">
                        <p>
                            L'ensemble des éléments constituant le Site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) ainsi que le Site lui-même, relèvent des législations internationales sur le droit d'auteur et sur les droits voisins.
                        </p>
                        <p>
                            Tous ces éléments sont la propriété exclusive de NEXTWIN Digital Technologies LLC, hormis les éléments réalisés par des intervenants extérieurs au Site n'ayant pas cédé leurs droits d'auteur.
                        </p>
                    </LegalSection>

                    <LegalSection title="4. Limitation de Responsabilité">
                        <p>
                            NEXTWIN est un outil d'aide à la décision basé sur des analyses algorithmiques et des données statistiques. Les informations et pronostics fournis sur le Site ne sauraient en aucun cas constituer un conseil en investissement financier ou une incitation à parier.
                        </p>
                        <p>
                            L'utilisateur reconnaît que les paris sportifs comportent des risques de perte en capital. NEXTWIN Digital Technologies LLC ne pourra être tenue responsable des pertes financières subies par l'utilisateur suite à l'utilisation des informations présentes sur le Site. Il est de la responsabilité de chaque utilisateur de jouer de manière modérée et responsable.
                        </p>
                        <p className="border-l-4 border-orange-500 pl-4 text-gray-400">
                            Les jeux d’argent et de hasard sont interdits aux mineurs. Jouer comporte des risques : endettement, isolement, dépendance. Pour être aidé, appelez le 09-74-75-13-13 (appel non surtaxé).
                        </p>
                    </LegalSection>

                     <LegalSection title="5. Protection des Données Personnelles">
                        <p>
                            Pour toute information concernant la collecte et le traitement de vos données personnelles, nous vous invitons à consulter notre{' '}
                            <button onClick={() => onNavigate(Page.PrivacyPolicy)} className="text-orange-400 hover:underline">
                                Politique de Confidentialité
                            </button>.
                        </p>
                    </LegalSection>

                    <LegalSection title="6. Droit Applicable et Juridiction">
                        <p>
                            Les présentes mentions légales sont régies par le droit des Émirats Arabes Unis. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents de Dubaï.
                        </p>
                    </LegalSection>
                </div>
            </div>
        </div>
    );
};

export default Legal;
