import React from 'react';
import { useUserContext } from '../context/UserContext';

const RecentSearches = () => {
  const { recentUsers, fetchUser } = useUserContext();

  if (!recentUsers.length) return null;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Searches</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {recentUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => fetchUser(user.login)}
            className="flex-shrink-0 group"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-purple-400 transition-all transform group-hover:scale-105">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentSearches;