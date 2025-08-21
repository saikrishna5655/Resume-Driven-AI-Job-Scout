export interface ResumeData {
  skills: string[];
  experience_years: number;
  job_titles: string[];
  summary: string;
}

export interface JobPosting {
  url: string;
  title: string;
  company: string;
  legitimacy_score: number;
  match_reason?: string;
}

export interface AgentStatus {
  id: number;
  name: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  message: string;
}

export interface AppState {
  apiKey: string;
  hasApiKey: boolean;
  resume: File | null;
  resumeText: string;
  resumeData: ResumeData | null;
  jobRole: string;
  isSearching: boolean;
  agents: AgentStatus[];
  results: JobPosting[];
  error: string | null;
}