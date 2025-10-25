import * as React from 'react';
import type { UserProfile, Language } from '../types';
import type { TFunction } from '../App';
import { SparklesIcon, SettingsIcon, GiftIcon, LogoutIcon, MoonIcon, SunIcon } from './icons';

export const Header: React.FC<{
    user: UserProfile | null;
    onLogout: () => void;
    onDashboard: () => void;
    onOpenSettings: () => void;
    language: Language;
    onLanguageChange: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    t: TFunction;
}> = ({ user, onLogout, onDashboard, onOpenSettings, language, onLanguageChange, theme, onToggleTheme, t }) => (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm dark:shadow-gray-700/[.5] sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={onDashboard}>
                    <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">CarouMate</h1>
                </div>
                {user && (
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        <span className="text-gray-600 dark:text-gray-400 hidden md:block">{t('welcome', { name: user.name.split(' ')[0] })}</span>
                        <button
                            onClick={onLanguageChange}
                            className="p-2 w-10 text-center text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors font-semibold"
                            aria-label={t('languageAriaLabel')}
                        >
                            {language === 'en' ? 'ID' : 'EN'}
                        </button>
                         <button
                            onClick={onToggleTheme}
                            className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors"
                            aria-label={t('toggleThemeAriaLabel')}
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={onOpenSettings}
                            className="hidden md:inline-block p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors"
                            aria-label={t('settingsAriaLabel')}
                        >
                            <SettingsIcon className="w-5 h-5" />
                        </button>
                        <a
                            href="http://lynk.id/pasanaktidur/s/re2yoep3v6r0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center text-sm font-medium text-accent-700 dark:text-accent-300 bg-accent-100 dark:bg-accent-900/50 border border-transparent rounded-md hover:bg-accent-200 dark:hover:bg-accent-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 transition-colors px-4 py-2"
                            aria-label={t('donate')}
                        >
                            <GiftIcon className="w-5 h-5 mr-2" />
                            {t('donate')}
                        </a>
                        <button
                            onClick={onLogout}
                            className="text-sm font-medium text-primary-600 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 border border-transparent rounded-md hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors sm:px-4 sm:py-2 p-2"
                            aria-label={t('logout')}
                        >
                            <span className="hidden sm:inline">{t('logout')}</span>
                            <LogoutIcon className="sm:hidden w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </header>
);
