import React from 'react';

const SuggestionChips = ({ onSuggestionClick }) => {
  const suggestions = [
    "I'm feeling anxious",
    "I need help with stress",
    "How can I improve my sleep?",
    "Mindfulness techniques",
    "Coping with depression"
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;