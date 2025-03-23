import React, { useState } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const toggleRecording = () => {
    // This would contain actual voice recording logic in a real app
    setIsRecording(!isRecording);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <button
        type="button"
        onClick={toggleRecording}
        className={`p-2 rounded-full ${
          isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        <MicrophoneIcon className="h-5 w-5" />
      </button>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder="Type your message..."
        className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
      />
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`p-2 rounded-full ${
          !message.trim() || disabled
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;