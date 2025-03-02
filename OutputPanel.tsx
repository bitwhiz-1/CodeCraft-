import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CompileResult } from '../types';

interface OutputPanelProps {
  result: CompileResult | null;
  errors: string[];
  isLoading: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ result, errors, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Output</h3>
      </div>

      {isLoading ? (
        <div className="p-4 h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="p-4">
          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-medium">Validation Warnings</h4>
              </div>
              <ul className="list-disc pl-5 text-sm text-amber-600 dark:text-amber-400 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Compilation Result */}
          {result && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <h4 className="font-medium">Execution Successful</h4>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="font-medium">Execution Failed</h4>
                  </div>
                )}
              </div>

              {/* Compilation Errors */}
              {result.errors.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-red-600 mb-1">Errors:</h5>
                  <SyntaxHighlighter
                    language="bash"
                    style={vscDarkPlus}
                    className="text-sm rounded-md"
                  >
                    {result.errors.join('\n')}
                  </SyntaxHighlighter>
                </div>
              )}

              {/* Output */}
              {result.output && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output:</h5>
                  <SyntaxHighlighter
                    language="bash"
                    style={vscDarkPlus}
                    className="text-sm rounded-md"
                  >
                    {result.output}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          )}

          {!result && errors.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              Click "Run Code" to see the output
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OutputPanel;