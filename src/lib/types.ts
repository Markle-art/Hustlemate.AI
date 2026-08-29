export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  linkedin: string;
  github: string;
  portfolio: string;
  created_at: string;
  updated_at: string;
}

export interface CVGeneration {
  id: string;
  job_title: string;
  job_description: string;
  generated_cv: string;
  profile_snapshot: Partial<Profile>;
  created_at: string;
}

export interface CoverLetter {
  id: string;
  company: string;
  job_title: string;
  job_description: string;
  generated_letter: string;
  tone: string;
  created_at: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export interface InterviewSession {
  id: string;
  job_title: string;
  company: string;
  questions: InterviewQuestion[];
  overall_feedback: string;
  score: number;
  created_at: string;
}

export interface CareerGuidanceSession {
  id: string;
  query: string;
  guidance: string;
  category: string;
  created_at: string;
}

export type Page =
  | 'landing'
  | 'dashboard'
  | 'profile'
  | 'cv-builder'
  | 'cover-letter'
  | 'interview-prep'
  | 'career-guidance'
  | 'history';
