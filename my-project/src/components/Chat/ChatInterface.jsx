import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import SuggestionChips from './SuggestionChips';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAIResponse } from '../../services/aiService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  
  // Initial greeting from the AI
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: `Hi ${currentUser?.name || 'there'}! I'm your mental health assistant. How are you feeling today?`,
          timestamp: new Date(),
          isTyping: false
        }
      ]);

      // If it's user's first time, add a welcome message with more context
      if (currentUser?.isFirstTimeUser) {
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: 2,
              sender: 'ai',
              text: "I'm here to provide support and resources for your mental wellbeing. You can share how you're feeling, ask questions, or explore coping strategies. Remember, I'm not a replacement for professional help, but I'm here to listen and assist wherever I can.",
              timestamp: new Date(),
              isTyping: false
            }
          ]);
        }, 1000);
      }
    }
  }, [currentUser]);

  // Automatically scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date(),
      isTyping: false
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Show AI typing indicator
    const typingIndicatorId = Date.now() + 1;
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        id: typingIndicatorId,
        sender: 'ai',
        text: '',
        timestamp: new Date(),
        isTyping: true
      }
    ]);
    
    setLoading(true);
    
    try {
      // Get AI response
      const response = await fetchAIResponse(text, messages);
      
      // Remove typing indicator and add AI response
      setMessages(prevMessages => 
        prevMessages
          .filter(msg => msg.id !== typingIndicatorId)
          .concat({
            id: Date.now() + 2,
            sender: 'ai',
            text: response,
            timestamp: new Date(),
            isTyping: false
          })
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Remove typing indicator and add error message
      setMessages(prevMessages => 
        prevMessages
          .filter(msg => msg.id !== typingIndicatorId)
          .concat({
            id: Date.now() + 2,
            sender: 'ai',
            text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
            timestamp: new Date(),
            isTyping: false
          })
      );
    }
    
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isCurrentUser={message.sender === 'user'} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <SuggestionChips onSuggestionClick={handleSuggestionClick} />
        <ChatInput 
          onSendMessage={sendMessage} 
          disabled={loading} 
        />
      </div>
    </div>
  );
};

export default ChatInterface;