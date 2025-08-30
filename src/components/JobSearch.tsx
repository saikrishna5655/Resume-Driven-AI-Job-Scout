import React from 'react';
import { Search, Briefcase } from 'lucide-react';

interface JobSearchProps {
  jobRole: string;
  onJobRoleChange: (role: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  canSearch: boolean;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  jobRole,
  onJobRoleChange,
  onSearch,
  isSearching,
  canSearch
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSearch && !isSearching) {
      console.log('Search triggered with job role:', jobRole); // Debugging log
      onSearch();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">Job Role</h3>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Briefcase className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => onJobRoleChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Senior Data Scientist"
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          onClick={onSearch}
          disabled={!canSearch || isSearching}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 group"
        >
          {isSearching ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>AI Agents are working...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Search for Jobs</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};