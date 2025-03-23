import React, { useState, useRef } from 'react';
import { MessageCircle, Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Moon, Sun, Send } from 'lucide-react';

const MentalHealthApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm here to support you. How are you feeling today?", sender: 'bot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const messageEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I understand how you feel. Would you like to talk more about that?",
        "Thank you for sharing. How does that make you feel?",
        "I'm here to listen. Would it help to explore that further?",
        "That sounds challenging. What support do you need right now?",
        "I appreciate you opening up. What would help you feel better today?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botReply = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, botReply]);
    }, 1000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleAudioRecording = () => {
    setIsRecordingAudio(!isRecordingAudio);
  };

  const toggleVideoCall = () => {
    setIsVideoCall(!isVideoCall);
    if (!isVideoCall) {
      setIsAudioCall(false);
    }
  };

  const toggleAudioCall = () => {
    setIsAudioCall(!isAudioCall);
    if (!isAudioCall) {
      setIsVideoCall(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <MessageCircle className="text-purple-500" />
          <h1 className="text-xl font-semibold">MindfulChat</h1>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} hidden md:block`}>
          <h2 className="text-lg font-semibold mb-4">Resources</h2>
          <ul className="space-y-2">
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Meditation Exercises</li>
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Breathing Techniques</li>
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Mood Tracker</li>
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Journal Prompts</li>
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Crisis Support</li>
          </ul>
          
          <h2 className="text-lg font-semibold mt-6 mb-4">Self-Care Tips</h2>
          <ul className="space-y-2">
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Sleep Hygiene</li>
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Healthy Boundaries</li>
            <li className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} cursor-pointer`}>Stress Management</li>
          </ul>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Call Area */}
          {isVideoCall && (
            <div className={`h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} p-4 relative`}>
              <div className="absolute top-2 right-2 p-2 bg-gray-900 rounded-lg">
                <Video size={24} className="text-green-500" />
              </div>
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold">BC</span>
                  </div>
                  <p>Bot Counselor</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Audio Call Area */}
          {isAudioCall && !isVideoCall && (
            <div className={`h-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} p-4 flex items-center justify-center`}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-2">
                  <Mic size={20} className="text-white" />
                </div>
                <p>Audio Call in Progress</p>
              </div>
            </div>
          )}
          
          {/* Messages */}
          <div 
            className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
            style={{ backgroundImage: isDarkMode ? 'radial-gradient(circle at center, #3730a3 0%, transparent 70%)' : 'radial-gradient(circle at center, #e0e7ff 0%, transparent 70%)' }}
          >
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                      message.sender === 'user' 
                      ? `${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white` 
                      : `${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className={`text-xs ${message.sender === 'user' ? 'text-purple-200' : isDarkMode ? 'text-gray-400' : 'text-gray-500'} block text-right mt-1`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleAudioRecording}
                  className={`p-2 rounded-full ${isRecordingAudio ? 'bg-red-500 hover:bg-red-600' : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {isRecordingAudio ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button 
                  onClick={toggleVideoCall}
                  className={`p-2 rounded-full ${isVideoCall ? 'bg-green-500 hover:bg-green-600' : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {isVideoCall ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
                <button 
                  onClick={toggleAudioCall}
                  className={`p-2 rounded-full ${isAudioCall ? 'bg-green-500 hover:bg-green-600' : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {isAudioCall ? <PhoneOff size={20} /> : <Phone size={20} />}
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className={`flex-1 p-3 rounded-lg ${
                    isDarkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white ${!inputMessage.trim() && 'opacity-50 cursor-not-allowed'}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentalHealthApp;