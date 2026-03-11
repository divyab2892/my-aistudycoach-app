
import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="w-12 h-12 border-4 border-t-indigo-600 border-slate-200 rounded-full animate-spin"></div>
            {message && <p className="text-slate-600 animate-pulse">{message}</p>}
        </div>
    );
};

export default Spinner;
