
import React, { useState } from 'react';
import Button from './common/Button';
import Card from './common/Card';

interface LoginViewProps {
    onLoginSuccess: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.973 5.615 29.818 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.973 5.615 29.818 4 24 4C16.733 4 10.615 7.331 6.306 12.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.823 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const AppleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19.3,4.86a4.33,4.33,0,0,0-3.63,2.14,4.71,4.71,0,0,0-4.29,0,4.33,4.33,0,0,0-3.63-2.14,4.59,4.59,0,0,0-4.45,4.75c0,3,1.68,5.48,4.2,7.39a11.53,11.53,0,0,0,3.52,1.86,11.34,11.34,0,0,0,3.87.05,10.23,10.23,0,0,0,3.2-1.8c2.54-1.91,4.23-4.4,4.23-7.5C23.75,9.45,21.84,4.86,19.3,4.86Zm-1.24,10a8.17,8.17,0,0,1-2,1.35,9,9,0,0,1-2.92.63,6.58,6.58,0,0,1-2.3-.41,4,4,0,0,1-1.63-1.3,4.12,4.12,0,0,1-.73-2.31,4.45,4.45,0,0,1,1.15-3.12,4.1,4.1,0,0,1,2.83-1.38,4.21,4.21,0,0,1,4.13,2.38c-.06,0-.12,0-.18,0a12.18,12.18,0,0,0-2,.17,3.53,3.53,0,0,0-2.43,1.3,3.67,3.67,0,0,0-.73,2.42,3.38,3.38,0,0,0,1.55,3,3.82,3.82,0,0,0,2.5.83,5.13,5.13,0,0,0,2.23-.49A2,2,0,0,0,18.06,14.86ZM12,3.47a2.59,2.59,0,0,1,2-1.35,2.72,2.72,0,0,1,2.56,1.48,2.5,2.5,0,0,1-1.89,1.21A2.78,2.78,0,0,1,12,3.47Z"/>
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21">
        <path fill="#f25022" d="M1 1h9v9H1z"/>
        <path fill="#00a4ef" d="M1 11h9v9H1z"/>
        <path fill="#7fba00" d="M11 1h9v9h-9z"/>
        <path fill="#ffb900" d="M11 11h9v9h-9z"/>
    </svg>
);


const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isSignUp) {
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
             if (!email || !password) {
                setError('Please fill in all fields.');
                return;
            }
        } else {
             if (!email || !password) {
                setError('Please enter both email and password.');
                return;
            }
        }
        
        // Simulate successful login/signup
        onLoginSuccess();
    };
    
    // Simulate OAuth login
    const handleOAuthLogin = () => {
        onLoginSuccess();
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900">AI Study Coach</h1>
                    <p className="text-slate-500 mt-2">
                        {isSignUp ? 'Create your account to begin.' : 'Sign in to continue your journey.'}
                    </p>
                </div>

                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-6 justify-center">
                        <button onClick={() => { setIsSignUp(false); setError(''); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${!isSignUp ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Sign In
                        </button>
                        <button onClick={() => { setIsSignUp(true); setError(''); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isSignUp ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Sign Up
                        </button>
                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email or Phone Number
                        </label>
                        <div className="mt-1">
                            <input id="email" name="email" type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-700">
                            {isSignUp ? 'New Password' : 'Password'}
                        </label>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    {isSignUp && (
                         <div>
                            <label htmlFor="confirmPassword"  className="block text-sm font-medium text-slate-700">
                                Re-type New Password
                            </label>
                            <div className="mt-1">
                                <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                    )}
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <Button type="submit" className="w-full mt-2">
                           {isSignUp ? 'Sign Up' : 'Sign In'}
                        </Button>
                    </div>
                </form>
                
                 <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                         <Button variant="secondary" onClick={handleOAuthLogin} aria-label="Sign in with Google"><GoogleIcon /></Button>
                         <Button variant="secondary" onClick={handleOAuthLogin} aria-label="Sign in with Apple"><AppleIcon /></Button>
                         <Button variant="secondary" onClick={handleOAuthLogin} aria-label="Sign in with Microsoft"><MicrosoftIcon /></Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoginView;
