
import React from 'react';
import { AppView } from '../types';
import Card from './common/Card';

interface DashboardProps {
  navigateTo: (view: AppView) => void;
}

interface Feature {
  view: AppView;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    view: AppView.PROFILING,
    title: 'View/Edit Profile & Plan',
    description: 'Update your learning goals, subjects, and regenerate your study plan.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  },
  {
    view: AppView.TUTOR,
    title: 'Smart Tutor',
    description: 'Paste text from PDFs or articles to get explanations on your materials.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
      view: AppView.VOICE_COACH,
      title: 'Voice Coach',
      description: 'Talk with your AI coach in real-time for interactive learning.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
  },
  {
    view: AppView.MOTIVATION,
    title: 'Daily Motivation',
    description: 'Finished studying? Get a boost of encouragement for your hard work.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
  },
  {
    view: AppView.PROGRESS,
    title: 'Progress Analyzer',
    description: 'Analyze your weekly progress to find strengths and weaknesses.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  }
];

const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Welcome, Future Achiever!</h2>
        <p className="mt-2 text-lg text-slate-600">
          Your personalized AI Study Coach is here to help you conquer your goals.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.view}
            onClick={() => navigateTo(feature.view)}
            className="group cursor-pointer"
          >
            <Card className="h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
                  <p className="mt-1 text-slate-500">{feature.description}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
