import { FileText, Mail, Mic, Compass, User, TrendingUp, Clock, ArrowRight, Zap } from 'lucide-react';
import type { Page, Profile, CVGeneration, CoverLetter, InterviewSession } from '../lib/types';

interface DashboardHomeProps {
  onNavigate: (page: Page) => void;
  profile: Profile | null;
  recentCVs: CVGeneration[];
  recentLetters: CoverLetter[];
  recentInterviews: InterviewSession[];
}

const tools = [
  {
    icon: FileText,
    title: 'Build My CV',
    desc: 'Tailored to any job description',
    page: 'cv-builder' as Page,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: Mail,
    title: 'Cover Letter',
    desc: 'Compelling and personalised',
    page: 'cover-letter' as Page,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: Mic,
    title: 'Interview Prep',
    desc: 'Practice with AI feedback',
    page: 'interview-prep' as Page,
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    icon: Compass,
    title: 'Career Guidance',
    desc: 'Expert advice on demand',
    page: 'career-guidance' as Page,
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
];

export function DashboardHome({ onNavigate, profile, recentCVs, recentLetters, recentInterviews }: DashboardHomeProps) {
  const totalActivity = recentCVs.length + recentLetters.length + recentInterviews.length;
  const avgScore =
    recentInterviews.length > 0
      ? Math.round(recentInterviews.reduce((a, b) => a + b.score, 0) / recentInterviews.length)
      : null;

  const profileComplete = profile
    ? [profile.name, profile.email, profile.summary, profile.skills.length > 0].filter(Boolean).length
    : 0;
  const profilePct = Math.round((profileComplete / 4) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
              {profile?.name ? `Hey, ${profile.name.split(' ')[0]}!` : 'Hey there!'}
            </h1>
            <p className="text-blue-100 text-sm">
              {totalActivity === 0
                ? "Ready to kick-start your career? Let's build something great."
                : `You've completed ${totalActivity} career task${totalActivity !== 1 ? 's' : ''} so far. Keep going!`}
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {profilePct < 100 && (
          <div className="mt-5 p-4 bg-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100">Profile completion</span>
              <span className="text-sm font-bold text-white">{profilePct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${profilePct}%` }}
              />
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="mt-3 text-xs text-blue-100 hover:text-white flex items-center gap-1 transition-colors"
            >
              Complete your profile for better AI results <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CVs Generated', value: recentCVs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Cover Letters', value: recentLetters.length, icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Interview Sessions', value: recentInterviews.length, icon: Mic, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg Interview Score', value: avgScore !== null ? `${avgScore}%` : '—', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{stat.value}</div>
            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tools grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">AI Tools</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.title}
              onClick={() => onNavigate(tool.page)}
              className="group text-left bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.bg} flex items-center justify-center mb-4`}>
                <tool.icon className={`w-5 h-5 ${tool.text}`} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-gray-500">{tool.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions + Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Your Profile</h2>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
            >
              Edit <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {profile?.name ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0">
                {profile.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-gray-900 truncate">{profile.name}</div>
                <div className="text-sm text-gray-500 truncate">{profile.email}</div>
                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="text-xs text-gray-400">+{profile.skills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">Complete your profile to get better AI outputs</p>
              <button
                onClick={() => onNavigate('profile')}
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set up profile
              </button>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {totalActivity === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No activity yet. Try a tool to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                ...recentCVs.slice(0, 2).map((cv) => ({
                  icon: FileText,
                  label: `CV for ${cv.job_title || 'Job'}`,
                  date: cv.created_at,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                })),
                ...recentLetters.slice(0, 2).map((l) => ({
                  icon: Mail,
                  label: `Cover letter — ${l.company || 'Company'}`,
                  date: l.created_at,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                })),
                ...recentInterviews.slice(0, 2).map((s) => ({
                  icon: Mic,
                  label: `Interview: ${s.job_title || 'Role'}`,
                  date: s.created_at,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                })),
              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.label}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
