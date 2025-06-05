import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UserCard from './components/UserCard';
import RecentSearches from './components/RecentSearches';
import TrendingRepositories from './components/TrendingRepositories';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import DevOfTheDay from './components/DevOfTheDay';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

const AppContent = () => {
  const { theme } = useTheme();
  
  const themeStyles = {
    default: 'min-h-screen flex flex-col bg-gradient-to-b from-white to-indigo-50',
    halloween: 'min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-purple-100',
    hacker: 'min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-emerald-100',
    retro: 'min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-blue-100',
    matrix: 'min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-emerald-100',
  };

  return (
    <div className={themeStyles[theme as keyof typeof themeStyles]}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Hero />
        <DevOfTheDay />
        <UserCard />
        <RecentSearches />
        <TrendingRepositories />
      </main>
      <ThemeSwitcher />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;