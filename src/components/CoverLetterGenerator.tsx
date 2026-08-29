import { useState } from 'react';
import { Mail, Sparkles, Copy, Download, Loader } from 'lucide-react';
import { generateCoverLetter } from '../lib/aiService';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface CoverLetterGeneratorProps {
  profile: Profile | null;
}

const tones = [
  { value: 'professional', label: 'Professional', desc: 'Balanced and polished' },
  { value: 'formal', label: 'Formal', desc: 'Traditional and structured' },
  { value: 'confident', label: 'Confident', desc: 'Bold and assertive' },
];

export function CoverLetterGenerator({ profile }: CoverLetterGeneratorProps) {
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!company.trim() || !jobTitle.trim()) {
      setError('Please enter both company name and job title.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const letter = await generateCoverLetter(
        profile ?? ({ name: '', email: '', phone: '', skills: [], experience: [] } as any),
        company,
        jobTitle,
        jobDescription,
        tone
      );
      setGeneratedLetter(letter);

      await supabase.from('cover_letters').insert({
        company,
        job_title: jobTitle,
        job_description: jobDescription,
        generated_letter: letter,
        tone,
      });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CoverLetter_${company.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Cover Letter Generator</h1>
        <p className="text-gray-500 text-sm">Write compelling, personalised cover letters that get responses.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
          <h2 className="text-base font-bold text-gray-900">Job Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Product Manager"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description (optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for a more targeted letter..."
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Letter Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`px-3 py-3 rounded-xl border-2 text-left transition-all ${
                    tone === t.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-0.5 ${tone === t.value ? 'text-blue-700' : 'text-gray-700'}`}>
                    {t.label}
                  </div>
                  <div className="text-xs text-gray-400">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Writing your letter...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <h2 className="text-base font-bold text-gray-900">Your Cover Letter</h2>
            </div>
            {generatedLetter && (
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
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:border-emerald-300 transition-all"
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
                <Loader className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-sm">Crafting your personalised letter...</p>
              </div>
            ) : generatedLetter ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">{generatedLetter}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                <Mail className="w-12 h-12" />
                <p className="text-sm text-gray-400 text-center">
                  Fill in the details and click Generate to create your cover letter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
