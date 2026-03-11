
import React, { useState } from 'react';
import { StudentProfile, ConfidenceLevel, Subject } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface ProfilingWizardProps {
  onComplete: (profile: StudentProfile) => void;
}

const questions = [
  "What is your main exam or learning goal?",
  "What subjects are you studying?",
  "What's your deadline or exam date?",
  "How many hours can you study per day?",
  "What is your confidence level in each subject?",
  "Here is your profile summary. Let's create your plan!"
];

const availableSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Computer Science", "Economics"
];

const ProfilingWizard: React.FC<ProfilingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [deadline, setDeadline] = useState('');
  const [dailyHours, setDailyHours] = useState('');
  
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubjectToggle = (subjectName: string) => {
    setSubjects(prevSubjects => {
        const isSelected = prevSubjects.some(s => s.name === subjectName);
        if (isSelected) {
            return prevSubjects.filter(s => s.name !== subjectName);
        } else {
            return [...prevSubjects, { name: subjectName, confidence: ConfidenceLevel.MEDIUM }];
        }
    });
  };

  const handleConfidenceChange = (index: number, level: ConfidenceLevel) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].confidence = level;
    setSubjects(updatedSubjects);
  };

  const handleSubmit = () => {
    const profile: StudentProfile = {
      goal,
      subjects,
      deadline,
      dailyHours: parseFloat(dailyHours) || 2,
    };
    onComplete(profile);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
            <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Ace my Final Physics Exam"/>
        );
      case 1:
        return (
            <div className="grid grid-cols-2 gap-4 w-full">
                {availableSubjects.map(subjectName => (
                     <label key={subjectName} className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-indigo-50">
                        <input
                            type="checkbox"
                            className="form-checkbox text-indigo-600 h-5 w-5"
                            checked={subjects.some(s => s.name === subjectName)}
                            onChange={() => handleSubjectToggle(subjectName)}
                        />
                        {subjectName}
                    </label>
                ))}
            </div>
        );
      case 2:
        return (
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full p-2 border rounded-md"/>
        );
      case 3:
        return (
            <input type="number" value={dailyHours} onChange={e => setDailyHours(e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., 3"/>
        );
      case 4:
        return (
          <div className="space-y-4 w-full">
            {subjects.map((subject, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="font-semibold mb-2">{subject.name}</p>
                <div className="flex gap-4">
                  {(Object.values(ConfidenceLevel)).map(level => (
                    <label key={level} className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name={`confidence-${index}`} checked={subject.confidence === level} onChange={() => handleConfidenceChange(index, level)} className="form-radio text-indigo-600"/>
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 text-slate-700">
            <p><strong>Goal:</strong> {goal}</p>
            <p><strong>Subjects:</strong> {subjects.map(s => `${s.name} (${s.confidence})`).join(', ')}</p>
            <p><strong>Deadline:</strong> {deadline}</p>
            <p><strong>Daily Study Hours:</strong> {dailyHours}</p>
          </div>
        );
      default: return null;
    }
  }

  const isNextDisabled = () => {
    switch (step) {
        case 0: return !goal;
        case 1: return subjects.length === 0;
        case 2: return !deadline;
        case 3: return !dailyHours || parseFloat(dailyHours) <= 0;
        default: return false;
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Create Your Student Profile</h2>
            <p className="text-slate-500 mt-1">{questions[step]}</p>
        </div>
        
        <div className="mb-6 min-h-[150px] flex items-center justify-center px-4">
            {renderStep()}
        </div>

        <div className="flex justify-between items-center">
            {step > 0 && <Button variant="secondary" onClick={handleBack}>Back</Button>}
            <div className="flex-grow"></div> {/* Spacer */}
            {step < questions.length - 1 && <Button onClick={handleNext} disabled={isNextDisabled()}>Next</Button>}
            {step === questions.length - 1 && <Button onClick={handleSubmit}>Generate Plan</Button>}
        </div>
    </Card>
  );
};

export default ProfilingWizard;
