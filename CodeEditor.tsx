import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { Language, Theme } from '../types';
import { getLanguageExtension } from '../utils/languageUtils';
import { getEditorTheme } from '../utils/themeUtils';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  code: string;
  language: Language;
  theme: Theme;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, theme, onChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <CodeMirror
        value={code}
        height="500px"
        extensions={[getLanguageExtension(language)]}
        onChange={onChange}
        theme={getEditorTheme(theme)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        className="text-sm"
      />
    </motion.div>
  );
};

export default CodeEditor;