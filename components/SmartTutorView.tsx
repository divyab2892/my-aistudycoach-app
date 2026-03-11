
import React, { useState } from 'react';
import { getSmartTutorExplanation } from '../services/geminiService';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

const SmartTutorView: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) {
            setError('Please enter a topic to explain.');
            return;
        }
        setIsLoading(true);
        setError('');
        setExplanation('');
        try {
            const result = await getSmartTutorExplanation(topic, context);
            setExplanation(result);
        } catch (err) {
            setError('Sorry, I couldn\'t fetch an explanation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900">Smart Tutor</h2>
                <p className="mt-2 text-lg text-slate-600">
                    Get explanations based on your course materials.
                </p>
            </div>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="context" className="font-semibold text-slate-700 mb-1 block">
                           Context (Optional)
                        </label>
                        <textarea
                            id="context"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Paste content from your PDF, article, or course material here."
                            className="w-full p-3 border rounded-md h-32 focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                    </div>
                     <div>
                        <label htmlFor="topic" className="font-semibold text-slate-700 mb-1 block">
                           Your Question
                        </label>
                        <textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Explain Newton's First Law of Motion based on the text above."
                            className="w-full p-3 border rounded-md h-24 focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" disabled={isLoading || !topic}>
                        {isLoading ? 'Thinking...' : 'Get Explanation'}
                    </Button>
                </form>
            </Card>

            {isLoading && (
                <Card>
                    <Spinner message="Simplifying the complex, just for you..." />
                </Card>
            )}

            {explanation && (
                <Card>
                    <div className="prose prose-indigo max-w-none">
                       <div className="whitespace-pre-wrap font-sans">{explanation}</div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SmartTutorView;
