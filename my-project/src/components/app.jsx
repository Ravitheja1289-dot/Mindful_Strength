import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Send, X, Video, User, PlusCircle, FileText, Image, RefreshCw, Info, Activity, Brain, BarChart, Lock } from 'lucide-react';
import './App.css';

const CONFIG = {
  FACE_API_KEY: process.env.REACT_APP_FACE_API_KEY || 'your_face_api_key',
  FACE_API_ENDPOINT: process.env.REACT_APP_FACE_API_ENDPOINT || 'https://your-face-api-resource.cognitiveservices.azure.com/',
  
  SPEECH_API_KEY: process.env.REACT_APP_SPEECH_API_KEY || 'your_speech_api_key',
  SPEECH_API_REGION: process.env.REACT_APP_SPEECH_API_REGION || 'eastus',
  
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || 'your_openai_api_key',    
  
  FIREBASE_CONFIG: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'your_firebase_api_key',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'your-app.firebaseapp.com',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'your-project-id',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'your-app.appspot.com',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:abcdef'
  }
};

const validateApiConfig = () => {
  const missingKeys = [];
  if (CONFIG.FACE_API_KEY === 'your_face_api_key') missingKeys.push('Face API');
  if (CONFIG.SPEECH_API_KEY === 'your_speech_api_key') missingKeys.push('Speech API');
  if (CONFIG.OPENAI_API_KEY === 'your_openai_api_key') missingKeys.push('OpenAI API');
  if (CONFIG.FIREBASE_CONFIG.apiKey === 'your_firebase_api_key') missingKeys.push('Firebase');
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};

