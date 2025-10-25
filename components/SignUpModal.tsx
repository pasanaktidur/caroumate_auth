import * as React from 'react';
import type { TFunction } from '../App';
import { LogoIcon, GoogleIcon, EyeIcon, EyeSlashIcon, CloseIcon } from './icons';

export const SignUpModal: React.FC<{
    onClose: () => void;
    onSignUp: (formData: any) => void;
    onSwitchToSignIn: () => void;
    onSignInWithGoogle: () => void;
    t: TFunction;
    error: string | null;
}> = ({ onClose, onSignUp, onSwitchToSignIn, onSignInWithGoogle, t, error }) => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignUp({ name: `${firstName} ${lastName}`.trim(), username, email, password });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <CloseIcon className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center">
                    <LogoIcon className="h-10 w-auto mb-4" />
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t('signUpTitle')}</h2>
                    <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">{t('signUpSubtitle')}</p>
                </div>
                
                <div className="mt-8 space-y-6">
                    <button onClick={onSignInWithGoogle} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <GoogleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('continueWithGoogle')}</span>
                    </button>

                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-500 dark:text-gray-400">{t('orDivider')}</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                                    <span>{t('firstNameLabel')}</span>
                                    <span className="text-gray-500">{t('optionalLabel')}</span>
                                </label>
                                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                                    <span>{t('lastNameLabel')}</span>
                                    <span className="text-gray-500">{t('optionalLabel')}</span>
                                </label>
                                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('usernameLabel')}</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('emailLabel')}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('passwordLabel')}</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                        )}

                        <button type="submit" className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            {t('continueButton')} <span className="text-lg">▸</span>
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('alreadyHaveAccount')}{' '}
                        <button onClick={onSwitchToSignIn} className="font-medium text-primary-600 hover:underline">
                            {t('signIn')}
                        </button>
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};