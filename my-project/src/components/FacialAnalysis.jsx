import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

const FacialAnalysis = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [emotionAnalysis, setEmotionAnalysis] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle camera activation
  const handleCameraToggle = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        // Start emotion detection when camera is on
        startEmotionDetection();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      // Reset emotion analysis when camera is off
      setEmotionAnalysis(null);
    }
  };

  // Simulated emotion detection from video stream
  const startEmotionDetection = () => {
    const emotionDetectionInterval = setInterval(() => {
      if (!cameraActive) {
        clearInterval(emotionDetectionInterval);
        return;
      }

      // Capture image from video for analysis
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Simulate AI emotion analysis
        simulateEmotionAnalysis();
      }
    }, 3000); // Analyze every 3 seconds
  };

  const simulateEmotionAnalysis = () => {
    // This simulates what a real AI model would detect
    const emotions = ['neutral', 'happy', 'sad', 'anxious', 'stressed'];
    const confidences = {};
    
    // Generate random confidence levels for each emotion
    emotions.forEach(emotion => {
      confidences[emotion] = Math.random();
    });
    
    // Normalize to make total 1.0
    const total = Object.values(confidences).reduce((sum, val) => sum + val, 0);
    emotions.forEach(emotion => {
      confidences[emotion] = (confidences[emotion] / total * 100).toFixed(1);
    });
    
    setEmotionAnalysis({
      dominantEmotion: emotions.reduce((a, b) => confidences[a] > confidences[b] ? a : b),
      confidences,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="feature-card">
      <div className="card-header">
        <h2>Facial Analysis</h2>
        <button 
          className={`toggle-button ${cameraActive ? 'active' : ''}`} 
          onClick={handleCameraToggle}
        >
          <Camera size={20} />
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
      <div className="card-content">
        <div className="video-container">
          <video ref={videoRef} autoPlay muted className={cameraActive ? 'active' : ''}></video>
          <canvas ref={canvasRef} width="320" height="240" style={{display: 'none'}}></canvas>
          {!cameraActive && <div className="camera-placeholder">Camera is off</div>}
        </div>
        {emotionAnalysis && (
          <div className="analysis-results">
            <h3>Emotion Analysis</h3>
            <p className="dominant-emotion">Primary Emotion: <span>{emotionAnalysis.dominantEmotion}</span></p>
            <div className="emotion-bars">
              {Object.entries(emotionAnalysis.confidences).map(([emotion, confidence]) => (
                <div key={emotion} className="emotion-bar-container">
                  <span className="emotion-label">{emotion}</span>
                  <div className="emotion-bar">
                    <div 
                      className="emotion-bar-fill" 
                      style={{ width: `${confidence}%`, backgroundColor: getEmotionColor(emotion) }}
                    ></div>
                  </div>
                  <span className="emotion-percentage">{confidence}%</span>
                </div>
              ))}
            </div>
            <p className="analysis-timestamp">Last updated: {emotionAnalysis.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for emotion colors
function getEmotionColor(emotion) {
  const colors = {
    happy: '#4CAF50',
    sad: '#2196F3',
    angry: '#F44336',
    anxious: '#FF9800',
    neutral: '#9E9E9E',
    stressed: '#9C27B0'
  };
  return colors[emotion] || '#9E9E9E';
}

export default FacialAnalysis;