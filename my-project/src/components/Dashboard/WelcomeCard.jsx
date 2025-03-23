import React from 'react';
import { format } from 'date-fns';

const WelcomeCard = ({ userName, streak }) => {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  let greeting;
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{greeting}, {userName}!</h1>
          <p className="text-indigo-100 mt-2">
            Today is {format(currentTime, 'EEEE, MMMM do, yyyy')}
          </p>
          {streak > 0 && (
            <div className="mt-2 flex items-center">
              <span className="text-white">🔥</span>
              <span className="ml-1 text-indigo-100">You're on a {streak}-day streak!</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition-colors"
            onClick={() => window.location.href = '/chat'}
          >
            Talk to Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;