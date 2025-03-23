import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCapturingImage, setIsCapturingImage] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [apiKeySet, setApiKeySet] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Function to toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };
  
  // Function to save API key
  const saveApiKey = () => {
    if (geminiApiKey.trim()) {
      setApiKeySet(true);
      // Store the API key in localStorage
      localStorage.setItem('AIzaSyDyFUmT8OtZdJDHzc0R1Ro-pBdJrSjIkDc', geminiApiKey);
      addMessage('System', 'API key set successfully. You can now use the chatbot!');
    }
  };
  
  // Function to toggle camera for face recognition
  const toggleCamera = async () => {
    if (isCapturingImage) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCapturingImage(false);
    } else {
      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
        }
        setIsCapturingImage(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        addMessage('System', 'Failed to access camera. Please check permissions.');
      }
    }
  };
  
  // Function to capture image and analyze with Gemini
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !apiKeySet) return;
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    try {
      // Convert canvas to base64 image
      const imageBase64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
      
      addMessage('User', '[Image captured for analysis]');
      
      // Call Gemini API for image analysis
      const response = await analyzeImageWithGemini(imageBase64);
      addMessage('Vision', response);
    } catch (error) {
      console.error('Error analyzing image:', error);
      addMessage('System', 'Failed to analyze image. Please try again.');
    }
  };
  
  // Function to analyze image with Gemini API
  const analyzeImageWithGemini = async (imageBase64) => {
    try {
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDG_8Lc5X4uSW50YWcT_L-aCrwOhHpLT3Q`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this image for face recognition. Describe what you see and detect any faces present."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                  }
                }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Unknown error from Gemini API');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Error analyzing image: ' + error.message;
    }
  };
  
  // Function to send text message to Gemini API
  const sendMessageToGemini = async (text) => {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDyFUmT8OtZdJDHzc0R1Ro-pBdJrSjIkDc", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: text
                }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Unknown error from Gemini API');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Error processing message: ' + error.message;
    }
  };
  
  // Function to add message to chat
  const addMessage = (sender, text) => {
    setMessages(prevMessages => [...prevMessages, { sender, text, id: Date.now() }]);
  };
  
  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim() || !apiKeySet) return;
    
    const userMessage = input.trim();
    addMessage('User', userMessage);
    setInput('');
    
    try {
      const response = await sendMessageToGemini(userMessage);
      addMessage('Gemini', response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('System', 'Failed to get response. Please try again.');
    }
  };
  
  // Load API key from localStorage if available
  useEffect(() => {
    const savedApiKey = localStorage.getItem('AIzaSyDyFUmT8OtZdJDHzc0R1Ro-pBdJrSjIkDc');
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
      setApiKeySet(true);
      addMessage('System', 'Welcome back! Your API key has been loaded.');
    } else {
      addMessage('System', 'Please enter your Google Gemini API key to begin.');
    }
  }, []);
  
  return (
    <div className="app-container">
      <h1>Gemini Chatbot</h1>
      <h2>with Speech & Face Recognition</h2>
      
      {!apiKeySet ? (
        <div className="api-key-container">
          <input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="api-key-input"
          />
          <button onClick={saveApiKey} className="api-key-button">
            Save API Key
          </button>
          <p className="api-key-note">
            Note: Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noreferrer">Google AI Studio</a>
          </p>
        </div>
      ) : (
        <>
          <div className="chat-container">
            <div className="messages-container">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender.toLowerCase()}-message`}
                >
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))}
            </div>
            
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="controls">
                <button 
                  onClick={toggleListening} 
                  className={`control-button ${isListening ? 'active' : ''}`}
                >
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
                <button onClick={handleSendMessage} className="control-button">
                  Send
                </button>
                <button 
                  onClick={toggleCamera} 
                  className={`control-button ${isCapturingImage ? 'active' : ''}`}
                >
                  {isCapturingImage ? 'Stop Camera' : 'Start Camera'}
                </button>
                {isCapturingImage && (
                  <button onClick={captureAndAnalyze} className="control-button">
                    Capture & Analyze
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {isCapturingImage && (
            <div className="video-container">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="video-element"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Chatbot;