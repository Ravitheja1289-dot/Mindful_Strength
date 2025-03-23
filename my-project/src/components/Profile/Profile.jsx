import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MoodChart from './MoodChart';
import ProfileInfo from './ProfileInfo';
import ActivityLog from './ActivityLog';
import GoalTracker from './GoalTracker';

const Profile = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Simulate fetching profile data
    const fetchData = async () => {
      try {
        // This would be an actual API call in a real application
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data
        setProfileData({
          info: {
            name: currentUser.name || 'User',
            email: currentUser.email,
            joinDate: new Date(currentUser.createdAt || Date.now()),
            preferences: {
              notifications: true,
              darkMode: true,
              language: 'English'
            }
          },
          moods: [
            { date: '2023-01-01', value: 7 },
            { date: '2023-01-02', value: 6 },
            { date: '2023-01-03', value: 8 },
            { date: '2023-01-04', value: 5 },
            { date: '2023-01-05', value: 9 },
            { date: '2023-01-06', value: 7 },
            { date: '2023-01-07', value: 8 },
          ],
          activities: [
            { id: 1, type: 'chat', date: new Date(Date.now() - 3600000), description: 'Chatted with the assistant' },
            { id: 2, type: 'exercise', date: new Date(Date.now() - 86400000), description: 'Completed breathing exercise' },
            { id: 3, type: 'assessment', date: new Date(Date.now() - 172800000), description: 'Took anxiety assessment' }
          ],
          goals: [
            { id: 1, title: 'Meditate for 10 minutes daily', progress: 60, target: 100 },
            { id: 2, title: 'Complete sleep diary for a week', progress: 40, target: 100 },
            { id: 3, title: 'Practice deep breathing 3x daily', progress: 75, target: 100 }
          ]
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'info':
        return <ProfileInfo info={profileData?.info} />;
      case 'mood':
        return <MoodChart moods={profileData?.moods} />;
      case 'activity':
        return <ActivityLog activities={profileData?.activities} />;
      case 'goals':
        return <GoalTracker goals={profileData?.goals} />;
      default:
        return <ProfileInfo info={profileData?.info} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white flex items-center justify-center text-indigo-600 text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{currentUser?.name || 'User'}</h1>
            <p className="text-indigo-200 mt-1">{currentUser?.email || 'user@example.com'}</p>
            <p className="text-indigo-200 mt-1">Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'info'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('mood')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'mood'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Mood Tracker
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'activity'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Activity Log
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'goals'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Goals
          </button>
        </nav>
      </div>

      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
