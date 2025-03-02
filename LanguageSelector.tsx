import React from 'react';
import { Language } from '../types';
import { getLanguageDisplayName } from '../utils/languageUtils';
import { motion } from 'framer-motion';
import { Code2, FileCode, FileType, FileJson, FileText } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage }) => {
  const languages: Language[] = ['python', 'cpp', 'c', 'java', 'html'];

  const getLanguageIcon = (language: Language) => {
    switch (language) {
      case 'python':
        return <FileCode className="w-5 h-5" />;
      case 'cpp':
      case 'c':
        return <FileType className="w-5 h-5" />;
      case 'java':
        return <FileJson className="w-5 h-5" />;
      case 'html':
        return <Code2 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {languages.map((language) => (
        <motion.button
          key={language}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectLanguage(language)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            selectedLanguage === language
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {getLanguageIcon(language)}
          {getLanguageDisplayName(language)}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageSelector;