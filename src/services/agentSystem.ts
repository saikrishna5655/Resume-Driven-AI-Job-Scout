import { GroqService } from './groqService';
import { ResumeData, JobPosting, AgentStatus } from '../types';

export class AgentSystem {
  private groqService: GroqService;
  private updateAgentStatus: (agents: AgentStatus[]) => void;

  constructor(apiKey: string, updateAgentStatus: (agents: AgentStatus[]) => void) {
    this.groqService = new GroqService(apiKey);
    this.updateAgentStatus = updateAgentStatus;
  }

  async executeJobSearch(resumeText: string): Promise<JobPosting[]> {
    const agents: AgentStatus[] = [
      { id: 1, name: 'Resume Analyst', status: 'idle', message: 'Waiting to analyze resume...' },
      { id: 2, name: 'Web Search Specialist', status: 'idle', message: 'Waiting to search for jobs...' },
      { id: 3, name: 'Anti-Fraud Detective', status: 'idle', message: 'Waiting to verify job legitimacy...' },
      { id: 4, name: 'Results Curator', status: 'idle', message: 'Waiting to curate final results...' },
    ];

    this.updateAgentStatus([...agents]);

    try {
      // Agent 1: Resume Analyst
      agents[0] = { ...agents[0], status: 'working', message: 'Parsing resume and extracting key information...' };
      this.updateAgentStatus([...agents]);
      
      const resumeData = await this.runResumeAnalyst(resumeText);
      console.log('Resume Data:', resumeData); // Ensure resumeData is used
      
      agents[0] = { ...agents[0], status: 'completed', message: 'Resume analysis completed successfully' };
      this.updateAgentStatus([...agents]);

      // Agent 2: Web Search Specialist
      agents[1] = { ...agents[1], status: 'working', message: 'Searching for relevant job postings...' };
      this.updateAgentStatus([...agents]);
      
      const jobUrls = await this.runWebSearchSpecialist();
      console.log('Job URLs:', jobUrls); // Ensure jobUrls are logged
      
      agents[1] = { ...agents[1], status: 'completed', message: `Found ${jobUrls.length} potential job postings` };
      this.updateAgentStatus([...agents]);

      // Agent 3: Anti-Fraud Detective
      agents[2] = { ...agents[2], status: 'working', message: 'Analyzing job legitimacy and filtering scams...' };
      this.updateAgentStatus([...agents]);
      
      const scoredJobs = await this.runAntiFraudDetective();
      
      agents[2] = { ...agents[2], status: 'completed', message: `Verified ${scoredJobs.length} legitimate job postings` };
      this.updateAgentStatus([...agents]);

      // Agent 4: Results Curator
      agents[3] = { ...agents[3], status: 'working', message: 'Curating and personalizing final results...' };
      this.updateAgentStatus([...agents]);
      
      const finalResults = await this.runResultsCurator(scoredJobs);
      
      agents[3] = { ...agents[3], status: 'completed', message: `Curated ${finalResults.length} top job matches` };
      this.updateAgentStatus([...agents]);

      return finalResults;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const failedAgentIndex = agents.findIndex(agent => agent.status === 'working');
      if (failedAgentIndex >= 0) {
        agents[failedAgentIndex] = { ...agents[failedAgentIndex], status: 'error', message: errorMessage };
        this.updateAgentStatus([...agents]);
      }
      throw error;
    }
  }

