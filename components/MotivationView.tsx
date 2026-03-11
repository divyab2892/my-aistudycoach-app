
import React, { useState, useCallback } from 'react';
import { getDailyMotivation } from '../services/geminiService';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

const MotivationView: React.FC = () => {
    const [motivation, setMotivation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetMotivation = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setMotivation('');
        try {
            const result = await getDailyMotivation();
            setMotivation(result);
        } catch (err) {
            setError('Could not fetch motivation. Keep up the great work anyway!');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900">Daily Motivation Boost</h2>
                <p className="mt-2 text-lg text-slate-600">
                    Great job on finishing your study session!
                </p>
            </div>
            
            <Card className="text-center">
                <p className="mb-4">Click the button below for some well-deserved encouragement.</p>
                <Button onClick={handleGetMotivation} disabled={isLoading}>
                    {isLoading ? 'Cheering you on...' : "I'm Done for Today!"}
                </Button>
            </Card>

            {isLoading && (
                <Card>
                    <Spinner message="Preparing your dose of motivation..." />
                </Card>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {motivation && (
                <Card>
                    <div className="prose prose-indigo max-w-none">
                        <div className="whitespace-pre-wrap font-sans">{motivation}</div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default MotivationView;
