import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import WelcomeCard from './WelcomeCard';
import QuickActions from './QuickActions';
import MoodSummary from './MoodSummary';
import InsightCard from './InsightCard';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchData = async () => {
      try {
        // This would be an actual API call in a real application
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data
        setDashboardData({
          streak: 5,
          lastActivity: new Date(Date.now() - 86400000),
          recentMoods: [
            { date: '2023-01-03', value: 8 },
            { date: '2023-01-04', value: 5 },
            { date: '2023-01-05', value: 9 },
            { date: '2023-01-06', value: 7 },
            { date: '2023-01-07', value: 8 },
          ],
          insights: [
            { 
              id: 1, 
              title: 'Sleep Pattern Impact', 
              description: 'Your mood scores are higher on days following 7+ hours of sleep.'
            },
            { 
              id: 2, 
              title: 'Exercise Correlation', 
              description: 'You reported better mood on days with physical activity.'
            }
          ],
          activities: [
            { id: 1, type: 'chat', date: new Date(Date.now() - 3600000), description: 'Chatted with the assistant' },
            { id: 2, type: 'exercise', date: new Date(Date.now() - 86400000), description: 'Completed breathing exercise' },
            { id: 3, type: 'assessment', date: new Date(Date.now() - 172800000), description: 'Took anxiety assessment' }
          ]
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeCard 
        userName={currentUser?.name || 'there'} 
        streak={dashboardData?.streak || 0}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <QuickActions onActionClick={(action) => {
            if (action === 'chat') navigate('/chat');
            else if (action === 'journal') navigate('/journal');
            else if (action === 'assessment') navigate('/assessments');
          }} />
        </div>
        <div>
          <MoodSummary moods={dashboardData?.recentMoods || []} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InsightCard insights={dashboardData?.insights || []} />
        </div>
        <div>
          <RecentActivity activities={dashboardData?.activities || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;