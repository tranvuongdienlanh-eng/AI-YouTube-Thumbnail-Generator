
import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioToggleProps {
  selected: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

export const AspectRatioToggle: React.FC<AspectRatioToggleProps> = ({ selected, onChange }) => {
  const options: { value: AspectRatio; label: string }[] = [
    { value: '16:9', label: '16:9 (Video)' },
    { value: '9:16', label: '9:16 (Shorts)' },
  ];

  return (
    <div className="flex space-x-2 bg-brand-input p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full text-center px-4 py-2 rounded-md transition-colors duration-300 font-semibold text-sm ${
            selected === option.value
              ? 'bg-brand-violet text-white shadow-md'
              : 'bg-transparent text-brand-gray hover:bg-brand-border'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};