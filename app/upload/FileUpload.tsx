// components/FileUpload.tsx
'use client';

import { useState } from 'react';

interface FileUploadProps {
  bucket?: string;
  folder?: string;
  onUploadComplete?: (data: { filePath: string; publicUrl: string }) => void;
  onError?: (error: string) => void;
}

export default function FileUpload({ 
  bucket = 'uploads', 
  folder = '', 
  onUploadComplete,
  onError 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    try {
      setIsUploading(true);
      setProgress(10);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('folder', folder);
      
      setProgress(30);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      setProgress(90);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setProgress(100);
      setFile(null);
      
      // Call the onUploadComplete callback with the result
      if (onUploadComplete) {
        onUploadComplete({
          filePath: result.filePath,
          publicUrl: result.publicUrl
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to upload file');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
            disabled={isUploading}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer block w-full text-gray-700"
          >
            {file ? (
              <span className="text-green-600 font-medium">{file.name}</span>
            ) : (
              <span>
                Drag and drop a file here, or click to select a file
              </span>
            )}
          </label>
        </div>
        
        {file && (
          <div className="text-sm text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg focus:outline-none"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}