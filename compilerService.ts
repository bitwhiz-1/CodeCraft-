import { Language, CompileResult } from '../types';

// This is a mock compiler service
// In a real application, this would connect to a backend API
export const compileCode = async (code: string, language: Language): Promise<CompileResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock compilation results based on language
  switch (language) {
    case 'python':
      return mockPythonCompilation(code);
    case 'cpp':
    case 'c':
      return mockCppCompilation(code, language);
    case 'java':
      return mockJavaCompilation(code);
    case 'html':
      return mockHtmlCompilation(code);
    default:
      return {
        output: '',
        errors: ['Unsupported language'],
        success: false
      };
  }
};

const mockPythonCompilation = (code: string): CompileResult => {
  // Check for syntax errors
  if (code.includes('print(') && !code.includes(')')) {
    return {
      output: '',
      errors: ['SyntaxError: unexpected EOF while parsing'],
      success: false
    };
  }
  
  // Check for indentation errors
  if (code.includes('def ') && !code.includes('    ')) {
    return {
      output: '',
      errors: ['IndentationError: expected an indented block'],
      success: false
    };
  }
  
  // Mock successful output
  let output = '';
  
  if (code.includes('print("Hello, World!")')) {
    output += 'Hello, World!\n';
  }
  
  if (code.includes('for i in range')) {
    output += '0\n1\n2\n3\n4\n';
  }
  
  if (code.includes('import math') && code.includes('math.sqrt')) {
    output += '2.0\n';
  }
  
  return {
    output: output || 'Program executed successfully with no output',
    errors: [],
    success: true
  };
};

const mockCppCompilation = (code: string, language: Language): CompileResult => {
  // Check for syntax errors
  if (code.includes('cout <<') && !code.includes(';')) {
    return {
      output: '',
      errors: [`${language === 'cpp' ? 'error: ' : 'error: '}expected ';' before '}' token`],
      success: false
    };
  }
  
  // Check for missing includes
  if (code.includes('cout') && !code.includes('#include <iostream>')) {
    return {
      output: '',
      errors: [`${language === 'cpp' ? 'error: ' : 'error: '}'cout' was not declared in this scope`],
      success: false
    };
  }
  
  // Check for missing main function
  if (!code.includes('main()') && !code.includes('main(')) {
    return {
      output: '',
      errors: [`${language === 'cpp' ? 'error: ' : 'error: '}undefined reference to 'main'`],
      success: false
    };
  }
  
  // Mock successful output
  let output = '';
  
  if (code.includes('Hello, World!')) {
    output += 'Hello, World!\n';
  }
  
  if (code.includes('for (') && code.includes('i < 5')) {
    output += '0\n1\n2\n3\n4\n';
  }
  
  return {
    output: output || 'Program executed successfully with no output',
    errors: [],
    success: true
  };
};

const mockJavaCompilation = (code: string): CompileResult => {
  // Check for syntax errors
  if (code.includes('System.out.println') && !code.includes(';')) {
    return {
      output: '',
      errors: ['error: \';\' expected'],
      success: false
    };
  }
  
  // Check for class definition
  if (!code.includes('class ')) {
    return {
      output: '',
      errors: ['error: class, interface, or enum expected'],
      success: false
    };
  }
  
  // Check for main method
  if (!code.includes('public static void main')) {
    return {
      output: '',
      errors: ['error: could not find or load main class'],
      success: false
    };
  }
  
  // Mock successful output
  let output = '';
  
  if (code.includes('Hello, World!')) {
    output += 'Hello, World!\n';
  }
  
  if (code.includes('for (') && code.includes('i < 5')) {
    output += '0\n1\n2\n3\n4\n';
  }
  
  return {
    output: output || 'Program executed successfully with no output',
    errors: [],
    success: true
  };
};

const mockHtmlCompilation = (code: string): CompileResult => {
  // Check for basic HTML structure
  const errors = [];
  
  if (!code.includes('<!DOCTYPE html>')) {
    errors.push('Warning: Missing DOCTYPE declaration');
  }
  
  if (!code.includes('<html>') || !code.includes('</html>')) {
    errors.push('Error: Missing html tags');
  }
  
  if (!code.includes('<head>') || !code.includes('</head>')) {
    errors.push('Warning: Missing head tags');
  }
  
  if (!code.includes('<body>') || !code.includes('</body>')) {
    errors.push('Warning: Missing body tags');
  }
  
  // For HTML, we'll return the code itself as the "output"
  // In a real application, this might render the HTML in an iframe
  return {
    output: 'HTML preview would be displayed here',
    errors,
    success: errors.length === 0
  };
};