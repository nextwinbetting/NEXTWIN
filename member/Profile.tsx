
import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Mon Profil</h1>
            <p className="mt-4 text-lg text-brand-light-gray">
                Mettez à jour vos informations personnelles et votre mot de passe.
            </p>
            <div className="mt-12 bg-brand-card border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto text-left">
                <form className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">Nom d'utilisateur</label>
                        <input type="text" defaultValue="JohnDoe" className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-brand-light-gray">Adresse e-mail</label>
                        <input type="email" defaultValue="john.doe@email.com" className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-brand-light-gray">Nouveau mot de passe</label>
                        <input type="password" placeholder="Laisser vide pour ne pas changer" className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                     <div className="pt-4">
                         <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover">
                           Mettre à jour le profil
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
