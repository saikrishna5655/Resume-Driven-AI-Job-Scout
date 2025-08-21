import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ 
  onFileSelect, 
  selectedFile, 
  isProcessing 
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const validExtensions = ['.pdf', '.docx'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const removeFile = () => {
    // You might want to add an onFileRemove prop if needed
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">Resume Upload</h3>
      
      {!selectedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
            ${dragOver 
              ? 'border-teal-400 bg-teal-500/10' 
              : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <Upload className={`w-12 h-12 mb-4 ${dragOver ? 'text-teal-400' : 'text-slate-400'}`} />
            <h4 className="text-lg font-medium text-slate-200 mb-2">
              Drop your resume here
            </h4>
            <p className="text-slate-400 text-center mb-4">
              or click to browse files
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </span>
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>DOCX</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5 text-teal-400" />
              )}
              <div>
                <p className="text-slate-200 font-medium">{selectedFile.name}</p>
                <p className="text-slate-400 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={removeFile}
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {isProcessing && (
            <div className="mt-3 text-sm text-slate-400">
              Processing resume...
            </div>
          )}
        </div>
      )}
    </div>
  );
};