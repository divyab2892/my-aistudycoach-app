
import React, { useState } from 'react';
import { analyzeProgress } from '../services/geminiService';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

// Simulate fetching progress data from a backend or local storage.
const getSimulatedProgress = (): string => {
    return `
- Monday: Studied Math (Calculus), Quiz Score: 95%
- Tuesday: Studied Physics (Optics), Quiz Score: 70%
- Wednesday: Missed study day (Personal commitment)
- Thursday: Studied Chemistry (Organic), Quiz Score: 85%
- Friday: Studied Math (Algebra), Quiz Score: 88%
- Saturday: Review session for Physics, Quiz Score: 78%
- Sunday: Day Off
    `.trim();
};


const ProgressView: React.FC = () => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalysis = async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
            const progressData = getSimulatedProgress();
            const result = await analyzeProgress(progressData);
            setAnalysis(result);
        } catch (err) {
            setError('Sorry, I couldn\'t analyze your progress. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900">Weekly Progress Analyzer</h2>
                <p className="mt-2 text-lg text-slate-600">
                    Let's see how you did this week and find ways to improve!
                </p>
            </div>
            <Card>
                <div className="text-center">
                    <p className="mb-4 text-slate-600">Click the button below to automatically analyze your study performance from the past week.</p>
                     <Button onClick={handleAnalysis} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Analyze My Weekly Progress'}
                    </Button>
                </div>
            </Card>

            {isLoading && (
                <Card>
                    <Spinner message="Crunching the numbers and finding insights..." />
                </Card>
            )}
            
            {error && (
                 <Card className="text-center">
                    <p className="text-red-500">{error}</p>
                </Card>
            )}

            {analysis && (
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">Your Weekly Analysis</h3>
                    <div className="prose prose-indigo max-w-none">
                        <div className="whitespace-pre-wrap font-sans">{analysis}</div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProgressView;
