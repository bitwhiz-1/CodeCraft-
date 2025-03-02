import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeFile, Language } from '../types';
import { getLanguageDisplayName, getFileExtension } from '../utils/languageUtils';
import { createNewFile, downloadFile, exportToGoogleDrive } from '../utils/storageUtils';
import { FilePlus, Save, Download, Cloud, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileManagerProps {
  files: CodeFile[];
  currentFile: CodeFile | null;
  onSelectFile: (file: CodeFile) => void;
  onCreateFile: (file: CodeFile) => void;
  onUpdateFile: (file: CodeFile) => void;
  onDeleteFile: (fileId: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({
  files,
  currentFile,
  onSelectFile,
  onCreateFile,
  onUpdateFile,
  onDeleteFile,
}) => {
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState<Language>('python');
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [editedFileName, setEditedFileName] = useState('');

  const handleCreateFile = () => {
    if (isCreatingFile) {
      const name = newFileName.trim() || `Untitled${getFileExtension(newFileLanguage)}`;
      const newFile = createNewFile(newFileLanguage, name);
      onCreateFile(newFile);
      setIsCreatingFile(false);
      setNewFileName('');
    } else {
      setIsCreatingFile(true);
    }
  };

  const handleSaveToGoogleDrive = async () => {
    if (!currentFile) return;
    
    toast.promise(exportToGoogleDrive(currentFile), {
      loading: 'Exporting to Google Drive...',
      success: 'File exported to Google Drive!',
      error: 'Failed to export file',
    });
  };

  const handleDownloadFile = () => {
    if (!currentFile) return;
    downloadFile(currentFile);
    toast.success('File downloaded successfully!');
  };

  const handleStartEditFileName = () => {
    if (!currentFile) return;
    setEditedFileName(currentFile.name);
    setIsEditingFileName(true);
  };

  const handleSaveFileName = () => {
    if (!currentFile || !editedFileName.trim()) return;
    
    const updatedFile = {
      ...currentFile,
      name: editedFileName.trim(),
      lastModified: new Date()
    };
    
    onUpdateFile(updatedFile);
    setIsEditingFileName(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Files</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateFile}
            className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            title="Create new file"
          >
            <FilePlus className="w-4 h-4" />
          </motion.button>
          
          {currentFile && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveToGoogleDrive}
                className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Save to Google Drive"
              >
                <Cloud className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadFile}
                className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
      
      {isCreatingFile && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="File name (optional)"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            
            <select
              value={newFileLanguage}
              onChange={(e) => setNewFileLanguage(e.target.value as Language)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="html">HTML</option>
            </select>
            
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreateFile}
                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create
              </button>
              
              <button
                onClick={() => setIsCreatingFile(false)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {currentFile && (
          <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                
                {isEditingFileName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedFileName}
                      onChange={(e) => setEditedFileName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      autoFocus
                    />
                    
                    <button
                      onClick={handleSaveFileName}
                      className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Save
                    </button>
                    
                    <button
                      onClick={() => setIsEditingFileName(false)}
                      className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentFile.name}
                    </span>
                    <button
                      onClick={handleStartEditFileName}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Rename file"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getLanguageDisplayName(currentFile.language)}
              </span>
            </div>
          </div>
        )}
        
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No files yet. Create a new file to get started.
          </div>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <motion.li
                key={file.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                  currentFile?.id === file.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => onSelectFile(file)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getLanguageDisplayName(file.language)}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileManager;