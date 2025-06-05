import React from 'react';
import Hero from '../components/Hero';
import UserCard from '../components/UserCard';
import RecentSearches from '../components/RecentSearches';
import TrendingRepositories from '../components/TrendingRepositories';
import DevOfTheDay from '../components/DevOfTheDay';

const Home = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <Hero />
      <DevOfTheDay />
      <UserCard />
      <RecentSearches />
      <TrendingRepositories />
    </main>
  );
};

export default Home;