// client/src/components/ExamplePrompts.jsx
import React from 'react';
import './ExamplePrompts.css';

const ExamplePrompts = ({ onPromptClick }) => {
  const prompts = [
    "Suggest a classic sci-fi novel",
    "I'm in the mood for a cozy fantasy",
    "What's a good book on programming?",
  ];

  return (
    <div className="example-prompts-container">
      <div className="example-prompts">
        {prompts.map((prompt, index) => (
          <button 
            key={index} 
            className="prompt-button"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;