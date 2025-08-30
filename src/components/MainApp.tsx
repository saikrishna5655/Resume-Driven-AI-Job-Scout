import React, { useState } from 'react';
import { ResumeUpload } from './ResumeUpload';
import { JobSearch } from './JobSearch';
import { LoadingStates } from './LoadingStates';
import { ResultsList } from './ResultsList';
import { FileProcessor } from '../services/fileProcessor';
import { AgentSystem } from '../services/agentSystem';
import { AppState, AgentStatus } from '../types';
import { LogOut, RefreshCw } from 'lucide-react';

interface MainAppProps {
  apiKey: string;
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ apiKey, onLogout }) => {
  const [state, setState] = useState<AppState>({
    apiKey,
    hasApiKey: true,
    resume: null,
    resumeText: '',
    resumeData: null,
    jobRole: '',
    isSearching: false,
    agents: [],
    results: [],
    error: null
  });

  const [isProcessingResume, setIsProcessingResume] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessingResume(true);
    setState(prev => ({ ...prev, resume: file, error: null }));

    try {
      const resumeText = await FileProcessor.extractTextFromFile(file);
      setState(prev => ({ ...prev, resumeText }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to process resume'
      }));
    } finally {
      setIsProcessingResume(false);
    }
  };

  const updateAgentStatus = (agents: AgentStatus[]) => {
    setState(prev => ({ ...prev, agents }));
  };

  const handleSearch = async () => {
    if (!state.resume || !state.resumeText || !state.jobRole.trim()) {
      setState(prev => ({ ...prev, error: 'Please upload a resume and enter a job role' }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true, error: null, results: [] }));

    try {
      const agentSystem = new AgentSystem(apiKey, updateAgentStatus);
      const results = await agentSystem.executeJobSearch(state.resumeText, state.jobRole);
      
      setState(prev => ({ ...prev, results, isSearching: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        results: [],
        error: error instanceof Error ? error.message : 'Job search failed',
        isSearching: false
      }));
    }
  };

  const canSearch = Boolean(state.resume && state.resumeText && state.jobRole.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Resume-Driven AI Job Scout</h1>
              <p className="text-slate-400">Intelligent job discovery powered by AI</p>
            </div>
            <div className="flex items-center space-x-4">
              {state.results.length > 0 && !state.isSearching && (
                <button
                  onClick={() => setState(prev => ({ ...prev, results: [], agents: [] }))}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>New Search</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {state.error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{state.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <ResumeUpload
                onFileSelect={handleFileSelect}
                selectedFile={state.resume}
                isProcessing={isProcessingResume}
              />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <JobSearch
                jobRole={state.jobRole}
                onJobRoleChange={(jobRole) => setState(prev => ({ ...prev, jobRole }))}
                onSearch={handleSearch}
                isSearching={state.isSearching}
                canSearch={canSearch}
              />
            </div>

            {state.isSearching && state.agents.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <LoadingStates agents={state.agents} />
              </div>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <ResultsList jobRole={state.jobRole} results={state.results} />
          </div>
        </div>
      </main>
    </div>
  );
};