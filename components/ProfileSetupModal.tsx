import * as React from 'react';
import type { UserProfile } from '../types';
import type { TFunction } from '../App';
import { TrashIcon, PlusIcon } from './icons';

export const ProfileSetupModal: React.FC<{ user: UserProfile, onSetupComplete: (profile: Omit<UserProfile, 'profileComplete'>) => void; t: TFunction; }> = ({ user, onSetupComplete, t }) => {
    const [name, setName] = React.useState(user.name || '');
    const [niches, setNiches] = React.useState<string[]>(user.niche?.length > 0 ? user.niche : ['']);
    
    const handleNicheChange = (index: number, value: string) => {
        const newNiches = [...niches];
        newNiches[index] = value;
        setNiches(newNiches);
    };

    const handleAddNiche = () => {
        setNiches([...niches, '']);
    };

    const handleRemoveNiche = (index: number) => {
        if (niches.length > 1) {
            const newNiches = niches.filter((_, i) => i !== index);
            setNiches(newNiches);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSetupComplete({ ...user, name, niche: niches });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-lg w-full m-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('profileTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t('profileSubtitle')}</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileNameLabel')}</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileNicheLabel')}</label>
                         <div className="space-y-2 mt-1">
                            {niches.map((niche, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={niche}
                                        onChange={e => handleNicheChange(index, e.target.value)}
                                        required
                                        placeholder={t('profileNichePlaceholder')}
                                        className="block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {niches.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveNiche(index)} className="p-2 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddNiche} className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                            <PlusIcon className="w-4 h-4 mr-1" />
                            {t('profileAddNiche')}
                        </button>
                    </div>
                    <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        {t('profileButton')}
                    </button>
                </form>
            </div>
        </div>
    );
};
