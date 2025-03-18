// components/FileUploadWrapper.tsx
'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';

export default function FileUploadWrapper() {
  const [uploadedFile, setUploadedFile] = useState<{ filePath: string; publicUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (data: { filePath: string; publicUrl: string }) => {
    setUploadedFile(data);
    setError(null);
    console.log('Upload complete:', data);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setUploadedFile(null);
    console.error('Upload error:', errorMessage);
  };

  return (
    <div>
      <FileUpload 
        bucket="user-uploads" // Make sure this matches EXACTLY with your bucket name in Supabase
        folder=""
        onUploadComplete={handleUploadComplete}
        onError={handleError}
      />
      
      {uploadedFile && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">File uploaded successfully!</p>
          <p className="text-sm mt-2">
            <a href={uploadedFile.publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View uploaded file
            </a>
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
}