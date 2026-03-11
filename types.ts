
export enum ConfidenceLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface Subject {
  name: string;
  confidence: ConfidenceLevel;
}

export interface StudentProfile {
  goal: string;
  subjects: Subject[];
  deadline: string;

  dailyHours: number;
}

export enum AppView {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  PROFILING = 'profiling',
  STUDY_PLAN = 'study_plan',
  TUTOR = 'tutor',
  MOTIVATION = 'motivation',
  PROGRESS = 'progress',
  VOICE_COACH = 'voice_coach',
}
