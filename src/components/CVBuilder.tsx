import { useState } from 'react';
import { FileText, Sparkles, Copy, Download, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { generateCV } from '../lib/aiService';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface CVBuilderProps {
  profile: Profile | null;
}

export function CVBuilder({ profile }: CVBuilderProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedCV, setGeneratedCV] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);

  async function handleGenerate() {
    if (!jobTitle.trim()) {
      setError('Please enter a job title.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const cv = await generateCV(
        profile ?? ({
          name: '', email: '', phone: '', location: '', summary: '',
          skills: [], experience: [], education: [],
          linkedin: '', github: '', portfolio: '',
        } as any),
        jobTitle,
        jobDescription
      );
      setGeneratedCV(cv);

      await supabase.from('cv_generations').insert({
        job_title: jobTitle,
        job_description: jobDescription,
        generated_cv: cv,
        profile_snapshot: profile ?? {},
      });
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedCV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([generatedCV], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${jobTitle.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">AI CV Builder</h1>
        <p className="text-gray-500 text-sm">Generate a tailored, ATS-optimised CV for any role in seconds.</p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl border border-blue-100">
        <button
          className="w-full flex items-center justify-between p-4 text-sm font-semibold text-blue-700"
          onClick={() => setShowTips(!showTips)}
        >
          Tips for best results
          {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showTips && (
          <div className="px-4 pb-4 text-sm text-blue-700 space-y-1">
            <p>• Complete your profile first — the AI uses your experience and skills.</p>
            <p>• Paste the full job description for keyword-optimised output.</p>
            <p>• Regenerate with different job descriptions for tailored versions.</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
          <h2 className="text-base font-bold text-gray-900">Target Role</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Marketing Manager"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description (optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for a tailored, ATS-optimised CV..."
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating your CV...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate CV
              </>
            )}
          </button>

          {!profile?.name && (
            <p className="text-xs text-gray-400 text-center">
              No profile found. A generic CV will be generated.{' '}
              <a href="#" className="text-blue-600 font-medium">Complete your profile</a> for better results.
            </p>
          )}
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <h2 className="text-base font-bold text-gray-900">Generated CV</h2>
            </div>
            {generatedCV && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 overflow-y-auto" style={{ minHeight: '400px' }}>
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm">Crafting your personalised CV...</p>
              </div>
            ) : generatedCV ? (
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 leading-relaxed">{generatedCV}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                <FileText className="w-12 h-12" />
                <p className="text-sm text-gray-400 text-center">
                  Enter a job title and click Generate to create your CV
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
