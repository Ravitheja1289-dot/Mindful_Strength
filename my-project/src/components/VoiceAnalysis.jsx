import React, { useState } from 'react';
import { Mic } from 'lucide-react';

const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);

  // Handle voice recording
  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // In a real app, you would start recording here
      console.log("Voice recording started");
      
      // Simulate recording for 5 seconds then analyze
      setTimeout(() => {
        simulateVoiceAnalysis();
        setIsRecording(false);
      }, 5000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access the microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    // In a real app, you would stop recording here
    console.log("Voice recording stopped");
  };

  const simulateVoiceAnalysis = () => {
    // Simulate what a real voice analysis AI would detect
    const metrics = {
      speechRate: Math.random() * 5 + 2, // words per second
      pauseFrequency: Math.random() * 10, // pauses per minute
      toneVariability: Math.random() * 100, // percent variation
      emotionalMarkers: {
        positive: Math.random() * 100,
        negative: Math.random() * 100,
        neutral: Math.random() * 100
      }
    };
    
    // Normalize emotional markers
    const total = Object.values(metrics.emotionalMarkers).reduce((sum, val) => sum + val, 0);
    for (const key in metrics.emotionalMarkers) {
      metrics.emotionalMarkers[key] = (metrics.emotionalMarkers[key] / total * 100).toFixed(1);
    }
    
    // Determine risk level (this would be based on actual clinical research in a real app)
    let riskLevel = "low";
    if (metrics.emotionalMarkers.negative > 60) riskLevel = "moderate";
    if (metrics.emotionalMarkers.negative > 80) riskLevel = "high";
    
    setVoiceAnalysis({
      metrics,
      riskLevel,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="feature-card">
      <div className="card-header">
        <h2>Voice Analysis</h2>
        <button 
          className={`toggle-button ${isRecording ? 'active' : ''}`} 
          onClick={handleVoiceToggle}
        >
          <Mic size={20} />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <div className="card-content">
        <div className="voice-status">
          {isRecording ? (
            <div className="recording-indicator">
              <div className="recording-pulse"></div>
              <p>Recording in progress...</p>
            </div>
          ) : (
            <div className="recording-placeholder">Tap the microphone to start recording</div>
          )}
        </div>
        {voiceAnalysis && (
          <div className="analysis-results">
            <h3>Voice Analysis</h3>
            <div className="voice-metrics">
              <div className="metric">
                <span className="metric-label">Speech Rate:</span>
                <span className="metric-value">{voiceAnalysis.metrics.speechRate.toFixed(1)} words/sec</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pauses:</span>
                <span className="metric-value">{voiceAnalysis.metrics.pauseFrequency.toFixed(1)} per minute</span>
              </div>
              <div className="metric">
                <span className="metric-label">Tone Variability:</span>
                <span className="metric-value">{voiceAnalysis.metrics.toneVariability.toFixed(1)}%</span>
              </div>
            </div>
            <h4>Emotional Tone</h4>
            <div className="emotion-bars">
              {Object.entries(voiceAnalysis.metrics.emotionalMarkers).map(([emotion, percentage]) => (
                <div key={emotion} className="emotion-bar-container">
                  <span className="emotion-label">{emotion}</span>
                  <div className="emotion-bar">
                    <div 
                      className="emotion-bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: emotion === 'positive' ? '#4CAF50' : 
                                        emotion === 'negative' ? '#F44336' : '#9E9E9E' 
                      }}
                    ></div>
                  </div>
                  <span className="emotion-percentage">{percentage}%</span>
                </div>
              ))}
            </div>
            <div className="risk-assessment">
              <p>
                Risk Level: 
                <span className={`risk-${voiceAnalysis.riskLevel}`}>
                  {voiceAnalysis.riskLevel.toUpperCase()}
                </span>
              </p>
            </div>
            <p className="analysis-timestamp">Last updated: {voiceAnalysis.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAnalysis;