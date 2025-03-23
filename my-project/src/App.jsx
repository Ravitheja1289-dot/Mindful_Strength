import React from 'react';
import './App.css';
import Chatbot from './components/Chatbot';


function App() {
  return (
    <div className="app-container">
      <h1>Gemini Chatbot</h1>
      <h2>with Speech & Face Recognition</h2>
      
      <Chatbot />
    </div>
  );
}

export default App;
