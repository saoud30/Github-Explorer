import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  
  const themes = [
    { id: 'default', emoji: '💡', label: 'Default' },
    { id: 'halloween', emoji: '🎃', label: 'Halloween' },
    { id: 'hacker', emoji: '🕶️', label: 'Hacker' },
    { id: 'retro', emoji: '👾', label: 'Retro' },
    { id: 'matrix', emoji: '☠️', label: 'Matrix' },
  ] as const;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative group">
        <button
          className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
          aria-label="Theme switcher"
        >
          <Sparkles className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-50 transition-colors ${
                  theme === t.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;