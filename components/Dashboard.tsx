import * as React from 'react';
import type { Carousel } from '../types';
import type { TFunction } from '../App';
import { SparklesIcon, TrashIcon } from './icons';

export const Dashboard: React.FC<{
    onNewCarousel: () => void;
    onShowTutorial: () => void;
    history: Carousel[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onClearHistory: () => void;
    t: TFunction;
    downloadCount: number;
    mostUsedCategory: string;
}> = ({ onNewCarousel, onShowTutorial, history, onEdit, onDelete, onClearHistory, t, downloadCount, mostUsedCategory }) => (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{t('dashboardTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('dashboardSubtitle')}</p>
            </div>
            <div className="flex w-full sm:w-auto space-x-4">
                <button onClick={onShowTutorial} className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    {t('tutorialButton')}
                </button>
                <button onClick={onNewCarousel} className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-600/40 hover:shadow-xl hover:shadow-primary-500/40 transition-shadow">
                    <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                    {t('newCarouselButton')}
                </button>
            </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('statsTotalCarousels')}</h4><p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{history.length}</p></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('statsDownloads')}</h4><p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{downloadCount}</p></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('statsMostUsedCategory')}</h4><p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{mostUsedCategory}</p></div>
        </div>

        {/* History Section */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('historyTitle')}</h3>
                {history.length > 0 && (
                     <button 
                        onClick={onClearHistory} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-800/50 dark:hover:bg-red-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    >
                        <TrashIcon className="w-4 h-4 mr-2"/>
                        {t('clearAllHistoryButton')}
                    </button>
                )}
            </div>
            {history.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {history.map(c => (
                            <li key={c.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-lg font-semibold text-primary-700 dark:text-primary-400">{c.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-4 self-end sm:self-center">
                                    <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50 rounded-full">{c.category}</span>
                                    <button
                                        onClick={() => onEdit(c.id)}
                                        className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors"
                                    >
                                        {t('historyEditButton')}
                                    </button>
                                    <button
                                        onClick={() => onDelete(c.id)}
                                        className="p-2 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                        aria-label={t('deleteAriaLabel')}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-gray-500 dark:text-gray-400">{t('historyEmpty')}</p>
                    <p className="text-gray-500 dark:text-gray-400">{t('historyEmptyHint')}</p>
                </div>
            )}
        </div>
    </div>
);
