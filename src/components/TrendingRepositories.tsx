import React from 'react';
import { Star, Code } from 'lucide-react';
import { trendingRepos } from '../data/trendingRepos';

const TrendingRepositories = () => {
  return (
    <section id="trending" className="my-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending GitHub Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingRepos.map((repo) => (
          <div key={repo.id} className="bg-white/40 backdrop-blur-sm rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <img
                src={repo.owner.avatar_url}
                alt={`${repo.owner.login}'s avatar`}
                className="w-6 h-6 rounded-full mr-2"
              />
              <h3 className="font-medium text-blue-600 truncate">
                {repo.owner.login}/{repo.name}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{repo.description}</p>
            
            {/* AI-generated insights */}
            <div className="mb-4 text-xs bg-purple-50 rounded-md p-2">
              <div className="flex items-center gap-1 text-purple-700 mb-1">
                <Code className="h-3 w-3" />
                <span className="font-medium">Project Type:</span>
                <span>{repo.name.includes('ui') ? 'UI Library' : 'Web Framework'}</span>
              </div>
              <p className="text-gray-600">
                {repo.name === 'react' 
                  ? 'A powerful JavaScript library for building user interfaces with a component-based architecture.'
                  : 'An innovative framework designed for modern web development with built-in optimizations.'}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-700">{repo.stars.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  repo.language === 'JavaScript' ? 'bg-yellow-100 text-yellow-800' :
                  repo.language === 'TypeScript' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {repo.language}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingRepositories;