import { useState, useEffect } from 'react';
import { User, Plus, Trash2, Save, Loader, CheckCircle, Linkedin, Github, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile, WorkExperience, Education } from '../lib/types';

interface ProfilePageProps {
  profile: Profile | null;
  onProfileSaved: (profile: Profile) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

const defaultExperience = (): WorkExperience => ({
  id: generateId(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const defaultEducation = (): Education => ({
  id: generateId(),
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  grade: '',
});

export function ProfilePage({ profile, onProfileSaved }: ProfilePageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<WorkExperience[]>([defaultExperience()]);
  const [education, setEducation] = useState<Education[]>([defaultEducation()]);
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'links'>('basic');

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
      setPhone(profile.phone ?? '');
      setLocation(profile.location ?? '');
      setSummary(profile.summary ?? '');
      setSkills(profile.skills ?? []);
      setExperience(profile.experience?.length > 0 ? profile.experience : [defaultExperience()]);
      setEducation(profile.education?.length > 0 ? profile.education : [defaultEducation()]);
      setLinkedin(profile.linkedin ?? '');
      setGithub(profile.github ?? '');
      setPortfolioUrl(profile.portfolio ?? '');
    }
  }, [profile]);

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
    setSkillInput('');
  }

  function removeSkill(s: string) {
    setSkills(skills.filter((sk) => sk !== s));
  }

  function updateExperience(id: string, field: keyof WorkExperience, value: any) {
    setExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeExperience(id: string) {
    setExperience(experience.filter((e) => e.id !== id));
  }

  function updateEducation(id: string, field: keyof Education, value: any) {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeEducation(id: string) {
    setEducation(education.filter((e) => e.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = {
        name,
        email,
        phone,
        location,
        summary,
        skills,
        experience,
        education,
        linkedin,
        github,
        portfolio: portfolioUrl,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (profile?.id) {
        result = await supabase.from('profiles').update(data).eq('id', profile.id).select().maybeSingle();
      } else {
        result = await supabase.from('profiles').insert(data).select().maybeSingle();
      }

      if (result.error) throw result.error;
      if (result.data) onProfileSaved(result.data as Profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'links', label: 'Links' },
  ] as const;

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">My Profile</h1>
          <p className="text-gray-500 text-sm">Your information powers all AI tools. Keep it up to date for better results.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex-shrink-0"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile
            </>
          )}
        </button>
      </div>

      {/* Avatar preview */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
          {name ? name[0].toUpperCase() : <User className="w-7 h-7" />}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-lg">{name || 'Your Name'}</div>
          <div className="text-sm text-gray-500">{email || 'your.email@example.com'}</div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {skills.slice(0, 4).map((s) => (
                <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {s}
                </span>
              ))}
              {skills.length > 4 && <span className="text-xs text-gray-400">+{skills.length - 4} more</span>}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-5 py-3.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {/* Basic Info */}
          {activeTab === 'basic' && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  placeholder="Write 2–3 sentences about your professional background, key skills, and career goals..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill and press Enter..."
                    className={inputClass}
                  />
                  <button
                    onClick={addSkill}
                    className="flex-shrink-0 flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-blue-400 hover:text-blue-700">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-sm text-gray-400">No skills added yet</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={exp.id} className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Experience {idx + 1}</span>
                    {experience.length > 1 && (
                      <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Company</label>
                      <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company name" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role / Job Title</label>
                      <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Your role" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Start Date</label>
                      <input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">End Date</label>
                      <input
                        type="text"
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="Dec 2023"
                        disabled={exp.current}
                        className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
                      />
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-xs text-gray-500">Currently working here</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setExperience([...experience, defaultExperience()])}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-500 text-sm font-semibold py-3 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div className="space-y-5">
              {education.map((edu, idx) => (
                <div key={edu.id} className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Education {idx + 1}</span>
                    {education.length > 1 && (
                      <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Institution</label>
                      <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University of Nairobi" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Degree</label>
                      <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="BSc, BA, MSc..." className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Field of Study</label>
                      <input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Start Year</label>
                      <input type="text" value={edu.startYear} onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)} placeholder="2020" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">End Year</label>
                      <input type="text" value={edu.endYear} onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)} placeholder="2024" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Grade / GPA</label>
                      <input type="text" value={edu.grade} onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)} placeholder="First Class / 3.8 GPA" className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setEducation([...education, defaultEducation()])}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-500 text-sm font-semibold py-3 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
          )}

          {/* Links */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn URL
                </label>
                <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Github className="w-4 h-4 text-gray-800" /> GitHub URL
                </label>
                <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourname" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Globe className="w-4 h-4 text-gray-600" /> Portfolio / Website
                </label>
                <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://yourportfolio.com" className={inputClass} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save button bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
        </button>
      </div>
    </div>
  );
}
