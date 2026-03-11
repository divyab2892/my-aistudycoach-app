
import React, { useState, useCallback } from 'react';
import { AppView, StudentProfile } from './types';
import { generateStudyPlan } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfilingWizard from './components/ProfilingWizard';
import StudyPlanView from './components/StudyPlanView';
import SmartTutorView from './components/SmartTutorView';
import MotivationView from './components/MotivationView';
import ProgressView from './components/ProgressView';
import VoiceCoachView from './components/VoiceCoachView';
import LoginView from './components/LoginView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView(AppView.PROFILING);
  }

  const handleProfileCreated = useCallback(async (profile: StudentProfile) => {
    setStudentProfile(profile);
    setCurrentView(AppView.STUDY_PLAN);
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateStudyPlan(profile);
      setStudyPlan(plan);
    } catch (e) {
      setError('Failed to generate a study plan. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigateTo = (view: AppView) => {
    if(view === AppView.LOGIN) {
        setIsAuthenticated(false);
    }
    setCurrentView(view);
  };

  const renderContent = () => {
    if (!isAuthenticated) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case AppView.PROFILING:
        return <ProfilingWizard onComplete={handleProfileCreated} />;
      case AppView.STUDY_PLAN:
        return <StudyPlanView plan={studyPlan} isLoading={isLoading} error={error} profile={studentProfile} />;
      case AppView.TUTOR:
        return <SmartTutorView />;
      case AppView.VOICE_COACH:
        return <VoiceCoachView />;
      case AppView.MOTIVATION:
        return <MotivationView />;
      case AppView.PROGRESS:
        return <ProgressView />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {isAuthenticated && <Header navigateTo={navigateTo} />}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
      {isAuthenticated && (
        <footer className="text-center p-4 text-slate-500 text-sm">
          <p>Your journey to success starts here. Stay focused!</p>
        </footer>
      )}
    </div>
  );
}
