import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume/:username" element={<Resume />} />
      </Routes>
      <ThemeSwitcher />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;