import React from 'react';
import { AgentStatus } from '../types';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface LoadingStatesProps {
  agents: AgentStatus[];
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({ agents }) => {
  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'working':
        return <Loader2 className="w-5 h-5 animate-spin text-teal-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
    }
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'working':
        return 'text-teal-400';
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">AI Agents Status</h3>
      
      <div className="bg-slate-700/30 rounded-lg p-6">
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(agent.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-slate-200">
                    Agent {agent.id}: {agent.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-slate-600/50 ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {agent.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};