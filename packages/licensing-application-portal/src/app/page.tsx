'use client';

import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-application'>('dashboard');
  const [applications, setApplications] = useState<any[]>([]);

  const handleNewApplication = () => {
    setCurrentView('new-application');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleSubmitApplication = (application: any) => {
    const newApp = {
      ...application,
      id: Date.now().toString(),
      status: 'Submitted',
      submittedDate: new Date().toISOString(),
    };
    setApplications([...applications, newApp]);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">UK Property Licensing</h1>
                <p className="text-sm text-slate-600">Application Portal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {currentView === 'dashboard' ? (
          <Dashboard 
            applications={applications}
            onNewApplication={handleNewApplication}
          />
        ) : (
          <ApplicationForm 
            onSubmit={handleSubmitApplication}
            onCancel={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}

