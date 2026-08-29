/*
# HustleMate AI - Initial Schema

This migration creates all tables needed for the HustleMate AI career tools application.

## New Tables

### profiles
Stores user profile/resume information used across all AI tools.
- id (uuid, primary key)
- name (text) - full name
- email (text)
- phone (text)
- location (text)
- summary (text) - professional summary
- skills (text[]) - array of skill strings
- experience (jsonb) - array of work experience objects
- education (jsonb) - array of education objects
- linkedin (text)
- github (text)
- portfolio (text)
- created_at / updated_at

### cv_generations
Stores AI-generated CV outputs.
- id (uuid, primary key)
- job_title (text) - target job title
- job_description (text) - JD provided by user
- generated_cv (text) - the AI-generated CV markdown
- profile_snapshot (jsonb) - snapshot of profile used
- created_at

### cover_letters
Stores AI-generated cover letter outputs.
- id (uuid, primary key)
- company (text)
- job_title (text)
- job_description (text)
- generated_letter (text)
- tone (text) - formal / friendly / confident
- created_at

### interview_sessions
Stores mock interview Q&A sessions.
- id (uuid, primary key)
- job_title (text)
- company (text)
- questions (jsonb) - array of {question, answer, feedback} objects
- overall_feedback (text)
- score (integer 0-100)
- created_at

### career_guidance_sessions
Stores career guidance outputs.
- id (uuid, primary key)
- query (text) - user's career question
- guidance (text) - AI guidance response
- category (text) - e.g. salary, career-change, upskilling
- created_at

## Security
- RLS enabled on all tables with anon + authenticated access (single-tenant, no auth required for demo)
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  summary text DEFAULT '',
  skills text[] DEFAULT '{}',
  experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  linkedin text DEFAULT '',
  github text DEFAULT '',
  portfolio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE TO anon, authenticated USING (true);

-- cv_generations
CREATE TABLE IF NOT EXISTS cv_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL DEFAULT '',
  job_description text DEFAULT '',
  generated_cv text DEFAULT '',
  profile_snapshot jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cv_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_cv" ON cv_generations;
CREATE POLICY "anon_select_cv" ON cv_generations FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_cv" ON cv_generations;
CREATE POLICY "anon_insert_cv" ON cv_generations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_cv" ON cv_generations;
CREATE POLICY "anon_update_cv" ON cv_generations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_cv" ON cv_generations;
CREATE POLICY "anon_delete_cv" ON cv_generations FOR DELETE TO anon, authenticated USING (true);

-- cover_letters
CREATE TABLE IF NOT EXISTS cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL DEFAULT '',
  job_title text NOT NULL DEFAULT '',
  job_description text DEFAULT '',
  generated_letter text DEFAULT '',
  tone text DEFAULT 'professional',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_letters" ON cover_letters;
CREATE POLICY "anon_select_letters" ON cover_letters FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_letters" ON cover_letters;
CREATE POLICY "anon_insert_letters" ON cover_letters FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_letters" ON cover_letters;
CREATE POLICY "anon_update_letters" ON cover_letters FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_letters" ON cover_letters;
CREATE POLICY "anon_delete_letters" ON cover_letters FOR DELETE TO anon, authenticated USING (true);

-- interview_sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL DEFAULT '',
  company text DEFAULT '',
  questions jsonb DEFAULT '[]',
  overall_feedback text DEFAULT '',
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_interviews" ON interview_sessions;
CREATE POLICY "anon_select_interviews" ON interview_sessions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_interviews" ON interview_sessions;
CREATE POLICY "anon_insert_interviews" ON interview_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_interviews" ON interview_sessions;
CREATE POLICY "anon_update_interviews" ON interview_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_interviews" ON interview_sessions;
CREATE POLICY "anon_delete_interviews" ON interview_sessions FOR DELETE TO anon, authenticated USING (true);

-- career_guidance_sessions
CREATE TABLE IF NOT EXISTS career_guidance_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL DEFAULT '',
  guidance text DEFAULT '',
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_guidance_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_guidance" ON career_guidance_sessions;
CREATE POLICY "anon_select_guidance" ON career_guidance_sessions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_guidance" ON career_guidance_sessions;
CREATE POLICY "anon_insert_guidance" ON career_guidance_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_guidance" ON career_guidance_sessions;
CREATE POLICY "anon_update_guidance" ON career_guidance_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_guidance" ON career_guidance_sessions;
CREATE POLICY "anon_delete_guidance" ON career_guidance_sessions FOR DELETE TO anon, authenticated USING (true);
