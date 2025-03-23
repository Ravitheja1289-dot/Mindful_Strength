import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const ChatHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-3">
          <span className="text-indigo-600 font-bold">AI</span>
        </div>
        <div>
          <h2 className="font-semibold">Mental Health Assistant</h2>
          <div className="flex items-center">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/resources')}
        className="p-2 rounded-full hover:bg-indigo-700"
        title="More information"
      >
        <InformationCircleIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ChatHeader;