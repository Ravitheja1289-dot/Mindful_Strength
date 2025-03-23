import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, isCurrentUser }) => {
  const messageClasses = isCurrentUser
    ? 'bg-indigo-600 text-white rounded-br-none'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none';

  if (message.isTyping) {
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs sm:max-w-md md:max-w-lg rounded-lg px-4 py-2 ${messageClasses}`}>
          <div className="flex space-x-1">
            <div className="typing-dot animate-bounce delay-0"></div>
            <div className="typing-dot animate-bounce delay-150"></div>
            <div className="typing-dot animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md md:max-w-lg rounded-lg px-4 py-2 ${messageClasses}`}>
        <div className="prose dark:prose-invert prose-sm">
          {isCurrentUser ? (
            <p>{message.text}</p>
          ) : (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          )}
        </div>
        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;