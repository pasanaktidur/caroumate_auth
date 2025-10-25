import * as React from 'react';
import type { TFunction } from '../App';
import { SparklesIcon, SettingsIcon, DownloadIcon } from './icons';

const SampleCarouselPreview: React.FC = () => {
    const slideStyle = "h-[200px] sm:h-[250px] w-[160px] sm:w-[200px] flex-shrink-0 relative flex flex-col justify-center items-center p-4 text-center rounded-lg shadow-lg";

    return (
        <div className="relative mx-auto w-full max-w-md">
            {/* Phone Mockup */}
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[450px] w-[220px] sm:h-[550px] sm:w-[270px] shadow-2xl shadow-primary-600/30">
                <div className="w-[72px] h-[4px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[48px] w-[3px] bg-gray-800 absolute -right-[17px] top-[140px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-primary-950">
                    {/* Carousel Preview inside phone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4">
                        {/* Slide 1 */}
                        <div className={`${slideStyle} bg-gold-500 text-white font-poppins z-10 -translate-x-8 -rotate-12`}>
                            <h2 className="font-bold text-lg leading-tight">Unlock Your Potential</h2>
                            <p className="text-xs mt-2">5 Mindset Shifts for Success</p>
                        </div>
                        {/* Slide 2 */}
                        <div className={`${slideStyle} bg-white text-gray-900 font-sans z-20`}>
                            <SparklesIcon className="w-10 h-10 text-primary-500 mb-3" />
                            <h2 className="font-bold text-xl leading-tight">CarouMate AI</h2>
                            <p className="text-xs mt-2">Stunning carousels, instantly.</p>
                        </div>
                         {/* Slide 3 */}
                        <div className={`${slideStyle} bg-accent-500 text-white font-montserrat z-10 translate-x-8 rotate-12`}>
                             <h2 className="font-bold text-lg leading-tight">Swipe to Learn →</h2>
                            <p className="text-xs mt-2">Your guide to going viral.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LandingPageHeader: React.FC<{ onSignUpClick: () => void; onSignInClick: () => void, t: TFunction }> = ({ onSignUpClick, onSignInClick, t }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-20">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-8 h-8 text-primary-600" />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">CarouMate</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={onSignInClick} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            {t('signIn')}
                        </button>
                         <button onClick={onSignUpClick} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-50 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors">
                            {t('signUp')}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export const LoginScreen: React.FC<{ onSignUpClick: () => void; onSignInClick: () => void; t: TFunction; error: string | null; }> = ({ onSignUpClick, onSignInClick, t, error }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-950">
            <LandingPageHeader onSignUpClick={onSignUpClick} onSignInClick={onSignInClick} t={t} />
            <main>
                {/* Hero Section */}
                <div className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-white dark:from-gray-900 via-gray-50 dark:via-gray-950 to-white dark:to-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-16">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                                <h1>
                                    <span className="block text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">{t('heroTagline')}</span>
                                    <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                                        <span className="text-gray-900 dark:text-white">{t('heroTitle1')}</span>
                                        <span className="text-primary-600 dark:text-primary-400"> {t('heroTitle2')}</span>
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                    {t('loginSubtitle')}
                                </p>
                                {error && (
                                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-md">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200 text-center sm:text-left">
                                            {error}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:mx-0 lg:text-left">
                                    <button
                                        onClick={onSignUpClick}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:ring-offset-gray-950 focus:ring-primary-500 shadow-lg shadow-primary-600/40 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                       {t('loginButton')}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                                <SampleCarouselPreview />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">{t('featuresTitle')}</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                {t('featuresSubtitle')}
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                                {t('featuresDescription')}
                            </p>
                        </div>

                        <div className="mt-12">
                            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                <div className="relative transition-transform transform hover:scale-105 duration-300 p-4">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                            <SparklesIcon className="h-6 w-6" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{t('feature1Title')}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                        {t('feature1Description')}
                                    </dd>
                                </div>
                                <div className="relative transition-transform transform hover:scale-105 duration-300 p-4">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                            <SettingsIcon className="h-6 w-6" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{t('feature2Title')}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                        {t('feature2Description')}
                                    </dd>
                                </div>
                                <div className="relative transition-transform transform hover:scale-105 duration-300 p-4">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                            <DownloadIcon className="h-6 w-6" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{t('feature3Title')}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                        {t('feature3Description')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};