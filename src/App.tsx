import React, { useState, useEffect } from 'react';
import { ApiKeySetup } from './components/ApiKeySetup';
import { MainApp } from './components/MainApp';
import { StorageService } from './utils/storage';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedApiKey = StorageService.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setHasApiKey(true);
    }
    setIsLoading(false);
  }, []);

  const handleApiKeyValidated = (validatedApiKey: string) => {
    StorageService.saveApiKey(validatedApiKey);
    setApiKey(validatedApiKey);
    setHasApiKey(true);
  };

  const handleLogout = () => {
    StorageService.removeApiKey();
    setApiKey('');
    setHasApiKey(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasApiKey) {
    return <ApiKeySetup onApiKeyValidated={handleApiKeyValidated} />;
  }

  return <MainApp apiKey={apiKey} onLogout={handleLogout} />;
}

export default App;