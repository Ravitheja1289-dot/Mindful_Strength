import React, { useState, useEffect } from 'react';
import { Camera, Mic, FileText, Shield, User, AlertCircle, CheckCircle, Settings, PieChart, Calendar } from 'lucide-react';
import './MentalHealthApp.css'
const MentalHealthApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [moodHistory, setMoodHistory] = useState([
    { date: '2025-03-16', score: 68 },
    { date: '2025-03-17', score: 72 },
    { date: '2025-03-18', score: 65 },
    { date: '2025-03-19', score: 58 },
    { date: '2025-03-20', score: 61 },
    { date: '2025-03-21', score: 70 },
    { date: '2025-03-22', score: 75 },
  ]);
  
  const [insuranceConnected, setInsuranceConnected] = useState(false);
  const [providerConnected, setProviderConnected] = useState(true);
  
  // Sample analysis results
  const analysisResults = {
    riskLevel: 'Low',
    moodScore: 75,
    anxietyIndicators: 12,
    depressionIndicators: 8,
    recommendations: [
      'Continue daily mindfulness practice',
      'Maintain regular sleep schedule',
      'Schedule follow-up with Dr. Martinez'
    ]
  };
  
  const startRecording = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }, 2000);
    }, 3000);
  };
  
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <span className="text-blue-400 mr-2">Mind</span>
            <span className="text-purple-400">Sense</span>
            <span className="ml-2 px-2 py-1 bg-blue-900 rounded-md text-xs text-blue-300">AI</span>
          </h1>
          <div className="flex items-center">
            <div className="bg-blue-900 text-blue-300 p-1 rounded-full mr-4">
              <Settings size={20} />
            </div>
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <nav className="bg-gray-800 p-4 md:w-64 flex md:flex-col justify-between md:h-screen md:fixed overflow-auto">
          <div className="flex md:flex-col space-x-6 md:space-x-0 md:space-y-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:bg-gray-700'}`}>
              <PieChart size={20} className="mr-3" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center p-2 rounded-lg ${activeTab === 'analyze' ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:bg-gray-700'}`}>
              <Mic size={20} className="mr-3" />
              <span className="hidden md:inline">Analyze</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center p-2 rounded-lg ${activeTab === 'history' ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:bg-gray-700'}`}>
              <Calendar size={20} className="mr-3" />
              <span className="hidden md:inline">History</span>
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center p-2 rounded-lg ${activeTab === 'privacy' ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:bg-gray-700'}`}>
              <Shield size={20} className="mr-3" />
              <span className="hidden md:inline">Privacy</span>
            </button>
            <button 
              onClick={() => setActiveTab('providers')}
              className={`flex items-center p-2 rounded-lg ${activeTab === 'providers' ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:bg-gray-700'}`}>
              <User size={20} className="mr-3" />
              <span className="hidden md:inline">Providers</span>
            </button>
          </div>
          <div className="hidden md:block text-xs text-gray-500 mt-auto pt-4">
            <p>All data encrypted</p>
            <p>HIPAA Compliant</p>
          </div>
        </nav>
        
        {/* Content Area */}
        <main className="flex-grow p-4 md:ml-64">
          {showNotification && (
            <div className="fixed top-4 right-4 bg-blue-900 text-blue-300 p-3 rounded-lg shadow-lg flex items-center z-50">
              <CheckCircle size={20} className="mr-2" />
              <span>Analysis complete</span>
            </div>
          )}
          
          <div className="container mx-auto py-4">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Mental Wellness Overview</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Current Mood</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${analysisResults.riskLevel === 'Low' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {analysisResults.riskLevel} Risk
                        </span>
                      </div>
                      <div className="flex items-end mt-2">
                        <h3 className="text-3xl font-bold">{analysisResults.moodScore}</h3>
                        <span className="ml-2 text-sm text-gray-400">/100</span>
                      </div>
                      <div className="h-2 w-full bg-gray-600 rounded-full mt-2">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                          style={{ width: `${analysisResults.moodScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-400">Indicator Tracking</p>
                      <div className="flex justify-between mt-2">
                        <div>
                          <h4 className="font-semibold">Anxiety</h4>
                          <div className="flex items-center">
                            <span className="text-xl font-bold">{analysisResults.anxietyIndicators}</span>
                            <span className="ml-2 text-xs text-gray-400">detected markers</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Depression</h4>
                          <div className="flex items-center">
                            <span className="text-xl font-bold">{analysisResults.depressionIndicators}</span>
                            <span className="ml-2 text-xs text-gray-400">detected markers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Weekly Trend</h2>
                    <div className="h-40 flex items-end justify-between">
                      {moodHistory.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-gradient-to-t from-purple-600 to-blue-400 rounded-t-md" 
                            style={{ height: `${day.score * 0.4}px` }}
                          ></div>
                          <p className="text-xs text-gray-400 mt-2">{day.date.slice(-2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={16} className="mr-2 text-green-400 mt-1 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={20} className="mr-3 text-blue-400" />
                        <div>
                          <h3 className="font-medium">Dr. Martinez</h3>
                          <p className="text-sm text-gray-400">Therapist</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${providerConnected ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300'}`}>
                        {providerConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield size={20} className="mr-3 text-blue-400" />
                        <div>
                          <h3 className="font-medium">Insurance</h3>
                          <p className="text-sm text-gray-400">Blue Shield</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${insuranceConnected ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300'}`}>
                        {insuranceConnected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'analyze' && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Mental Health Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
                    <Camera size={36} className="mb-2 text-blue-400" />
                    <p>Facial Expression</p>
                    <p className="text-xs text-gray-400 mt-1">Analyze visual cues</p>
                  </button>
                  <button 
                    className={`${recording || analyzing ? 'bg-blue-900' : 'bg-gray-700 hover:bg-gray-600'} p-4 rounded-lg flex flex-col items-center justify-center transition-colors`}
                    onClick={startRecording}
                  >
                    <Mic size={36} className={`mb-2 ${recording ? 'text-red-400 animate-pulse' : analyzing ? 'text-blue-300' : 'text-blue-400'}`} />
                    <p>{recording ? 'Recording...' : analyzing ? 'Analyzing...' : 'Voice Analysis'}</p>
                    <p className="text-xs text-gray-400 mt-1">Detect speech patterns</p>
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
                    <FileText size={36} className="mb-2 text-blue-400" />
                    <p>Text Analysis</p>
                    <p className="text-xs text-gray-400 mt-1">Journal and messages</p>
                  </button>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">
                    Our AI analyzes multiple inputs to detect early signs of mental health concerns. Choose an analysis method to begin your assessment. All analyses are processed securely with data encrypted end-to-end.
                  </p>
                  <div className="flex items-center mt-4 text-sm text-gray-400">
                    <Shield size={16} className="mr-2 text-blue-400" />
                    <span>Your data is private and will only be shared with your selected healthcare providers</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Journal Entry</h3>
                  <textarea 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="How are you feeling today? Your entries will be analyzed to track your mental health patterns..."
                    rows={6}
                  ></textarea>
                  <button className="mt-3 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors">
                    Save & Analyze
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <Shield size={20} className="mr-2 text-blue-400" />
                      Data Privacy
                    </h3>
                    <p className="mt-2 text-sm text-gray-300">
                      All your health data is encrypted end-to-end and stored securely. We comply with HIPAA regulations and modern security standards.
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-3 rounded-md">
                        <h4 className="text-sm font-medium">Personal Data</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Stored with AES-256 encryption and accessible only by you
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-md">
                        <h4 className="text-sm font-medium">Analysis Results</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Shared only with authorized healthcare providers
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold">Data Sharing Controls</h3>
                    <p className="mt-2 text-sm text-gray-300 mb-4">
                      Choose who can access your mental health data and analysis results.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-blue-400" />
                          <span>Dr. Martinez (Therapist)</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="provider" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="provider" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-blue-400" />
                          <span>Dr. Park (Psychiatrist)</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="provider2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" />
                          <label htmlFor="provider2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2 text-blue-400" />
                          <span>Blue Shield Insurance</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="insurance" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" />
                          <label htmlFor="insurance" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Delete My Data</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      You can request complete deletion of all your mental health data at any time.
                    </p>
                    <button className="bg-red-900 hover:bg-red-800 text-red-300 py-2 px-4 rounded-lg transition-colors flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Request Data Deletion
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'providers' && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Healthcare Providers</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4">Your Care Team</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                            <User size={20} className="text-blue-300" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Dr. Elena Martinez</h4>
                            <p className="text-xs text-gray-400">Therapist • Connected since Jan 2025</p>
                          </div>
                        </div>
                        <button className="text-sm text-blue-400 hover:text-blue-300">Message</button>
                      </div>
                      
                      <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md opacity-50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Add Provider</h4>
                            <p className="text-xs text-gray-400">Connect with your healthcare professional</p>
                          </div>
                        </div>
                        <button className="text-sm px-3 py-1 border border-gray-600 rounded-md hover:bg-gray-700">Add</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4">Provider Integration</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Connect with mental health professionals who can access your analysis results and provide guidance based on AI-detected patterns.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-3 rounded-md">
                        <h4 className="text-sm font-medium">Automated Sharing</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Weekly reports are automatically shared with connected providers
                        </p>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none mt-2">
                          <input type="checkbox" name="toggle" id="weeklyReports" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="weeklyReports" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-3 rounded-md">
                        <h4 className="text-sm font-medium">Crisis Detection</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Alert your provider if the system detects concerning patterns
                        </p>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none mt-2">
                          <input type="checkbox" name="toggle" id="crisisAlert" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="crisisAlert" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4">Find New Providers</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Based on your analysis results, we can recommend mental health professionals specializing in your needs.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors">
                      Find Recommended Providers
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Analysis History</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Voice Analysis</h3>
                        <p className="text-xs text-gray-400">March 22, 2025 • 8:32 PM</p>
                      </div>
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">Low Risk</span>
                    </div>
                    <div className="mt-3 text-sm">
                      <p>Key findings:</p>
                      <ul className="list-disc pl-5 mt-1 text-gray-300">
                        <li>Speech pattern normal</li>
                        <li>Vocal tone consistent</li>
                        <li>Positive language markers increased by 12%</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Journal Analysis</h3>
                        <p className="text-xs text-gray-400">March 20, 2025 • 9:15 PM</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded-full text-xs">Moderate Risk</span>
                    </div>
                    <div className="mt-3 text-sm">
                      <p>Key findings:</p>
                      <ul className="list-disc pl-5 mt-1 text-gray-300">
                        <li>Increased use of negative words</li>
                        <li>Reduced sleep quality reported</li>
                        <li>Work stress indicators present</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Facial Expression Analysis</h3>
                        <p className="text-xs text-gray-400">March 17, 2025 • 10:08 AM</p>
                      </div>
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">Low Risk</span>
                    </div>
                    <div className="mt-3 text-sm">
                      <p>Key findings:</p>
                      <ul className="list-disc pl-5 mt-1 text-gray-300">
                        <li>Neutral expressions predominant</li>
                        <li>Smile frequency within normal range</li>
                        <li>No signs of emotional distress</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 text-blue-400 hover:text-blue-300 text-sm">
                    View Older Analyses
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MentalHealthApp;