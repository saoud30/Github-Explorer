import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { Search } from 'lucide-react';

const Hero = () => {
  const [username, setUsername] = useState('');
  const { fetchUser, loading } = useUserContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      fetchUser(username.trim());
    }
  };

  return (
    <section className="text-center py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
        Discover GitHub Profiles
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-8">
        Enter a GitHub username to instantly fetch and explore their public profile, 
        repositories, and activity.
      </p>
      
      <form onSubmit={handleSubmit} className="flex justify-center">
        <div className="relative flex w-full max-w-md">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              @
            </span>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-8 pr-4 py-2.5 w-full rounded-l-md border-y border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className={`px-4 py-2.5 rounded-r-md bg-purple-600 text-white font-medium transition-colors flex items-center gap-2
              ${loading || !username.trim() 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-purple-700'}`}
          >
            <Search className="h-4 w-4" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Hero;