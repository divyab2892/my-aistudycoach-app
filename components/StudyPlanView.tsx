
import React from 'react';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { StudentProfile } from '../types';

interface StudyPlanViewProps {
  plan: string | null;
  isLoading: boolean;
  error: string | null;
  profile: StudentProfile | null;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    return (
        <div className="prose prose-indigo max-w-none">
            {lines.map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="font-bold text-xl mt-4 mb-2">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('- ')) {
                    return <p key={index} className="ml-4">{line}</p>;
                }
                if (line.startsWith('**')) {
                    return <p key={index} className="font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

const StudyPlanView: React.FC<StudyPlanViewProps> = ({ plan, isLoading, error, profile }) => {
  if (isLoading) {
    return (
      <Card>
        <Spinner message="Your personalized study plan is being crafted by our AI coach..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <h3 className="text-xl font-bold text-red-600">Oops! Something went wrong.</h3>
        <p className="text-red-500 mt-2">{error}</p>
      </Card>
    );
  }
  
  if (!plan) {
    return (
      <Card className="text-center">
        <h3 className="text-xl font-bold">No Study Plan Generated</h3>
        <p className="text-slate-500 mt-2">Please create your profile first to get a personalized plan.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Your 7-Day Study Plan</h2>
        <p className="mt-2 text-lg text-slate-600">
          Here's your roadmap to success for {profile?.goal || 'your goal'}.
        </p>
      </div>
      <Card>
        <FormattedText text={plan} />
      </Card>
    </div>
  );
};

export default StudyPlanView;
