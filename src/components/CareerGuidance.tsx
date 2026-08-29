import { useState } from 'react';
import { Compass, Sparkles, Loader, BookOpen } from 'lucide-react';
import { getCareerGuidance } from '../lib/aiService';
import { supabase } from '../lib/supabase';

const categories = [
  { value: 'salary', label: 'Salary Negotiation', icon: '💰', desc: 'How to negotiate your worth' },
  { value: 'career-change', label: 'Career Change', icon: '🔀', desc: 'Pivoting to a new field' },
  { value: 'upskilling', label: 'Upskilling', icon: '📚', desc: 'Learning for career growth' },
  { value: 'general', label: 'General Advice', icon: '🧭', desc: 'Broad career guidance' },
];

const sampleQuestions: Record<string, string> = {
  salary: 'I have a job offer. How should I negotiate a higher salary?',
  'career-change': "I'm in accounting but want to move into UX design. Where do I start?",
  upskilling: 'What skills should I learn to become a data scientist in 2024?',
  general: 'How do I stand out as a fresh graduate with no work experience?',
};

export function CareerGuidance() {
  const [category, setCategory] = useState('general');
  const [query, setQuery] = useState('');
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk() {
    if (!query.trim()) {
      setError('Please enter your question.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await getCareerGuidance(query, category);
      setGuidance(result);
      await supabase.from('career_guidance_sessions').insert({
        query,
        guidance: result,
        category,
      });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSampleQuestion() {
    setQuery(sampleQuestions[category] ?? '');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Career Guidance</h1>
        <p className="text-gray-500 text-sm">Get expert-level career advice on any topic, instantly.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sidebar categories */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Topic</p>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setQuery('');
                setGuidance('');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                category === cat.value
                  ? 'border-rose-300 bg-rose-50'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <div>
                <div className={`text-sm font-semibold ${category === cat.value ? 'text-rose-700' : 'text-gray-900'}`}>
                  {cat.label}
                </div>
                <div className="text-xs text-gray-400">{cat.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {categories.find((c) => c.value === category)?.label}
              </h2>
              <button
                onClick={handleSampleQuestion}
                className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-all"
              >
                Use sample question
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Question</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Ask anything about ${categories.find((c) => c.value === category)?.label.toLowerCase()}...`}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-gray-400 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleAsk}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Getting guidance...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Career Guidance
                </>
              )}
            </button>
          </div>

          {/* Response */}
          {loading ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 animate-spin text-rose-500" />
              <p className="text-sm text-gray-500">Analysing your question...</p>
            </div>
          ) : guidance ? (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                <BookOpen className="w-4 h-4 text-rose-500" />
                <h3 className="text-base font-bold text-gray-900">Career Advice</h3>
              </div>
              <div className="p-5">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {guidance.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-base font-extrabold text-gray-900 mt-5 mb-2 first:mt-0">{line.slice(3)}</h2>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <p key={i} className="ml-3 text-sm text-gray-700 mb-1">• {line.slice(2)}</p>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="text-sm text-gray-700 mb-1">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center gap-3 border border-gray-100">
              <Compass className="w-12 h-12 text-gray-300" />
              <p className="text-sm text-gray-400 text-center">
                Select a topic, ask your question, and receive expert career guidance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
