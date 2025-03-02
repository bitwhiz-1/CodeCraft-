import React from 'react';
import { Theme, Background } from '../types';
import { motion } from 'framer-motion';
import { Moon, Sun, Palette, Github, Code } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  selectedBackground: Background;
  onSelectBackground: (background: Background) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
  selectedBackground,
  onSelectBackground,
}) => {
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'dracula', label: 'Dracula', icon: <Palette className="w-4 h-4" /> },
    { value: 'github', label: 'GitHub', icon: <Github className="w-4 h-4" /> },
    { value: 'vscode', label: 'VS Code', icon: <Code className="w-4 h-4" /> },
  ];

  const backgrounds: { value: Background; label: string }[] = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'particles', label: 'Particles' },
    { value: 'geometric', label: 'Geometric' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Editor Theme</h3>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <motion.button
              key={theme.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTheme(theme.value)}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTheme === theme.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {theme.icon}
              {theme.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Style</h3>
        <div className="flex flex-wrap gap-2">
          {backgrounds.map((bg) => (
            <motion.button
              key={bg.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectBackground(bg.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedBackground === bg.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {bg.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;