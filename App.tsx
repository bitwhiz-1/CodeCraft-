import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { CodeFile, Language, Theme, Background, CompileResult } from './types';
import { validateCode, getDefaultCode } from './utils/languageUtils';
import { getBackgroundClass } from './utils/themeUtils';
import { loadFilesFromStorage, saveFilesToStorage, createNewFile } from './utils/storageUtils';
import { compileCode } from './services/compilerService';
import CodeEditor from './components/CodeEditor';
import LanguageSelector from './components/LanguageSelector';
import ThemeSelector from './components/ThemeSelector';
import OutputPanel from './components/OutputPanel';
import FileManager from './components/FileManager';
import { Code, Play, Save } from 'lucide-react';

function App() {
  // State
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [currentFile, setCurrentFile] = useState<CodeFile | null>(null);
  const [theme, setTheme] = useState<Theme>('vscode');
  const [background, setBackground] = useState<Background>('minimal');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Load files from storage on mount
  useEffect(() => {
    const savedFiles = loadFilesFromStorage();
    setFiles(savedFiles);
    
    // Create a default file if none exist
    if (savedFiles.length === 0) {
      const defaultFile = createNewFile('python');
      setFiles([defaultFile]);
      setCurrentFile(defaultFile);
    } else {
      setCurrentFile(savedFiles[0]);
    }
  }, []);

  // Save files to storage when they change
  useEffect(() => {
    if (files.length > 0) {
      saveFilesToStorage(files);
    }
  }, [files]);

  // Validate code when it changes
  useEffect(() => {
    if (currentFile) {
      const errors = validateCode(currentFile.code, currentFile.language);
      setValidationErrors(errors);
    }
  }, [currentFile]);

  // Handlers
  const handleLanguageChange = (language: Language) => {
    if (!currentFile) return;
    
    // Create a new file with the selected language
    const newFile = {
      ...currentFile,
      language,
      code: getDefaultCode(language),
      lastModified: new Date()
    };
    
    // Update the current file
    setCurrentFile(newFile);
    
    // Update the files list
    setFiles(files.map(file => 
      file.id === currentFile.id ? newFile : file
    ));
    
    // Reset compilation results
    setCompileResult(null);
  };

  const handleCodeChange = (code: string) => {
    if (!currentFile) return;
    
    // Update the current file
    const updatedFile = {
      ...currentFile,
      code,
      lastModified: new Date()
    };
    
    setCurrentFile(updatedFile);
    
    // Update the files list
    setFiles(files.map(file => 
      file.id === currentFile.id ? updatedFile : file
    ));
  };

  const handleRunCode = async () => {
    if (!currentFile) return;
    
    setIsCompiling(true);
    setCompileResult(null);
    
    try {
      const result = await compileCode(currentFile.code, currentFile.language);
      setCompileResult(result);
    } catch (error) {
      console.error('Error compiling code:', error);
      setCompileResult({
        output: '',
        errors: ['An error occurred while compiling the code'],
        success: false
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCreateFile = (file: CodeFile) => {
    setFiles([...files, file]);
    setCurrentFile(file);
  };

  const handleSelectFile = (file: CodeFile) => {
    setCurrentFile(file);
    setCompileResult(null);
  };

  const handleUpdateFile = (updatedFile: CodeFile) => {
    setFiles(files.map(file => 
      file.id === updatedFile.id ? updatedFile : file
    ));
    
    if (currentFile?.id === updatedFile.id) {
      setCurrentFile(updatedFile);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    // Remove the file from the list
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    
    // If the current file is being deleted, select another file
    if (currentFile?.id === fileId) {
      setCurrentFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
      setCompileResult(null);
    }
    
    // If no files remain, create a new default file
    if (updatedFiles.length === 0) {
      const defaultFile = createNewFile('python');
      setFiles([defaultFile]);
      setCurrentFile(defaultFile);
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass(background)} transition-colors duration-300`}>
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CodeCraft</h1>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunCode}
              disabled={!currentFile || isCompiling}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Run Code
            </motion.button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <ThemeSelector
                selectedTheme={theme}
                onSelectTheme={setTheme}
                selectedBackground={background}
                onSelectBackground={setBackground}
              />
              
              <LanguageSelector
                selectedLanguage={currentFile?.language || 'python'}
                onSelectLanguage={handleLanguageChange}
              />
              
              {currentFile ? (
                <CodeEditor
                  code={currentFile.code}
                  language={currentFile.language}
                  theme={theme}
                  onChange={handleCodeChange}
                />
              ) : (
                <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No file selected</p>
                </div>
              )}
            </div>
            
            <OutputPanel
              result={compileResult}
              errors={validationErrors}
              isLoading={isCompiling}
            />
          </div>
          
          <div>
            <FileManager
              files={files}
              currentFile={currentFile}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onUpdateFile={handleUpdateFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;