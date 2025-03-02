export type Language = 'python' | 'cpp' | 'c' | 'java' | 'html';

export type Theme = 'light' | 'dark' | 'dracula' | 'github' | 'vscode';

export type Background = 'gradient' | 'particles' | 'geometric' | 'minimal';

export interface CodeFile {
  id: string;
  name: string;
  language: Language;
  code: string;
  lastModified: Date;
}

export interface CompileResult {
  output: string;
  errors: string[];
  success: boolean;
}