import { Theme, Background } from '../types';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { dracula } from '@uiw/codemirror-theme-dracula';

export const getEditorTheme = (theme: Theme) => {
  switch (theme) {
    case 'light':
      return githubLight;
    case 'dark':
      return vscodeDark;
    case 'dracula':
      return dracula;
    case 'github':
      return githubDark;
    case 'vscode':
      return vscodeDark;
    default:
      return vscodeDark;
  }
};

export const getBackgroundClass = (background: Background): string => {
  switch (background) {
    case 'gradient':
      return 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500';
    case 'particles':
      return 'bg-slate-900';
    case 'geometric':
      return 'bg-white dark:bg-slate-900 bg-[url("https://images.unsplash.com/photo-1520121401995-928cd50d4e27?q=80&w=1470&auto=format&fit=crop")] bg-cover bg-center bg-fixed bg-opacity-10';
    case 'minimal':
      return 'bg-gray-50 dark:bg-gray-900';
    default:
      return 'bg-white dark:bg-gray-900';
  }
};