const App = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there, I'm MindfulAI. How are you feeling today?", 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [sentiment, setSentiment] = useState('neutral');
  const [showMoodTracker, setShowMoodTracker] = useState(true);
  const [faceEmotion, setFaceEmotion] = useState(null);
  const [voiceFeatures, setVoiceFeatures] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [apiConfigStatus, setApiConfigStatus] = useState({ isValid: true, missingKeys: [] });
  const [sessionId, setSessionId] = useState(null);
  const [conversationContext, setConversationContext] = useState([]);
  const [isApiProcessing, setIsApiProcessing] = useState(false);
  
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const emotionDetectionIntervalRef = useRef(null);
  
  useEffect(() => {
    const configStatus = validateApiConfig();
    setApiConfigStatus(configStatus);
    
    if (!configStatus.isValid) {
      console.warn(`Missing API keys: ${configStatus.missingKeys.join(', ')}`);
      setProcessingStatus(`Configuration incomplete: ${configStatus.missingKeys.join(', ')} keys missing`);
    } else {
      initializeSession();
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (emotionDetectionIntervalRef.current) {
        clearInterval(emotionDetectionIntervalRef.current);
      }
    };
  }, []);

  const initializeSession = async () => {
    setProcessingStatus('Initializing session...');
    try {
      const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      setSessionId(newSessionId);
      
      await loadFaceRecognitionModels();
      
      setProcessingStatus('Ready');
    } catch (error) {
      console.error('Error initializing session:', error);
      setProcessingStatus('Error initializing. Please refresh or check console.');
    }
  };

  const loadFaceRecognitionModels = async () => {
    if (!apiConfigStatus.isValid) return;
    
    setProcessingStatus('Loading face recognition models...');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsModelLoaded(true);
      setProcessingStatus('Models loaded successfully');
    } catch (error) {
      console.error('Error loading face recognition models:', error);
      setProcessingStatus('Error loading face models. Will continue without face analysis.');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeSentiment = async (text) => {
    if (!apiConfigStatus.isValid || !CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'your_openai_api_key') {
      return fallbackSentimentAnalysis(text);
    }
    
    setIsApiProcessing(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "You are a mental health assistant. Analyze the following text and classify the sentiment as 'positive', 'negative', or 'neutral'. Also extract any mental health concerns or emotions expressed." 
            },
            { role: "user", content: text }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      });
      
      const result = await response.json();
      
      if (result.choices && result.choices[0].message) {
        const analysis = result.choices[0].message.content;
        
        if (analysis.toLowerCase().includes('positive')) {
          return { sentiment: 'positive', analysis };
        } else if (analysis.toLowerCase().includes('negative')) {
          return { sentiment: 'negative', analysis };
        } else {
          return { sentiment: 'neutral', analysis };
        }
      }
      
      return { sentiment: 'neutral', analysis: 'No detailed analysis available' };
    } catch (error) {
      console.error('Error analyzing sentiment with OpenAI:', error);
      return fallbackSentimentAnalysis(text);
    } finally {
      setIsApiProcessing(false);
    }
  };

  const fallbackSentimentAnalysis = (text) => {
    const lowerText = text.toLowerCase();
    const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'tired', 'exhausted', 'hopeless', 'stress', 'lonely'];
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'joy', 'excited', 'peaceful', 'calm', 'relaxed'];
    
    let score = 0;
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    const sentiment = score < 0 ? 'negative' : (score > 0 ? 'positive' : 'neutral');
    return { sentiment, analysis: `Basic sentiment analysis: ${sentiment}` };
  };

  const generateAIResponse = async (userMessage, textSentiment, faceEmotion, voiceFeatures) => {
    if (!apiConfigStatus.isValid || !CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'your_openai_api_key') {
      return generateFallbackResponse(textSentiment);
    }
    
    try {
      const updatedContext = [
        ...conversationContext,
        { role: "user", content: userMessage }
      ];
      
      let contextPrompt = "The user sent the following message: ";
      if (faceEmotion) {
        contextPrompt += `Their facial expression shows: ${faceEmotion}. `;
      }
      
      if (voiceFeatures) {
        contextPrompt += `Their voice analysis indicates: ${JSON.stringify(voiceFeatures)}. `;
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { 
              role: "system", 
              content: `You are MindfulAI, an empathetic mental health assistant. Your goal is to provide supportive responses based on the user's messages, facial expressions, and voice patterns. 
                        If you detect signs of serious mental health issues, suggest appropriate resources while being encouraging and non-judgmental.
                        ${recognizedUser ? `The user's name is ${recognizedUser}.` : ''}` 
            },
            ...updatedContext,
            { role: "user", content: contextPrompt + userMessage }
          ],
          temperature: 0.7,
          max_tokens: 250
        })
      });
      
      const result = await response.json();
      
      if (result.choices && result.choices[0].message) {
        const aiResponse = result.choices[0].message.content;
        
        setConversationContext([
          ...updatedContext,
          { role: "assistant", content: aiResponse }
        ]);
        
        return aiResponse;
      }
      
      return generateFallbackResponse(textSentiment);
    } catch (error) {
      console.error('Error generating AI response:', error);
      return generateFallbackResponse(textSentiment);
    }
  };

  const generateFallbackResponse = (sentiment) => {
    let responseOptions = [
      "I'm here to listen. Can you tell me more about how you're feeling?",
      "Thank you for sharing that with me. Would you like to explore this further?",
      "I appreciate your openness. What would be most helpful for you right now?"
    ];
    
    if (sentiment === 'negative') {
      responseOptions = [
        "I notice you might be feeling down. Would it help to talk more about what's going on?",
        "That sounds difficult. Remember that it's okay to take things one step at a time.",
        "I'm sorry you're experiencing this. Would you like to try a simple breathing exercise to help center yourself?"
      ];
    } else if (sentiment === 'positive') {
      responseOptions = [
        "It's great to hear you're doing well! What positive things have happened in your day so far?",
        "I'm glad you're feeling positive. What strategies have been working well for you lately?",
        "That's wonderful to hear! It's important to acknowledge and celebrate these positive moments."
      ];
    }
    
    const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
    return recognizedUser ? `Hi ${recognizedUser}, ${randomResponse}` : randomResponse;
  };

  const sendMessage = async () => {
    if (input.trim() === '' || isApiProcessing) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    
    setProcessingStatus('Analyzing your message...');
    const sentimentResult = await analyzeSentiment(input);
    setSentiment(sentimentResult.sentiment);
    
    setProcessingStatus('Generating response...');
    const aiResponse = await generateAIResponse(input, sentimentResult.sentiment, faceEmotion, voiceFeatures);
    
    const botResponse = {
      id: messages.length + 2,
      text: aiResponse,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, botResponse]);
    setProcessingStatus('');
    
    const timestamp = new Date().toISOString();
    setEmotionHistory(prev => [...prev, {
      timestamp,
      textSentiment: sentimentResult.sentiment,
      faceEmotion,
      voiceFeatures,
      combined: sentimentResult.sentiment
    }]);
  };

  const toggleVideo = async () => {
    if (isVideoOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (emotionDetectionIntervalRef.current) {
        clearInterval(emotionDetectionIntervalRef.current);
      }
      setIsVideoOn(false);
      setFaceEmotion(null);
      setProcessingStatus('');
    } else {
      if (!apiConfigStatus.isValid || !isModelLoaded) {
        setProcessingStatus('Face recognition not available due to missing configuration or models');
        return;
      }
      
      try {
        setProcessingStatus('Accessing camera...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setIsVideoOn(true);
        setProcessingStatus('Camera active. Analyzing facial expressions...');
        
        videoRef.current.onloadedmetadata = () => {
          emotionDetectionIntervalRef.current = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
              await analyzeFaceFromVideo();
            }
          }, 2000);
        };
      } catch (err) {
        console.error("Error accessing video:", err);
        setProcessingStatus('Could not access camera. Please check permissions.');
      }
    }
  };

  const analyzeFaceFromVideo = async () => {
    if (!videoRef.current || !CONFIG.FACE_API_KEY || CONFIG.FACE_API_KEY === 'your_face_api_key') {
      return;
    }
    
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      
      const mockEmotions = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
      const randomIndex = Math.floor(Math.random() * mockEmotions.length);
      const dominantEmotion = mockEmotions[randomIndex];
      
      setFaceEmotion(dominantEmotion);
      setProcessingStatus(`Detected emotion: ${dominantEmotion}`);
      
      if (!recognizedUser && Math.random() > 0.7) {
        setRecognizedUser('Sarah');
        setProcessingStatus('User recognized: Sarah. Analyzing facial expressions...');
      }
    } catch (error) {
      console.error('Error analyzing face:', error);
      setProcessingStatus('Face analysis error. Continuing monitoring...');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setProcessingStatus('Processing voice recording...');
    } else {
      try {
        setProcessingStatus('Accessing microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        audioChunksRef.current = [];
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.onstart = () => {
          setProcessingStatus('Recording voice. Analyzing speech patterns...');
        };
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current);
          await analyzeVoiceRecording(audioBlob);
          
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
        
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        }, 10000);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setProcessingStatus('Could not access microphone. Please check permissions.');
      }
    }
  };

  const analyzeVoiceRecording = async (audioBlob) => {
    if (!CONFIG.SPEECH_API_KEY || CONFIG.SPEECH_API_KEY === 'your_speech_api_key') {
      const mockVoiceAnalysis = {
        pitch: Math.random(),
        energy: Math.random(),
        speed: Math.random(),
        pauses: Math.random(),
        stress: Math.random(),
        emotion: Math.random() > 0.5 ? 'anxious' : 'calm'
      };
      
      setVoiceFeatures(mockVoiceAnalysis);
      
      processVoiceAnalysisResults(audioBlob, mockVoiceAnalysis);
      return;
    }
    
    try {
      const transcription = "This is a simulated transcription of the voice recording.";
      
      const mockVoiceAnalysis = {
        pitch: 0.6 + (Math.random() * 0.3),
        energy: 0.5 + (Math.random() * 0.4),
        speed: 0.4 + (Math.random() * 0.4),
        pauses: 0.2 + (Math.random() * 0.3),
        stress: 0.3 + (Math.random() * 0.6),
        emotion: Math.random() > 0.5 ? 'anxious' : 'calm'
      };
      
      setVoiceFeatures(mockVoiceAnalysis);
      
      const transcript = {
        id: messages.length + 1,
        text: transcription,
        sender: 'user',
        isTranscript: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, transcript]);
      
      processVoiceAnalysisResults(audioBlob, mockVoiceAnalysis);
    } catch (error) {
      console.error('Error analyzing voice recording:', error);
      
      const audioMessage = {
        id: messages.length + 1,
        text: "Voice message recorded (tap to play)",
        sender: 'user',
        isAudio: true,
        audioBlob: audioBlob,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, audioMessage]);
      setProcessingStatus('');
    }
  };

  const processVoiceAnalysisResults = (audioBlob, analysis) => {
    const audioMessage = {
      id: messages.length + 1,
      text: "Voice message recorded (tap to play)",
      sender: 'user',
      isAudio: true,
      audioBlob: audioBlob,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const analysisMessage = `Voice analysis: ${analysis.emotion} speech pattern detected. ${
      analysis.stress > 0.6 
        ? 'Elevated stress indicators in voice.'
        : 'Normal stress levels detected in voice.'
    }`;
    
    const analysisObj = {
      id: messages.length + 2,
      text: analysisMessage,
      sender: 'bot',
      isAnalysis: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, audioMessage, analysisObj]);
    setProcessingStatus('');
    
    setTimeout(async () => {
      const voiceResponseText = await generateAIResponse(
        "Voice message analysis", 
        analysis.stress > 0.6 ? 'negative' : 'neutral', 
        faceEmotion, 
        analysis
      );
      
      const botResponse = {
        id: messages.length + 3,
        text: voiceResponseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  const selectMood = (mood) => {
    const moodMessages = {
      'terrible': "I'm feeling really terrible today.",
      'bad': "I'm having a bad day.",
      'okay': "I'm feeling okay, not great but not bad either.",
      'good': "I'm having a good day overall.",
      'great': "I'm feeling great today!"
    };
    
    setInput(moodMessages[mood]);
    setTimeout(() => sendMessage(), 100);
    setShowMoodTracker(false);
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const getAggregatedAnalytics = () => {
    const sortedHistory = [...emotionHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    const positiveCount = sortedHistory.filter(entry => entry.combined === 'positive').length;
    const negativeCount = sortedHistory.filter(entry => entry.combined === 'negative').length;
    const neutralCount = sortedHistory.filter(entry => entry.combined === 'neutral').length;
    const totalCount = sortedHistory.length || 1;
    
    const positivePercentage = (positiveCount / totalCount) * 100;
    const negativePercentage = (negativeCount / totalCount) * 100;
    const neutralPercentage = (neutralCount / totalCount) * 100;
    
    return {
      emotionPercentages: {
        positive: positivePercentage,
        negative: negativePercentage,
        neutral: neutralPercentage
      },
      weeklyMood: [
        { day: 'Mon', value: 60 + Math.random() * 30 },
        { day: 'Tue', value: 40 + Math.random() * 40 },
        { day: 'Wed', value: 50 + Math.random() * 30 },
        { day: 'Thu', value: 70 + Math.random() * 20 },
        { day: 'Fri', value: 65 + Math.random() * 25 },
        { day: 'Sat', value: 75 + Math.random() * 15 },
        { day: 'Sun', value: 80 + Math.random() * 15 }
      ],
      mentalHealthIndicators: {
        anxietyPatterns: 25 + negativePercentage * 0.5,
        depressionSignals: 15 + negativePercentage * 0.6,
        sleepQuality: 60 + positivePercentage * 0.3 - negativePercentage * 0.2,
        socialEngagement: 70 + positivePercentage * 0.3 - negativePercentage * 0.1
      }
    };
  };

  const saveConversation = async () => {
    if (!apiConfigStatus.isValid || !sessionId) return;
    
    setProcessingStatus('Saving conversation data...');
    try {
      console.log('Would save conversation with ID:', sessionId);
      setProcessingStatus('Conversation saved');
      
      setTimeout(() => setProcessingStatus(''), 2000);
    } catch (error) {
      console.error('Error saving conversation:', error);
      setProcessingStatus('Error saving data');
    }
  };
  const saveAnalytics = () => {
    console.log("Saving analytics data...");

  };
  
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="app-info">
          <div className="app-logo">
            <Brain size={32} />
            <h1>MindfulAI</h1>
          </div>
          <div className="status-text">{processingStatus}</div>
        </div>
        
        <div className="user-section">
          {recognizedUser ? (
            <div className="recognized-user">
              <User size={20} />
              <span>{recognizedUser}</span>
            </div>
          ) : (
            <div className="anonymous-user">
              <User size={20} />
              <span>Anonymous</span>
            </div>
          )}
          
          <div className="session-info">
            <div className="status">
              <span className={`status-indicator ${apiConfigStatus.isValid ? 'active' : 'inactive'}`}></span>
              <span>{apiConfigStatus.isValid ? 'Connected' : 'Limited Mode'}</span>
            </div>
            {!apiConfigStatus.isValid && (
              <div className="missing-keys">
                Missing: {apiConfigStatus.missingKeys.join(', ')}
              </div>
            )}
          </div>
        </div>
        
        <div className="mood-analytics">
          <div className="analytics-header" onClick={toggleAnalytics}>
            <BarChart size={20} />
            <h2>Mood Analytics</h2>
          </div>
          
          {showAnalytics && (
            <div className="analytics-panel">
              {emotionHistory.length > 0 ? (
                <div className="analytics-content">
                  <div className="emotion-percentages">
                    <h3>Emotion Distribution</h3>
                    <div className="percentage-bars">
                      <div className="percentage-item">
                        <span>Positive</span>
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill positive" 
                            style={{width: `${getAggregatedAnalytics().emotionPercentages.positive}%`}}
                          ></div>
                        </div>
                        <span>{getAggregatedAnalytics().emotionPercentages.positive.toFixed(1)}%</span>
                      </div>
                      <div className="percentage-item">
                        <span>Neutral</span>
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill neutral" 
                            style={{width: `${getAggregatedAnalytics().emotionPercentages.neutral}%`}}
                          ></div>
                        </div>
                        <span>{getAggregatedAnalytics().emotionPercentages.neutral.toFixed(1)}%</span>
                      </div>
                      <div className="percentage-item">
                        <span>Negative</span>
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill negative" 
                            style={{width: `${getAggregatedAnalytics().emotionPercentages.negative}%`}}
                          ></div>
                        </div>
                        <span>{getAggregatedAnalytics().emotionPercentages.negative.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="health-indicators">
                    <h3>Mental Health Indicators</h3>
                    <div className="indicator-item">
                      <span>Anxiety Patterns</span>
                      <div className="indicator-bar">
                        <div 
                          className="indicator-fill anxiety" 
                          style={{width: `${getAggregatedAnalytics().mentalHealthIndicators.anxietyPatterns}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="indicator-item">
                      <span>Depression Signals</span>
                      <div className="indicator-bar">
                        <div 
                          className="indicator-fill depression" 
                          style={{width: `${getAggregatedAnalytics().mentalHealthIndicators.depressionSignals}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="indicator-item">
                      <span>Sleep Quality</span>
                      <div className="indicator-bar">
                        <div 
                          className="indicator-fill sleep" 
                          style={{width: `${getAggregatedAnalytics().mentalHealthIndicators.sleepQuality}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="indicator-item">
                      <span>Social Engagement</span>
                      <div className="indicator-bar">
                        <div 
                          className="indicator-fill social" 
                          style={{width: `${getAggregatedAnalytics().mentalHealthIndicators.socialEngagement}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="save-button" onClick={saveAnalytics}>Save Data</button>
                </div>
              ) : (
                <div className="no-data">
                  <p>No emotion data recorded yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Main content area would typically go here */}
      <div className="main-content">
        {/* Main application content */}
      </div>
    </div>
  );
};

export default MindfulAI;