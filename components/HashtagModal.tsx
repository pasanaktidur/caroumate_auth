import * as React from 'react';
import type { TFunction } from '../App';
import { Loader } from './Loader';

export const CaptionModal: React.FC<{
    topic: string;
    onClose: () => void;
    isLoading: boolean;
    caption: string;
    error: string | null;
    t: TFunction;
}> = ({ topic, onClose, isLoading, caption, error, t }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('captionModalTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
                </div>
                 <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{t('captionModalSubtitle1')}<span className="font-semibold">{topic}</span>{t('captionModalSubtitle2')}</p>
                <div className="flex-grow overflow-y-auto pr-2 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md whitespace-pre-wrap">
                     {isLoading ? (
                        <Loader text={t('generatingContentMessage')} />
                    ) : error ? (
                         <div className="text-red-600 dark:text-red-400">{error}</div>
                    ) : caption ? (
                        <p>{caption}</p>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('captionModalEmpty')}</div>
                    )}
                </div>
                {caption && !isLoading && (
                    <button onClick={handleCopy} className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                        {copied ? t('captionModalCopiedButton') : t('captionModalCopyButton')}
                    </button>
                )}
            </div>
        </div>
    );
};