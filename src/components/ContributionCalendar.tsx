import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../context/ThemeContext';

const ContributionCalendar = ({ username }: { username: string }) => {
  const { theme } = useTheme();
  
  const themeColors = {
    default: {
      background: 'transparent',
      text: '#4B5563',
      light: ['#F5F3FF', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6']
    },
    halloween: {
      background: 'transparent',
      text: '#4B5563',
      light: ['#FFF7ED', '#FED7AA', '#FDBA74', '#FB923C', '#EA580C']
    },
    hacker: {
      background: 'transparent',
      text: '#4B5563',
      light: ['#ECFDF5', '#A7F3D0', '#6EE7B7', '#34D399', '#059669']
    },
    matrix: {
      background: 'transparent',
      text: '#4B5563',
      light: ['#ECFDF5', '#A7F3D0', '#6EE7B7', '#34D399', '#059669']
    },
    retro: {
      background: 'transparent',
      text: '#4B5563',
      light: ['#FFE4E6', '#FDA4AF', '#FB7185', '#E11D48', '#BE123C']
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-sm rounded-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Contribution Activity</h3>
      <div className="overflow-x-auto">
        <GitHubCalendar
          username={username}
          theme={themeColors[theme as keyof typeof themeColors]}
          fontSize={12}
        />
      </div>
    </div>
  );
};

export default ContributionCalendar;