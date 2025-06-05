import React, { useState } from 'react';
import { Github, Search, Settings, Bell } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchUser } = useUserContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchUser(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Github className="h-6 w-6 text-purple-600" />
            <span className="font-semibold text-lg hidden sm:block">GitHub Explorer</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
            <a href="#trending" className="text-gray-700 hover:text-purple-600 transition-colors">Trending</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Explore</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
          </nav>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-grow max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </form>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-purple-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-purple-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
              <img 
                src="https://avatars.githubusercontent.com/u/583231?v=4" 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;