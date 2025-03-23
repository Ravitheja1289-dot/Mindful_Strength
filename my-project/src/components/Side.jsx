import React from 'react';
import { Home, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';

const Side = ({ isOpen, activeTab, setActiveTab }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>MindfulAI</h2>
      </div>
      <div className="sidebar-menu">
        <div 
          className={`menu-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => setActiveTab('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </div>
        <div 
          className={`menu-item ${activeTab === 'analysis' ? 'active' : ''}`} 
          onClick={() => setActiveTab('analysis')}
        >
          <FileText size={20} />
          <span>Analysis</span>
        </div>
        <div 
          className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} 
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div 
          className={`menu-item ${activeTab === 'help' ? 'active' : ''}`} 
          onClick={() => setActiveTab('help')}
        >
          <HelpCircle size={20} />
          <span>Help</span>
        </div>
        <div className="menu-item logout">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Side;