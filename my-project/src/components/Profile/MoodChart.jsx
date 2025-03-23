import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodChart = ({ moods }) => {
  if (!moods || moods.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No mood data available yet. Start tracking your mood to see trends.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const data = moods.map(mood => ({
    ...mood,
    formattedDate: formatDate(mood.date)
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mood Tracker</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Log Today's Mood
        </button>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          <p>Track your mood on a scale from 1 (lowest) to 10 (highest)</p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#9CA3AF"
              />
              <YAxis 
                domain={[0, 10]} 
                stroke="#9CA3AF"
                ticks={[0, 2, 4, 6, 8, 10]} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#374151',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366F1" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;