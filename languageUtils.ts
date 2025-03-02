import { Language } from '../types';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';

export const getLanguageExtension = (language: Language) => {
  switch (language) {
    case 'python':
      return python();
    case 'cpp':
    case 'c':
      return cpp();
    case 'java':
      return java();
    case 'html':
      return html();
    default:
      return javascript();
  }
};

export const getLanguageDisplayName = (language: Language): string => {
  switch (language) {
    case 'python':
      return 'Python';
    case 'cpp':
      return 'C++';
    case 'c':
      return 'C';
    case 'java':
      return 'Java';
    case 'html':
      return 'HTML';
    default:
      return 'Unknown';
  }
};

export const getFileExtension = (language: Language): string => {
  switch (language) {
    case 'python':
      return '.py';
    case 'cpp':
      return '.cpp';
    case 'c':
      return '.c';
    case 'java':
      return '.java';
    case 'html':
      return '.html';
    default:
      return '.txt';
  }
};

export const getDefaultCode = (language: Language): string => {
  switch (language) {
    case 'python':
      return '# Python code\nprint("Hello, World!")';
    case 'cpp':
      return '// C++ code\n#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}';
    case 'c':
      return '// C code\n#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}';
    case 'java':
      return '// Java code\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}';
    case 'html':
      return '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>';
    default:
      return '// Start coding here';
  }
};

export const validateCode = (code: string, language: Language): string[] => {
  const errors: string[] = [];
  
  // Basic validation - this would be replaced with actual language-specific validation
  if (language === 'python') {
    if (code.includes('import os') && code.includes('system(')) {
      errors.push('Warning: Potentially unsafe system call detected');
    }
    
    // Check for indentation issues (very basic)
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().endsWith(':') && i + 1 < lines.length) {
        if (!lines[i + 1].startsWith('  ') && lines[i + 1].trim().length > 0) {
          errors.push(`Line ${i + 2}: Expected indentation after line ending with ':'`);
        }
      }
    }
  } else if (language === 'cpp' || language === 'c') {
    if (!code.includes('main(')) {
      errors.push('Warning: No main function found');
    }
    
    // Check for missing semicolons (very basic)
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 0 && !line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}') && !line.startsWith('#') && !line.endsWith(':')) {
        errors.push(`Line ${i + 1}: Possible missing semicolon`);
      }
    }
  } else if (language === 'java') {
    if (!code.includes('class')) {
      errors.push('Warning: No class definition found');
    }
    
    if (!code.includes('public static void main')) {
      errors.push('Warning: No main method found');
    }
  } else if (language === 'html') {
    if (!code.includes('<!DOCTYPE html>')) {
      errors.push('Warning: Missing DOCTYPE declaration');
    }
    
    if (!code.includes('<html>') || !code.includes('</html>')) {
      errors.push('Warning: Missing html tags');
    }
  }
  
  return errors;
};