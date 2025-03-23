import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you feeling today?", sender: "ai" }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Handle chat messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate AI response with sentiment analysis
    setTimeout(() => {
      simulateTextAnalysis(newMessage);
    }, 1000);
  };

  const simulateTextAnalysis = (userMessage) => {
    // This simulates what a real NLP model would analyze
    const wordCount = userMessage.split(' ').length;
    const negativePhrases = ['sad', 'unhappy', 'depressed', 'anxious', 'worried', 'tired', 'exhausted', 'hopeless'];
    
    let negativeCount = 0;
    negativePhrases.forEach(phrase => {
      if (userMessage.toLowerCase().includes(phrase)) negativeCount++;
    });
    
    const sentimentScore = Math.max(-100, Math.min(100, Math.random() * 200 - 100 - (negativeCount * 20)));
    
    let response = '';
    let analysis = {
      sentiment: sentimentScore > 0 ? 'positive' : (sentimentScore < -30 ? 'negative' : 'neutral'),
      sentimentScore: sentimentScore.toFixed(1),
      wordCount,
      concernLevel: 'low'
    };
    
    // Determine response based on sentiment
    if (sentimentScore < -50) {
      response = "I notice you seem to be feeling down. Would you like to talk about what's bothering you?";
      analysis.concernLevel = 'high';
    } else if (sentimentScore < -20) {
      response = "How have things been going lately? Is there anything specific on your mind?";
      analysis.concernLevel = 'moderate';
    } else if (sentimentScore < 20) {
      response = "Thank you for sharing. How else have you been feeling recently?";
      analysis.concernLevel = 'low';
    } else {
      response = "It sounds like you're doing well! What else would you like to discuss today?";
      analysis.concernLevel = 'none';
    }
    
    // Add AI response to chat
    const aiMessage = {
      id: messages.length + 2,
      text: response,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
      analysis
    };
    setMessages(prevMessages => [...prevMessages, aiMessage]);
  };

  return (
    <div className="feature-card chat-card">
      <div className="card-header">
        <h2>AI Chat Assistant</h2>
        <MessageSquare size={20} />
      </div>
      <div className="card-content">
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`chat-message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                {message.timestamp && <span className="message-time">{message.timestamp}</span>}
              </div>
              {message.analysis && (
                <div className="message-analysis">
                  <div className="analysis-pill" style={{
                    backgroundColor: message.analysis.concernLevel === 'high' ? '#ffcdd2' :
                                    message.analysis.concernLevel === 'moderate' ? '#fff9c4' : '#e8f5e9'
                  }}>
                    {message.analysis.sentiment} ({message.analysis.sentimentScore})
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type how you're feeling..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;