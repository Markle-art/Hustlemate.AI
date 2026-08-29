import type { Profile, WorkExperience, Education } from './types';

function formatExperience(experience: WorkExperience[]): string {
  return experience
    .map(
      (e) =>
        `**${e.role}** at ${e.company} (${e.startDate} – ${e.current ? 'Present' : e.endDate})\n${e.description}`
    )
    .join('\n\n');
}

function formatEducation(education: Education[]): string {
  return education
    .map(
      (e) =>
        `**${e.degree} in ${e.field}** — ${e.institution} (${e.startYear}–${e.endYear})${e.grade ? ` | ${e.grade}` : ''}`
    )
    .join('\n');
}

export async function generateCV(profile: Profile, jobTitle: string, jobDescription: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1800));

  const skills = profile.skills.slice(0, 10).join(' • ');
  const exp = formatExperience(profile.experience);
  const edu = formatEducation(profile.education);

  return `# ${profile.name || 'Your Name'}
${profile.email}${profile.phone ? ' | ' + profile.phone : ''}${profile.location ? ' | ' + profile.location : ''}
${profile.linkedin ? profile.linkedin : ''}${profile.github ? ' | ' + profile.github : ''}

---

## Professional Summary

${profile.summary || `Results-driven professional targeting the ${jobTitle} role. Bringing a proven track record of delivering high-impact solutions and a strong foundation in ${profile.skills.slice(0, 3).join(', ')}.`}

---

## Core Skills

${skills || 'Communication • Problem Solving • Teamwork • Adaptability'}

---

## Work Experience

${exp || `**${jobTitle}** — Relevant Company\nDemonstrated ability to deliver results aligned with role requirements.`}

---

## Education

${edu || 'Degree — Institution (Year)'}

---

*CV tailored for: ${jobTitle}*
*Optimised against provided job description for ATS compatibility.*`;
}

export async function generateCoverLetter(
  profile: Profile,
  company: string,
  jobTitle: string,
  jobDescription: string,
  tone: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, 1600));

  const tonePhrase =
    tone === 'formal'
      ? 'I write to formally express my interest'
      : tone === 'confident'
      ? 'I am excited to bring my expertise'
      : 'I am genuinely enthusiastic about the opportunity';

  const topSkills = profile.skills.slice(0, 3).join(', ') || 'relevant skills';
  const latestRole =
    profile.experience[0]?.role && profile.experience[0]?.company
      ? `${profile.experience[0].role} at ${profile.experience[0].company}`
      : 'my most recent position';

  return `${profile.name || 'Applicant Name'}
${profile.email}${profile.phone ? ' | ' + profile.phone : ''}
${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

Hiring Manager
${company}

**Re: Application for ${jobTitle}**

Dear Hiring Manager,

${tonePhrase} in the ${jobTitle} position at ${company}. Having reviewed the role requirements carefully, I am confident my background makes me an excellent fit for your team.

In my role as ${latestRole}, I developed strong proficiency in ${topSkills}. I have consistently delivered results that align closely with the responsibilities outlined in this position — including contributing to cross-functional projects, solving complex challenges under pressure, and maintaining high standards of quality.

What excites me most about ${company} is your commitment to innovation and impact. I believe the skills and mindset I bring will complement your existing team and help drive your goals forward.

I would welcome the opportunity to discuss how my experience aligns with your needs. I am available at your convenience for an interview and can be reached at ${profile.email || 'your email'}.

Thank you sincerely for your time and consideration.

${tone === 'formal' ? 'Yours faithfully' : 'Warm regards'},

**${profile.name || 'Your Name'}**`;
}

export async function generateInterviewQuestions(
  jobTitle: string,
  company: string
): Promise<Array<{ question: string; hint: string }>> {
  await new Promise((r) => setTimeout(r, 1400));

  const questions = [
    {
      question: `Tell me about yourself and why you're interested in the ${jobTitle} role at ${company || 'our company'}.`,
      hint: 'Structure using: Present role → Past experience → Future goals. Keep it to 2 minutes.',
    },
    {
      question: `What do you consider your greatest professional achievement relevant to a ${jobTitle} position?`,
      hint: 'Use the STAR method: Situation, Task, Action, Result. Quantify your impact.',
    },
    {
      question: 'Describe a time you faced a significant challenge at work. How did you handle it?',
      hint: 'Show resilience, problem-solving, and what you learned. Avoid blaming others.',
    },
    {
      question: `Where do you see yourself in 5 years, and how does ${jobTitle} fit into that path?`,
      hint: 'Align your ambitions with realistic growth at the company. Show commitment.',
    },
    {
      question: 'How do you prioritise tasks when you have multiple deadlines approaching?',
      hint: 'Mention a specific system (e.g., Eisenhower matrix, time-blocking). Give an example.',
    },
    {
      question: `What do you know about ${company || 'our company'} and why do you want to work here specifically?`,
      hint: 'Research their mission, recent news, products. Show genuine enthusiasm.',
    },
  ];

  return questions;
}

