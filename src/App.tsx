import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import type { Page, Profile, CVGeneration, CoverLetter, InterviewSession, CareerGuidanceSession } from './lib/types';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHome } from './components/DashboardHome';
import { CVBuilder } from './components/CVBuilder';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { InterviewPrep } from './components/InterviewPrep';
import { CareerGuidance } from './components/CareerGuidance';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cvs, setCVs] = useState<CVGeneration[]>([]);
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [guidance, setGuidance] = useState<CareerGuidanceSession[]>([]);

  const loadData = useCallback(async () => {
    const [pRes, cvRes, lRes, iRes, gRes] = await Promise.all([
      supabase.from('profiles').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('cv_generations').select('*').order('created_at', { ascending: false }),
      supabase.from('cover_letters').select('*').order('created_at', { ascending: false }),
      supabase.from('interview_sessions').select('*').order('created_at', { ascending: false }),
      supabase.from('career_guidance_sessions').select('*').order('created_at', { ascending: false }),
    ]);

    if (pRes.data) setProfile(pRes.data as Profile);
    if (cvRes.data) setCVs(cvRes.data as CVGeneration[]);
    if (lRes.data) setLetters(lRes.data as CoverLetter[]);
    if (iRes.data) setInterviews(iRes.data as InterviewSession[]);
    if (gRes.data) setGuidance(gRes.data as CareerGuidanceSession[]);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dashboardPages: Page[] = [
    'dashboard', 'profile', 'cv-builder', 'cover-letter',
    'interview-prep', 'career-guidance', 'history',
  ];

  if (page === 'landing') {
    return <LandingPage onNavigate={setPage} />;
  }

  return (
    <DashboardLayout
      currentPage={page}
      onNavigate={setPage}
      profile={profile ?? undefined}
    >
      {page === 'dashboard' && (
        <DashboardHome
          onNavigate={setPage}
          profile={profile}
          recentCVs={cvs}
          recentLetters={letters}
          recentInterviews={interviews}
        />
      )}
      {page === 'cv-builder' && <CVBuilder profile={profile} />}
      {page === 'cover-letter' && <CoverLetterGenerator profile={profile} />}
      {page === 'interview-prep' && <InterviewPrep />}
      {page === 'career-guidance' && <CareerGuidance />}
      {page === 'profile' && (
        <ProfilePage
          profile={profile}
          onProfileSaved={(p) => setProfile(p)}
        />
      )}
      {page === 'history' && (
        <HistoryPage
          cvs={cvs}
          letters={letters}
          interviews={interviews}
          guidance={guidance}
          onRefresh={loadData}
        />
      )}
    </DashboardLayout>
  );
}
