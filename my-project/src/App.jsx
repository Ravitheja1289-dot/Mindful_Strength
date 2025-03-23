// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ChatInterface from './components/Chat/ChatInterface';
import Profile from './components/Profile/Profile';
// import Journal from './components/Journal/Journal';
// import Resources from './components/Resources/Resources';
// import Assessments from './components/Assessments/Assessments';
// import Settings from './components/Settings/Settings';
// import Navbar from './components/Common/Navbar'; 
// import Sidebar from './components/Common/Sidebar';
// import PrivateRoute from './components/Common/PrivateRoute';
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { NotificationProvider } from './contexts/NotificationContext';
import './styles/global.css';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={
                  <PrivateRoute>
                    <MainLayout 
                      sidebarOpen={sidebarOpen} 
                      toggleSidebar={toggleSidebar} 
                      isMobile={isMobile}
                    />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

function MainLayout({ sidebarOpen, toggleSidebar, isMobile }) {
  return (
    <>
      <Sidebar open={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;