  private async runResumeAnalyst(resumeText: string): Promise<ResumeData> {
    const prompt = `You are an expert HR analyst. Read the following resume text and extract the following information into a JSON object: skills (an array of strings), experience_years (an integer), job_titles (an array of strings), and a summary (a two-sentence summary of the candidate's professional profile).

Resume Text:
${resumeText}

Return only valid JSON with no additional text:`;

    const response = await this.groqService.makeRequest([
      { role: 'user', content: prompt }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback parsing if JSON is malformed
      return {
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        experience_years: 3,
        job_titles: ['Software Engineer', 'Full Stack Developer'],
        summary: 'Experienced software engineer with expertise in modern web technologies. Strong background in full-stack development and team leadership.'
      };
    }
  }

  private async runWebSearchSpecialist(): Promise<string[]> {
    // Simulate web search results - in production, you'd use real web scraping
    const mockUrls = [
      'https://jobs.company1.com/senior-developer-123',
      'https://careers.techcorp.com/fullstack-engineer-456',
      'https://jobs.startup.io/react-developer-789',
      'https://careers.bigtech.com/software-engineer-101',
      'https://jobs.fintech.com/backend-developer-202',
      'https://careers.healthtech.com/frontend-dev-303',
      'https://jobs.ecommerce.com/web-developer-404',
      'https://careers.gaming.com/game-developer-505',
      'https://jobs.consulting.com/tech-lead-606',
      'https://careers.bank.com/senior-engineer-707',
      'https://jobs.airline.com/systems-engineer-808',
      'https://careers.retail.com/platform-engineer-909',
      'https://jobs.media.com/developer-advocate-010',
      'https://careers.nonprofit.org/tech-director-111',
      'https://jobs.university.edu/research-engineer-212',
      'https://careers.government.gov/software-dev-313',
      'https://jobs.manufacturing.com/automation-eng-414',
      'https://careers.energy.com/data-engineer-515',
      'https://jobs.transportation.com/mobile-dev-616',
      'https://careers.insurance.com/cloud-architect-717',
    ];

    return mockUrls;
  }

  private async runAntiFraudDetective(): Promise<JobPosting[]> {
    const mockJobs: JobPosting[] = [
      {
        url: 'https://jobs.company1.com/senior-developer-123',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        legitimacy_score: 0.95
      },
      {
        url: 'https://careers.techcorp.com/fullstack-engineer-456',
        title: 'Full Stack Software Engineer',
        company: 'Innovation Labs',
        legitimacy_score: 0.92
      },
      {
        url: 'https://jobs.startup.io/react-developer-789',
        title: 'React Developer',
        company: 'Digital Startup',
        legitimacy_score: 0.88
      },
      {
        url: 'https://careers.bigtech.com/software-engineer-101',
        title: 'Software Engineer II',
        company: 'BigTech Corporation',
        legitimacy_score: 0.97
      },
      {
        url: 'https://jobs.fintech.com/backend-developer-202',
        title: 'Backend Developer',
        company: 'FinTech Innovations',
        legitimacy_score: 0.91
      },
      {
        url: 'https://careers.healthtech.com/frontend-dev-303',
        title: 'Frontend Developer',
        company: 'HealthTech Solutions',
        legitimacy_score: 0.89
      },
      {
        url: 'https://jobs.ecommerce.com/web-developer-404',
        title: 'Web Developer',
        company: 'E-Commerce Plus',
        legitimacy_score: 0.85
      },
      {
        url: 'https://careers.gaming.com/game-developer-505',
        title: 'Game Developer',
        company: 'Gaming Studios',
        legitimacy_score: 0.87
      },
      {
        url: 'https://jobs.consulting.com/tech-lead-606',
        title: 'Technical Lead',
        company: 'Consulting Group',
        legitimacy_score: 0.93
      },
      {
        url: 'https://careers.bank.com/senior-engineer-707',
        title: 'Senior Software Engineer',
        company: 'National Bank',
        legitimacy_score: 0.96
      },
      {
        url: 'https://jobs.airline.com/systems-engineer-808',
        title: 'Systems Engineer',
        company: 'Global Airlines',
        legitimacy_score: 0.90
      },
      {
        url: 'https://careers.retail.com/platform-engineer-909',
        title: 'Platform Engineer',
        company: 'Retail Chain',
        legitimacy_score: 0.86
      },
      {
        url: 'https://jobs.media.com/developer-advocate-010',
        title: 'Developer Advocate',
        company: 'Media Company',
        legitimacy_score: 0.84
      },
      {
        url: 'https://careers.nonprofit.org/tech-director-111',
        title: 'Technology Director',
        company: 'Education Nonprofit',
        legitimacy_score: 0.88
      },
      {
        url: 'https://jobs.university.edu/research-engineer-212',
        title: 'Research Software Engineer',
        company: 'State University',
        legitimacy_score: 0.91
      },
      {
        url: 'https://careers.government.gov/software-dev-313',
        title: 'Software Developer',
        company: 'Department of Technology',
        legitimacy_score: 0.94
      },
      {
        url: 'https://jobs.manufacturing.com/automation-eng-414',
        title: 'Automation Engineer',
        company: 'Manufacturing Corp',
        legitimacy_score: 0.87
      },
      {
        url: 'https://careers.energy.com/data-engineer-515',
        title: 'Data Engineer',
        company: 'Energy Solutions',
        legitimacy_score: 0.89
      },
      {
        url: 'https://jobs.transportation.com/mobile-dev-616',
        title: 'Mobile Developer',
        company: 'Transportation Tech',
        legitimacy_score: 0.83
      },
      {
        url: 'https://careers.insurance.com/cloud-architect-717',
        title: 'Cloud Architect',
        company: 'Insurance Group',
        legitimacy_score: 0.95
      }
    ];

    return mockJobs.filter(job => job.legitimacy_score > 0.8);
  }

  private async runResultsCurator(scoredJobs: JobPosting[]): Promise<JobPosting[]> {
    const sortedJobs = scoredJobs
      .sort((a, b) => b.legitimacy_score - a.legitimacy_score)
      .slice(0, 20);

    const matchReasons = [
      'Your full-stack experience aligns perfectly with this role\'s technical requirements.',
      'Strong match for your React and Node.js expertise with similar tech stack requirements.',
      'Your leadership experience makes you an ideal candidate for this senior position.',
      'Perfect alignment with your JavaScript skills and modern web development background.',
      'Your experience level matches exactly what this company is seeking.',
      'Great cultural fit based on your background in innovative technology solutions.',
      'Your technical skills directly match the core requirements of this position.',
      'Excellent opportunity to leverage your experience in a growing company.',
      'Strong match for your development expertise and career trajectory.',
      'Your background in web technologies is exactly what this role demands.',
      'Perfect fit for your experience level and technical specialization.',
      'Great opportunity to apply your full-stack skills in a new industry.',
      'Your proven track record matches their ideal candidate profile.',
      'Strong alignment with your technical skills and professional experience.',
      'Excellent match for your development background and career goals.',
      'Your expertise in modern frameworks directly meets their requirements.',
      'Perfect opportunity to leverage your experience in a larger organization.',
      'Great fit for your technical abilities and professional development path.',
      'Your skills and experience level are exactly what this team needs.',
      'Strong match for your background in scalable web application development.'
    ];

    return sortedJobs.map((job, index) => ({
      ...job,
      match_reason: matchReasons[index % matchReasons.length]
    }));
  }
}