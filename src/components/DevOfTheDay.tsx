import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy } from 'lucide-react';

interface DevOfTheDay {
  login: string;
  avatar_url: string;
  bio: string;
  html_url: string;
}

const DevOfTheDay = () => {
  const [dev, setDev] = useState<DevOfTheDay | null>(null);

  useEffect(() => {
    const fetchDevOfTheDay = async () => {
      try {
        // List of inspiring developers
        const developers = [
          'gaearon',
          'tj',
          'sindresorhus',
          'kentcdodds',
          'thepracticaldev',
          'yyx990803',
          'addyosmani',
        ];
        
        // Get a random developer from the list
        const randomDev = developers[Math.floor(Math.random() * developers.length)];
        
        const response = await axios.get(`https://api.github.com/users/${randomDev}`);
        setDev(response.data);
      } catch (error) {
        console.error('Error fetching dev of the day:', error);
      }
    };

    fetchDevOfTheDay();
  }, []);

  if (!dev) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-sm rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-800">Developer of the Day</h3>
      </div>
      
      <div className="flex items-center mt-4">
        <img
          src={dev.avatar_url}
          alt={`${dev.login}'s avatar`}
          className="w-16 h-16 rounded-full border-2 border-purple-200"
        />
        <div className="ml-4">
          <a
            href={dev.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-purple-600 hover:text-purple-700"
          >
            @{dev.login}
          </a>
          <p className="text-gray-600 mt-1 line-clamp-2">{dev.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default DevOfTheDay;