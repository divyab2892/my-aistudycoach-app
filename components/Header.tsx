
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
    navigateTo: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
                <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigateTo(AppView.DASHBOARD)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 011.087.121l4 5a1 1 0 001.414 0l4-5a.999.999 0 011.087-.121l2.644-1.322a1 1 0 000-1.84l-7-3zM10 6a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3z" />
                        <path d="M3 9.25a1 1 0 000 1.5l3.001 1.501a1 1 0 001.414-.414l.707-.707a1 1 0 00-1.414-1.414L3 9.25zM17 9.25l-3.707 3.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414.414L17 10.75a1 1 0 000-1.5z" />
                    </svg>
                    <h1 className="text-xl font-bold text-slate-800">AI Study Coach</h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
