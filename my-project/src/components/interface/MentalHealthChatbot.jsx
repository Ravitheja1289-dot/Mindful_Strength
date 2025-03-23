import React, { useState, useRef } from 'react';
import { AlertCircle, MessageSquare, Mic, Camera, Menu, Moon, Sun, User, BarChart } from 'lucide-react';

const MentalHealthChatbot = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { text: "Hi there! How are you feeling today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const videoRef = useRef(null);
  
  // Sample portfolio data with dates, emotions, and recommendations
  const portfolioData = [
    {
      date: "March 22, 2025",
      emotion: "Mild Anxiety",
      source: "Voice Analysis",
      recommendation: "Try 5-minute breathing exercises before meetings"
    },
    {
      date: "March 20, 2025",
      emotion: "Positive",
      source: "Facial Analysis",
      recommendation: "Continue your current social activities"
    },
    {
      date: "March 18, 2025",
      emotion: "Stress",
      source: "Text Analysis",
      recommendation: "Consider journaling before bed to process daily thoughts"
    },
    {
      date: "March 15, 2025",
      emotion: "Mild Depression",
      source: "Combined Analysis",
      recommendation: "Schedule more outdoor activities and increase physical exercise"
    },
    {
      date: "March 10, 2025",
      emotion: "Irritability",
      source: "Voice Analysis",
      recommendation: "Practice mindfulness meditation for 10 minutes daily"
    },
    {
      date: "March 7, 2025",
      emotion: "Neutral",
      source: "Facial Analysis",
      recommendation: "Maintain consistent sleep schedule to support emotional balance"
    }
  ];
  
  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Toggle sidebar menu
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Handle sending a message in chat
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: "Thanks for sharing. I've noted your feelings. Is there anything specific you'd like to talk about?", 
          sender: 'bot' 
        }
      ]);
    }, 1000);
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Here you would typically start recording
      setTimeout(() => {
        setIsRecording(false);
        // Simulate analysis completion
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "Voice analysis complete. I detected some mild stress patterns in your tone. Would you like to discuss what's on your mind?", sender: 'bot' }
        ]);
      }, 3000);
    }
  };
  
  // Toggle camera for facial analysis
  const toggleCamera = async () => {
    if (isCameraOn) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        
        // Simulate facial analysis after a few seconds
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            { text: "Facial emotion analysis complete. Your expressions suggest you might be feeling neutral to slightly worried. How accurate does that seem?", sender: 'bot' }
          ]);
        }, 5000);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };
  
  // Get the appropriate emotion color
  const getEmotionColor = (emotion) => {
    const emotions = {
      'Positive': 'bg-green-100 text-green-800',
      'Neutral': 'bg-blue-100 text-blue-800',
      'Mild Anxiety': 'bg-yellow-100 text-yellow-800',
      'Stress': 'bg-orange-100 text-orange-800',
      'Irritability': 'bg-orange-100 text-orange-800',
      'Mild Depression': 'bg-red-100 text-red-800'
    };
    
    return emotions[emotion] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div 
        className={`fixed md:relative z-10 h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'left-0' : '-left-64 md:left-0'
        } w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}
      >
        <div className="p-4 border-b flex items-center space-x-2">
          <AlertCircle className="text-blue-500" />
          <h1 className="text-xl font-bold">MindfulAI</h1>
        </div>
        
        <nav className="flex-1">
          <button
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
              activeTab === 'chat' 
                ? `${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} ${isDarkMode ? 'text-white' : 'text-blue-500'}`
                : ''
            }`}
            onClick={() => {
              setActiveTab('chat');
              setIsSidebarOpen(false);
            }}
          >
            <MessageSquare size={20} />
            <span>Chat Analysis</span>
          </button>
          
          <button
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
              activeTab === 'voice' 
                ? `${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} ${isDarkMode ? 'text-white' : 'text-blue-500'}`
                : ''
            }`}
            onClick={() => {
              setActiveTab('voice');
              setIsSidebarOpen(false);
            }}
          >
            <Mic size={20} />
            <span>Voice Analysis</span>
          </button>
          
          <button
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
              activeTab === 'face' 
                ? `${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} ${isDarkMode ? 'text-white' : 'text-blue-500'}`
                : ''
            }`}
            onClick={() => {
              setActiveTab('face');
              setIsSidebarOpen(false);
            }}
          >
            <Camera size={20} />
            <span>Facial Analysis</span>
          </button>
          
          <button
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
              activeTab === 'portfolio' 
                ? `${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} ${isDarkMode ? 'text-white' : 'text-blue-500'}`
                : ''
            }`}
            onClick={() => {
              setActiveTab('portfolio');
              setIsSidebarOpen(false);
            }}
          >
            <BarChart size={20} />
            <span>Portfolio</span>
          </button>
        </nav>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow flex justify-between items-center`}>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md md:hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <Menu size={20} />
          </button>
          
          <div className="md:ml-4 md:text-lg font-medium">
            {activeTab === 'chat' && 'Chat Analysis'}
            {activeTab === 'voice' && 'Voice Analysis'}
            {activeTab === 'face' && 'Facial Analysis'}
            {activeTab === 'portfolio' && 'Emotion Portfolio'}
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <User size={18} />
            </button>
          </div>
        </header>
        
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'chat' && (
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? `ml-auto ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white` 
                      : `${isDarkMode ? 'bg-gray-700' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-gray-800'} shadow`
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'voice' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className={`w-64 h-64 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow flex items-center justify-center`}>
                <Mic 
                  size={64} 
                  className={isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}
                />
              </div>
              <button
                onClick={toggleRecording}
                className={`px-6 py-3 rounded-full font-medium ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Voice Analysis'}
              </button>
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Speak naturally for 30 seconds. The AI will analyze your voice patterns for signs of stress, anxiety, or depression.
              </p>
            </div>
          )}
          
          {activeTab === 'face' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className={`w-full max-w-lg aspect-video rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                {isCameraOn ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={64} className="text-gray-400" />
                )}
              </div>
              <button
                onClick={toggleCamera}
                className={`px-6 py-3 rounded-full font-medium ${
                  isCameraOn 
                    ? 'bg-red-500 text-white' 
                    : `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                }`}
              >
                {isCameraOn ? 'Stop Camera' : 'Start Facial Analysis'}
              </button>
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The camera will analyze your facial expressions to detect emotional patterns that might indicate mood changes.
              </p>
            </div>
          )}
          
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h2 className="text-lg font-medium mb-3">Your Emotional History</h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  This portfolio shows your emotional patterns over time, based on AI analysis of your text, voice, and facial expressions.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="text-sm uppercase font-medium opacity-75">Overall Trend</h3>
                    <p className="text-lg font-medium">Improving</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="text-sm uppercase font-medium opacity-75">Sessions</h3>
                    <p className="text-lg font-medium">18 Total</p>
                  </div>
                </div>
              </div>
              
              {/* Portfolio entry list */}
              <div className="space-y-3">
                {portfolioData.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isDarkMode 
                          ? getEmotionColor(entry.emotion).replace('bg-', 'bg-opacity-20 bg-')
                          : getEmotionColor(entry.emotion)
                      }`}>
                        {entry.emotion}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {entry.date}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-1">
                      <span className="font-medium">Source: </span>
                      {entry.source}
                    </p>
                    
                    <div className={`mt-2 p-3 rounded text-sm ${
                      isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                    }`}>
                      <span className="font-medium">Recommendation: </span>
                      {entry.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Input area for chat */}
        {activeTab === 'chat' && (
          <form 
            onSubmit={handleSendMessage}
            className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t flex`}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type how you're feeling..."
              className={`flex-1 px-4 py-2 rounded-l-lg focus:outline-none ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-r-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
            >
              Send
            </button>
          </form>
        )}
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MentalHealthChatbot;