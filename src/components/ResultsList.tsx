import React from 'react';
import { JobPosting } from '../types';
import { ExternalLink, Building, Star } from 'lucide-react';

interface ResultsListProps {
  jobRole: string;
  results: JobPosting[];
}

export const ResultsList: React.FC<ResultsListProps> = ({ jobRole, results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mb-4">
          <Building className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">
          Your curated job list will appear here
        </h3>
        <p className="text-slate-400">
          Upload your resume and enter a job role to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-200">
          Top {results.length} Job Matches for {jobRole}
        </h3>
        <div className="flex items-center space-x-1 text-sm text-slate-400">
          <Star className="w-4 h-4" />
          <span>Curated by AI</span>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((job, index) => (
          <div
            key={`${job.url}-${index}`}
            className="bg-slate-700/40 hover:bg-slate-700/60 rounded-lg p-6 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-slate-100 hover:text-teal-400 transition-colors group-hover:underline flex items-center space-x-2"
                >
                  <span>{job.title}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-slate-300 font-medium">{job.company}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      job.legitimacy_score > 0.9 ? 'bg-green-400' :
                      job.legitimacy_score > 0.8 ? 'bg-teal-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-xs text-slate-400">
                      {Math.round(job.legitimacy_score * 100)}% verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {job.match_reason && (
              <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Why this job matches:</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {job.match_reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center py-6 border-t border-slate-700">
        <p className="text-slate-400 text-sm">
          All jobs have been verified by our AI anti-fraud system for legitimacy and quality.
        </p>
      </div>
    </div>
  );
};