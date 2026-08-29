import { useState } from 'react';
import { Mic, Sparkles, ChevronRight, CheckCircle, Loader, RotateCcw, TrendingUp } from 'lucide-react';
import { generateInterviewQuestions, evaluateAnswer } from '../lib/aiService';
import { supabase } from '../lib/supabase';
import type { InterviewQuestion } from '../lib/types';

type Step = 'setup' | 'questions' | 'results';

export function InterviewPrep() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [step, setStep] = useState<Step>('setup');
  const [questions, setQuestions] = useState<Array<{ question: string; hint: string }>>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<Array<{ feedback: string; score: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    if (!jobTitle.trim()) {
      setError('Please enter a job title.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const qs = await generateInterviewQuestions(jobTitle, company);
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(''));
      setEvaluations([]);
      setCurrentQ(0);
      setCurrentAnswer('');
      setShowHint(false);
      setStep('questions');
    } catch {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!currentAnswer.trim()) return;
    setEvaluating(true);
    const q = questions[currentQ];
    const result = await evaluateAnswer(q.question, currentAnswer);
    const newEvals = [...evaluations, result];
    const newAnswers = [...answers];
    newAnswers[currentQ] = currentAnswer;

    setEvaluations(newEvals);
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setCurrentAnswer('');
      setShowHint(false);
    } else {
      const avgScore = Math.round(newEvals.reduce((a, b) => a + b.score, 0) / newEvals.length);
      const sessionData: InterviewQuestion[] = questions.map((q, i) => ({
        question: q.question,
        answer: newAnswers[i],
        feedback: newEvals[i]?.feedback ?? '',
        score: newEvals[i]?.score ?? 0,
      }));

      await supabase.from('interview_sessions').insert({
        job_title: jobTitle,
        company: company || '',
        questions: sessionData,
        overall_feedback: `You scored ${avgScore}% overall. ${avgScore >= 80 ? 'Excellent performance!' : avgScore >= 60 ? 'Good effort — review the feedback to improve.' : 'Keep practising — focus on the STAR method.'}`,
        score: avgScore,
      });

      setStep('results');
    }
    setEvaluating(false);
  }

  function handleReset() {
    setStep('setup');
    setJobTitle('');
    setCompany('');
    setQuestions([]);
    setAnswers([]);
    setEvaluations([]);
    setCurrentQ(0);
    setCurrentAnswer('');
  }

  const avgScore =
    evaluations.length > 0
      ? Math.round(evaluations.reduce((a, b) => a + b.score, 0) / evaluations.length)
      : 0;

  const scoreColor = avgScore >= 80 ? 'text-emerald-600' : avgScore >= 60 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg = avgScore >= 80 ? 'bg-emerald-50' : avgScore >= 60 ? 'bg-amber-50' : 'bg-rose-50';

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Interview Prep</h1>
          <p className="text-gray-500 text-sm">Practice with AI-generated questions and get instant, detailed feedback.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Start a Mock Interview</h2>
            <p className="text-sm text-gray-500">6 tailored questions • Instant AI feedback • Performance score</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Analyst"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company (optional)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Deloitte, Safaricom"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Preparing questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start Interview
              </>
            )}
          </button>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {['STAR Method', 'Be specific', 'Stay concise'].map((tip) => (
              <div key={tip} className="text-center p-3 bg-gray-50 rounded-xl">
                <CheckCircle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-xs text-gray-600 font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Mock Interview</h1>
            <p className="text-sm text-gray-500">{jobTitle}{company ? ` at ${company}` : ''}</p>
          </div>
          <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-500 font-medium">Question {currentQ + 1} of {questions.length}</span>
            <span className="text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 font-bold text-sm">
              {currentQ + 1}
            </div>
            <p className="text-gray-900 font-semibold leading-relaxed pt-1">{q.question}</p>
          </div>

          {showHint ? (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-sm text-amber-800 font-semibold mb-1">Hint</p>
              <p className="text-sm text-amber-700">{q.hint}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1"
            >
              Show hint
            </button>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Answer</label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here. Aim for 100–200 words using the STAR method..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-gray-400 resize-none"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={evaluating || !currentAnswer.trim()}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {evaluating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                {currentQ + 1 < questions.length ? 'Submit & Next' : 'Submit & Finish'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Interview Results</h1>
          <p className="text-sm text-gray-500">{jobTitle}{company ? ` at ${company}` : ''}</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm font-semibold text-amber-600 border border-amber-200 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Practice Again
        </button>
      </div>

      {/* Score card */}
      <div className={`${scoreBg} rounded-2xl p-6 border ${avgScore >= 80 ? 'border-emerald-200' : avgScore >= 60 ? 'border-amber-200' : 'border-rose-200'}`}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28" fill="none"
                stroke={avgScore >= 80 ? '#10b981' : avgScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="6"
                strokeDasharray={`${(avgScore / 100) * 175.9} 175.9`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-extrabold ${scoreColor}`}>{avgScore}%</span>
            </div>
          </div>
          <div>
            <div className={`text-xl font-extrabold mb-1 ${scoreColor}`}>
              {avgScore >= 80 ? 'Excellent!' : avgScore >= 60 ? 'Good effort' : 'Keep practising'}
            </div>
            <p className="text-sm text-gray-600">
              {avgScore >= 80
                ? "You're interview-ready. Great use of specific examples and structured answers."
                : avgScore >= 60
                ? "Solid foundation. Strengthen your answers with more specific examples and outcomes."
                : "Focus on the STAR method. Preparation and practice will significantly improve your score."}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className={`w-4 h-4 ${scoreColor}`} />
              <span className={`text-sm font-semibold ${scoreColor}`}>{questions.length} questions completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Question Breakdown</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {questions.map((q, i) => {
            const ev = evaluations[i];
            if (!ev) return null;
            const qColor = ev.score >= 80 ? 'text-emerald-600 bg-emerald-50' : ev.score >= 60 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
            return (
              <div key={i} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">{q.question}</p>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full flex-shrink-0 ${qColor}`}>
                    {ev.score}%
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-2">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Your answer</p>
                  <p className="text-sm text-gray-700">{answers[i]}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-semibold mb-1">AI Feedback</p>
                  <p className="text-sm text-blue-800">{ev.feedback}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
