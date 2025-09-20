const axios = require('axios');

function localRoadmapGenerator({ career, user }) {
  const steps = [
    { month: 1, title: `Foundations: Learn core ${career.skills[0]} basics`, tasks: [`Complete a beginner course on NPTEL/Coursera.`, `Set up a GitHub profile and make your first commit.`] },
    { month: 2, title: `Intermediate: Strengthen ${career.skills.slice(0, 2).join(', ')}`, tasks: [`Work on a mini-project.`, `Contribute to a relevant open-source project.`] },
    { month: 4, title: `Applied: Build a capstone project`, tasks: [`Integrate 2-3 skills into a single project (e.g., using Machine Learning with SQL).`, `Document your project and deploy it.`]},
    { month: 6, title: `Certs & Hiring Prep`, tasks: [`Complete a recognized certification.`, `Prepare a portfolio and refine your resume for job applications.`] },
  ];
  const courses = [
    { name: `Introduction to ${career.skills[0]} (NPTEL)`, type: 'online_course', link: 'https://nptel.ac.in' },
    { name: `Specialization in ${career.title} (Coursera)`, type: 'online_course', link: 'https://coursera.org' }
  ];
  const youtube = [
    { name: 'Career path in India - The complete guide', link: 'https://youtube.com/watch?v=123' }
  ];
  const jobs = [
    { title: `Junior ${career.title} at Infosys`, salary: '₹8-10 LPA' },
    { title: `Associate ${career.title} at TCS`, salary: '₹7-9 LPA' }
  ];
  const internships = [
    { company: 'Google', role: `${career.title} Intern` },
    { company: 'Amazon', role: 'Applied Scientist Intern' }
  ];

  return {
    title: `${career.title} — 6-month Starter Roadmap`,
    summary: `Personalized for ${user.name || 'student'}.`,
    steps,
    courses,
    youtube,
    jobs,
    internships
  };
}

async function generateRoadmap({ career, user }) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return localRoadmapGenerator({ career, user });
  }

  const project = process.env.GOOGLE_PROJECT_ID;
  const location = "us-central1";
  const model = "text-bison@001";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText?key=${key}`;

  const prompt = `Create a 6-month learning roadmap for a student in India to become a ${career.title}. The student's skills are: ${user.skills.join(', ')}. Include:
  1. A step-by-step roadmap with monthly milestones and tasks.
  2. Recommended courses (NPTEL/Coursera), projects, and certifications.
  3. Links to relevant YouTube videos.
  4. Example job titles and salary ranges in India (LPA).
  5. Internship opportunities.
  Output a JSON object with keys: title, summary, steps (array of objects), courses (array), youtube (array), jobs (array), internships (array).`;

  const body = {
    prompt: {
      text: prompt
    },
    temperature: 0.2,
    maxOutputTokens: 1000
  };

  const resp = await axios.post(endpoint, body);
  const text = resp.data?.candidates?.[0]?.output || resp.data?.text || JSON.stringify(resp.data);
  try {
    const json = JSON.parse(text);
    return json;
  } catch (e) {
    return { title: `AI Roadmap for ${career.title}`, summary: text.substring(0, 400), steps: [], courses: [], youtube: [], jobs: [], internships: [] };
  }
}

module.exports = { generateRoadmap };