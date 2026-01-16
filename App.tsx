
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { PatientInfo } from './types';
import { analyzeHealthReport, getHealthAssistantResponse } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'analysis'>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [patient, setPatient] = useState<PatientInfo>({
    medistId: 'MS-8293-XP',
    firstName: 'Alex',
    lastName: 'Johnson',
    dob: '1990-05-15',
    bloodType: 'O+',
    gender: 'Male',
    nationality: 'Global Citizen'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setView('analysis');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeHealthReport(base64, file.type);
        setAnalysisResult(result);
      } catch (error) {
        console.error("Analysis failed", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
              <i className="fa-solid fa-plus-square"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Medist</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-blue-600' : ''}>My Records</button>
            <button className="hover:text-blue-600">Hospitals</button>
            <button className="hover:text-blue-600">Insurance</button>
            <button className="hover:text-blue-600">Emergency</button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-bell"></i>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"></div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {view === 'landing' && (
          <div className="flex flex-col items-center justify-center pt-20 px-6 text-center max-w-4xl mx-auto">
            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wide">
              REVOLUTIONIZING GLOBAL HEALTHCARE
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
              One Global ID. <br/> <span className="text-blue-600">Every Health Record.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Medist is the world's first universal health platform. Access your complete medical history, 
              reports, and vitals anywhere on Earth with your unique Medist ID.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => setView('dashboard')}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Access My Dashboard
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <div className="relative">
                <input 
                  type="file" 
                  id="report-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                />
                <label 
                  htmlFor="report-upload"
                  className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-cloud-arrow-up text-blue-600"></i>
                  Analyze Lab Report
                </label>
              </div>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Secure & Private</h3>
                <p className="text-slate-500 text-sm">Military-grade encryption for your most sensitive health data.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-earth-americas"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Universal Access</h3>
                <p className="text-slate-500 text-sm">Recognized by over 50,000 hospitals and clinics worldwide.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">AI Insights</h3>
                <p className="text-slate-500 text-sm">Advanced analytics to detect patterns and predict health risks.</p>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && <Dashboard patient={patient} />}

        {view === 'analysis' && (
          <div className="max-w-4xl mx-auto p-6">
            <button onClick={() => setView('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 font-semibold hover:text-blue-600">
              <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="text-3xl font-bold mb-2">AI Medical Insight</h2>
                <p className="text-blue-100">Intelligent analysis of your uploaded medical document.</p>
              </div>

              {isAnalyzing ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-bold text-slate-800">Processing Medical Data...</p>
                  <p className="text-slate-500 animate-pulse text-sm">Our AI is analyzing findings and checking global medical databases.</p>
                </div>
              ) : (
                <div className="p-8 space-y-8">
                  {analysisResult ? (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-clipboard-list text-blue-600"></i>
                          Executive Summary
                        </h3>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl italic">
                          "{analysisResult.summary}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-circle-check text-green-500"></i>
                            Key Findings
                          </h4>
                          <ul className="space-y-2">
                            {analysisResult.keyFindings?.map((item: string, i: number) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 bg-slate-400 rounded-full flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                            Abnormal Values
                          </h4>
                          <ul className="space-y-2">
                            {analysisResult.abnormalValues?.map((item: string, i: number) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 bg-amber-400 rounded-full flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-blue-900">Health Risk Assessment</h4>
                          <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">AI CALCULATED</div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${analysisResult.riskScore > 7 ? 'bg-red-500' : analysisResult.riskScore > 4 ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${analysisResult.riskScore * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-2xl font-black text-slate-800">{analysisResult.riskScore}/10</span>
                        </div>
                        <p className="text-xs text-blue-700/70 font-medium">
                          Based on this specific report and your global Medist history.
                        </p>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                          Save to Records
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">
                          Discuss with AI Assistant
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <i className="fa-solid fa-circle-exclamation text-4xl text-amber-500 mb-4"></i>
                      <p className="text-slate-800 font-bold">Analysis failed to generate results.</p>
                      <button onClick={() => setView('landing')} className="text-blue-600 font-bold mt-2">Try again</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className="mt-6 text-center text-xs text-slate-400 px-10">
              Disclaimer: Medist AI analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Menu for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-300 text-white text-xl flex items-center justify-center">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-plus-square"></i>
              </div>
              <span className="text-lg font-bold text-slate-800">Medist</span>
            </div>
            <p className="text-slate-500 text-sm text-center md:text-left">
              The universal healthcare protocol for the modern world.<br/>
              Connecting patients and doctors globally.
            </p>
          </div>
          <div className="flex gap-8 text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors"><i className="fa-brands fa-twitter text-xl"></i></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><i className="fa-brands fa-linkedin text-xl"></i></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><i className="fa-brands fa-github text-xl"></i></a>
          </div>
          <div className="text-slate-400 text-sm">
            © 2024 Medist Global Health. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
