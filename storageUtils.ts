import { CodeFile, Language } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultCode, getFileExtension } from './languageUtils';

// Local storage keys
const FILES_STORAGE_KEY = 'code-compiler-files';

// Save files to local storage
export const saveFilesToStorage = (files: CodeFile[]): void => {
  localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
};

// Load files from local storage
export const loadFilesFromStorage = (): CodeFile[] => {
  const filesJson = localStorage.getItem(FILES_STORAGE_KEY);
  if (!filesJson) return [];
  
  try {
    const files = JSON.parse(filesJson);
    return files.map((file: any) => ({
      ...file,
      lastModified: new Date(file.lastModified)
    }));
  } catch (error) {
    console.error('Error loading files from storage:', error);
    return [];
  }
};

// Create a new file
export const createNewFile = (language: Language, name?: string): CodeFile => {
  return {
    id: uuidv4(),
    name: name || `Untitled${getFileExtension(language)}`,
    language,
    code: getDefaultCode(language),
    lastModified: new Date()
  };
};

// Export file to Google Drive
export const exportToGoogleDrive = async (file: CodeFile): Promise<boolean> => {
  // This is a placeholder for Google Drive API integration
  // In a real implementation, you would use the Google Drive API
  
  try {
    // Mock successful export
    console.log('Exporting to Google Drive:', file);
    
    // Show a success message or open Google Drive in a new tab
    window.open('https://drive.google.com', '_blank');
    
    return true;
  } catch (error) {
    console.error('Error exporting to Google Drive:', error);
    return false;
  }
};

// Download file locally
export const downloadFile = (file: CodeFile): void => {
  const blob = new Blob([file.code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};