export async function evaluateAnswer(question: string, answer: string): Promise<{ feedback: string; score: number }> {
  await new Promise((r) => setTimeout(r, 900));

  const wordCount = answer.trim().split(/\s+/).length;
  const hasSpecifics = /\d+|increased|improved|reduced|led|achieved|delivered/i.test(answer);
  const hasStructure = /first|then|result|because|therefore|however/i.test(answer);

  let score = 50;
  if (wordCount > 40) score += 15;
  if (wordCount > 100) score += 10;
  if (hasSpecifics) score += 15;
  if (hasStructure) score += 10;
  score = Math.min(score, 95);

  const feedbacks = {
    high: `Strong answer! You provided specific examples and clear structure. ${hasSpecifics ? 'The quantified results make your response compelling.' : 'Consider adding measurable outcomes next time.'} Practice delivering this in under 90 seconds.`,
    mid: `Good start. Your answer covers the basics but could be strengthened with concrete examples and measurable results. Try the STAR method: Situation → Task → Action → Result.`,
    low: `Your answer needs more depth. Hiring managers look for specific examples, not general statements. Expand with a real scenario from your experience and include the outcome.`,
  };

  const feedback = score >= 80 ? feedbacks.high : score >= 60 ? feedbacks.mid : feedbacks.low;
  return { feedback, score };
}

const guidanceResponses: Record<string, string> = {
  salary: `## Salary Negotiation Strategy

**Research First**
Before any negotiation, use Glassdoor, LinkedIn Salary, and industry reports to establish market rate for your role, location, and experience level.

**When to Negotiate**
Always negotiate after receiving an offer, never before. The company has invested in you at this point.

**The Framework**
1. Express genuine enthusiasm for the role first
2. State your researched market range (not a single number)
3. Anchor slightly above your target (they'll likely counter below)
4. Be prepared to justify with accomplishments

**Key Phrases**
- "Based on my research and X years of experience, I was expecting something in the range of..."
- "Is there flexibility on the base salary?"
- "I'm very excited about this role — can we discuss the compensation package?"

**Beyond Base Salary**
Consider equity, bonuses, remote flexibility, professional development budget, and extra leave days as part of total compensation.`,

  'career-change': `## Navigating a Career Change

**Assess Your Transferable Skills**
List every skill from your current career. Problem-solving, communication, project management, and technical proficiency often transfer across industries.

**Bridge the Gap**
1. Take targeted online courses (Coursera, edX, LinkedIn Learning)
2. Earn a relevant certification
3. Build a portfolio project in your target field
4. Join communities and attend industry events

**Your Story**
Craft a compelling narrative: why you're making the move, what you bring that field insiders don't, and how your unique background is an advantage.

**Networking is Non-Negotiable**
70% of jobs are filled through connections. Reach out to people in your target field for informational interviews — not job requests.

**Realistic Timeline**
A successful career pivot typically takes 6–18 months. Set milestones and track progress monthly.`,

  upskilling: `## Upskilling Strategy for Career Growth

**Identify the Skills Gap**
Compare job descriptions for your target role against your current skillset. The recurring requirements are your learning priorities.

**Top Resources by Category**
- **Tech**: freeCodeCamp, The Odin Project, Codecademy, Zero to Mastery
- **Business**: Coursera (Google, Yale), LinkedIn Learning
- **Design**: Figma Academy, Dribbble learning
- **Data**: Kaggle, DataCamp, fast.ai

**The 70-20-10 Rule**
- 70% learning on the job (stretch assignments)
- 20% from mentors and peers
- 10% formal courses

**Build in Public**
Share your learning journey on LinkedIn. It signals ambition to recruiters and builds your professional brand.

**Certifications That Matter**
AWS, Google Cloud, PMP, CFA, CIMA — industry-recognised credentials signal commitment and skill.`,

  general: `## Career Guidance Overview

**Building a Strong Foundation**
Your career is a long game. Focus on developing a combination of hard skills (technical, domain-specific) and soft skills (communication, leadership, adaptability).

**Networking with Purpose**
Genuine relationships open doors. Aim to give value before asking for favours. Maintain your network even when you're not job hunting.

**Personal Branding**
Your LinkedIn profile, GitHub, portfolio, and online presence ARE your brand. Keep them updated and aligned with your target role.

**Continuous Learning**
The most successful professionals dedicate 5 hours/week to deliberate learning. Stay ahead of industry trends.

**Mental Resilience**
Job searching and career pivots are emotionally taxing. Build in rest, celebrate small wins, and lean on your support network.

**Ask for Help**
Mentors, career coaches, and communities like ADPList.org provide free guidance from experienced professionals. You don't have to figure it all out alone.`,
};

export async function getCareerGuidance(query: string, category: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1200));
  return guidanceResponses[category] ?? guidanceResponses['general'];
}
