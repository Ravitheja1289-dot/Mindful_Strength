<<<<<<< Updated upstream
import React from "react";
import MentalHealthChatbot from "./components/Chatbot";

const App = () => {
  return (
    <div className="app-container">
      <h1>Welcome to the Mental Health Chatbot</h1>
      <Chatbot />
=======
import React, { useState } from 'react';
import './App.css';
import SideBar from './components/Side';
import TopNavigation from './components/TopNavigation';
import FacialAnalysis from './components/FacialAnalysis';
import VoiceAnalysis from './components/VoiceAnalysis';
import ChatAssistant from './components/ChatAssistant';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Sidebar Component */}
      <SideBar 
        isOpen={isSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation Component */}
        <TopNavigation 
          toggleSidebar={toggleSidebar} 
          profileOpen={profileOpen} 
          setProfileOpen={setProfileOpen} 
        />

        {/* Feature Cards */}
        <div className="feature-cards">
          {/* Facial Analysis Component */}
          <FacialAnalysis />
          
          {/* Voice Analysis Component */}
          <VoiceAnalysis />
          
          {/* Chat Assistant Component */}
          <ChatAssistant />
        </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default App;