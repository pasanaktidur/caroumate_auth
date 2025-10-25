import * as React from 'react';
import { InstagramIcon, ThreadsIcon } from './icons';

export const Footer: React.FC = () => (
    <footer className="hidden md:block bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} CarouMate. All rights reserved.</p>
                <div className="flex items-center space-x-4">
                   <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <InstagramIcon className="h-6 w-6" />
                    </a>
                    <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <ThreadsIcon className="h-6 w-6" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);
