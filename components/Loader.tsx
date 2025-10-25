import * as React from 'react';
import { LoaderIcon } from './icons';

export const Loader: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <LoaderIcon className="w-24 h-24" />
        <p className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
    </div>
);
