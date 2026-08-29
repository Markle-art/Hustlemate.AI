import { useState } from 'react';
import { FileText, Mail, Mic, Compass, Clock, ChevronRight, Trash2, Eye, X } from 'lucide-react';
import type { CVGeneration, CoverLetter, InterviewSession, CareerGuidanceSession } from '../lib/types';
import { supabase } from '../lib/supabase';

interface HistoryPageProps {
  cvs: CVGeneration[];
  letters: CoverLetter[];
  interviews: InterviewSession[];
  guidance: CareerGuidanceSession[];
  onRefresh: () => void;
}

type ActiveTab = 'cvs' | 'letters' | 'interviews' | 'guidance';

function Modal({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">{content}</pre>
        </div>
      </div>
    </div>
  );
}

export function HistoryPage({ cvs, letters, interviews, guidance, onRefresh }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cvs');
  const [modal, setModal] = useState<{ title: string; content: string } | null>(null);

  const tabs = [
    { id: 'cvs' as ActiveTab, label: 'CVs', count: cvs.length, icon: FileText, color: 'text-blue-600' },
    { id: 'letters' as ActiveTab, label: 'Cover Letters', count: letters.length, icon: Mail, color: 'text-emerald-600' },
    { id: 'interviews' as ActiveTab, label: 'Interviews', count: interviews.length, icon: Mic, color: 'text-amber-600' },
    { id: 'guidance' as ActiveTab, label: 'Guidance', count: guidance.length, icon: Compass, color: 'text-rose-600' },
  ];

  async function deleteCV(id: string) {
    await supabase.from('cv_generations').delete().eq('id', id);
    onRefresh();
  }

  async function deleteLetter(id: string) {
    await supabase.from('cover_letters').delete().eq('id', id);
    onRefresh();
  }

  async function deleteInterview(id: string) {
    await supabase.from('interview_sessions').delete().eq('id', id);
    onRefresh();
  }

  async function deleteGuidance(id: string) {
    await supabase.from('career_guidance_sessions').delete().eq('id', id);
    onRefresh();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-emerald-600 bg-emerald-50' : score >= 60 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {modal && <Modal title={modal.title} content={modal.content} onClose={() => setModal(null)} />}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">History</h1>
        <p className="text-gray-500 text-sm">All your AI-generated career documents in one place.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-2">
          {/* CVs */}
          {activeTab === 'cvs' && (
            <div>
              {cvs.length === 0 ? (
                <EmptyState icon={FileText} message="No CVs generated yet. Head to the CV Builder to get started." />
              ) : (
                cvs.map((cv) => (
                  <div key={cv.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{cv.job_title || 'Untitled CV'}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatDate(cv.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ title: `CV — ${cv.job_title}`, content: cv.generated_cv })}
                        className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => deleteCV(cv.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:opacity-0" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Cover Letters */}
          {activeTab === 'letters' && (
            <div>
              {letters.length === 0 ? (
                <EmptyState icon={Mail} message="No cover letters generated yet." />
              ) : (
                letters.map((l) => (
                  <div key={l.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{l.job_title} — {l.company}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatDate(l.created_at)}
                        <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full capitalize">{l.tone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ title: `Cover Letter — ${l.company}`, content: l.generated_letter })}
                        className="flex items-center gap-1 text-xs text-emerald-600 border border-emerald-200 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => deleteLetter(l.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:opacity-0" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Interviews */}
          {activeTab === 'interviews' && (
            <div>
              {interviews.length === 0 ? (
                <EmptyState icon={Mic} message="No interview sessions yet. Practice to get a score." />
              ) : (
                interviews.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {s.job_title}{s.company ? ` at ${s.company}` : ''}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatDate(s.created_at)}
                      </div>
                    </div>
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${scoreColor(s.score)}`}>
                      {s.score}%
                    </span>
                    <button onClick={() => deleteInterview(s.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Guidance */}
          {activeTab === 'guidance' && (
            <div>
              {guidance.length === 0 ? (
                <EmptyState icon={Compass} message="No career guidance sessions yet." />
              ) : (
                guidance.map((g) => (
                  <div key={g.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                      <Compass className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{g.query}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatDate(g.created_at)}
                        <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full capitalize">{g.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ title: 'Career Guidance', content: g.guidance })}
                        className="flex items-center gap-1 text-xs text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => deleteGuidance(g.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<any>; message: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-gray-300">
      <Icon className="w-12 h-12" />
      <p className="text-sm text-gray-400 text-center max-w-xs">{message}</p>
    </div>
  );
}
