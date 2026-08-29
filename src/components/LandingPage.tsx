import { Zap, FileText, Mail, Mic, Compass, ArrowRight, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';
import type { Page } from '../lib/types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: FileText,
    title: 'AI CV Builder',
    description: 'Generate a polished, ATS-optimised CV tailored to any job description in seconds.',
    color: 'bg-blue-50 text-blue-600',
    page: 'cv-builder' as Page,
  },
  {
    icon: Mail,
    title: 'Cover Letter Generator',
    description: 'Create compelling, personalised cover letters that get callbacks — not rejections.',
    color: 'bg-emerald-50 text-emerald-600',
    page: 'cover-letter' as Page,
  },
  {
    icon: Mic,
    title: 'Interview Prep',
    description: 'Practice with AI-generated interview questions and get instant, detailed feedback.',
    color: 'bg-amber-50 text-amber-600',
    page: 'interview-prep' as Page,
  },
  {
    icon: Compass,
    title: 'Career Guidance',
    description: 'Get expert-level career advice on salary, pivots, upskilling, and more — on demand.',
    color: 'bg-rose-50 text-rose-600',
    page: 'career-guidance' as Page,
  },
];

const stats = [
  { value: '10,000+', label: 'Students Helped', icon: Users },
  { value: '94%', label: 'Interview Rate', icon: TrendingUp },
  { value: '4.9★', label: 'Average Rating', icon: Star },
];

const testimonials = [
  {
    name: 'Amara Osei',
    role: 'CS Graduate → Software Engineer',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    quote:
      "HustleMate helped me craft a CV that landed me 8 interviews in two weeks. The interview prep module is genuinely outstanding.",
  },
  {
    name: 'James Kiplangat',
    role: 'Finance Grad → Product Manager',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    quote:
      'Made a complete career pivot using the career guidance tool. The advice is specific, actionable, and actually works.',
  },
  {
    name: 'Priya Sharma',
    role: 'Marketing Intern → Brand Manager',
    avatar: 'https://images.pexels.com/photos/3774933/pexels-photo-3774933.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    quote:
      'The cover letter generator saved me hours. Every letter felt personal yet professional. I got my dream job at 22.',
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HustleMate</span>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">AI</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            AI-Powered Career Tools for Students
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Land your dream job
            <br />
            <span className="text-blue-600">with AI on your side</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            HustleMate AI helps students build standout CVs, write compelling cover letters, ace interviews, and navigate
            their career — all powered by artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="group flex items-center gap-2 bg-blue-600 text-white text-base font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('cv-builder')}
              className="flex items-center gap-2 text-gray-700 text-base font-semibold px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <FileText className="w-4 h-4" />
              Try CV Builder
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1"
              alt="Students working on careers"
              className="w-full rounded-xl shadow-lg object-cover"
              style={{ maxHeight: '340px' }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to get hired</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Four powerful AI tools, one platform. Built specifically for students entering the job market.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <button
                key={f.title}
                onClick={() => onNavigate(f.page)}
                className="group text-left bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Three steps to your next opportunity</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Build your profile',
                desc: "Enter your experience, skills, and education once. We'll use it across all tools.",
              },
              {
                step: '02',
                title: 'Choose your tool',
                desc: "CV, cover letter, mock interview, or career guidance — pick what you need today.",
              },
              {
                step: '03',
                title: 'Get AI-powered results',
                desc: "Receive tailored, professional outputs in seconds. Download, copy, and apply.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-xl font-extrabold mb-5">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Students who made it happen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Your career starts here</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of students who are already using HustleMate AI to land the jobs they deserve.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="group flex items-center gap-2 bg-white text-blue-600 text-base font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
            >
              Get started — it's free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
            {['No signup required', 'Instant results', 'Built for students'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">HustleMate AI</span>
          </div>
          <p className="text-sm">© 2024 HustleMate AI. Built for students, by students.</p>
          <div className="flex gap-6 text-sm">
            {['Features', 'About', 'Contact'].map((link) => (
              <a key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
