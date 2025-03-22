import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { addFile, updateFile, removeFile as removeFileAction } from '@/store/uploadSlice';
import {toast} from 'sonner'
export type FileStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

export interface UploadedFile {
  id: string;
  // Removed the file property to ensure all stored data is serializable
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  publicUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface FileValidationResult {
  valid: boolean;
  message: string;
  invalidFiles?: File[];
}

export interface FileUploadOptions {
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  maxFiles?: number;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const { 
    maxSizeMB = 10, 
    acceptedFileTypes = ["image/*", "application/pdf", "text/plain"], 
    maxFiles = 3 
  } = options;
  
  const dispatch = useAppDispatch();
  const files = useAppSelector(state => state.fileUpload.files);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Validate files before upload
  const validateFiles = useCallback((filesToValidate: File[]): FileValidationResult => {
    // Check maximum number of files
    if (filesToValidate.length > maxFiles) {
      return {
        valid: false,
        message: `You can only upload up to ${maxFiles} files at once.`,
        invalidFiles: filesToValidate.slice(maxFiles)
      };
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = filesToValidate.filter(file => file.size > maxSizeBytes);
    
    if (oversizedFiles.length > 0) {
      return {
        valid: false,
        message: `Some files exceed the maximum size of ${maxSizeMB}MB: ${oversizedFiles.map(f => f.name).join(', ')}`,
        invalidFiles: oversizedFiles
      };
    }
    
    // Check file types
    if (acceptedFileTypes.length > 0) {
      const invalidFiles = filesToValidate.filter(file => {
        return !acceptedFileTypes.some(type => {
          if (type.includes('*')) {
            const typePrefix = type.split('/')[0];
            return file.type.startsWith(typePrefix);
          }
          return file.type === type;
        });
      });
      
      if (invalidFiles.length > 0) {
        return {
          valid: false,
          message: `Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}. Accepted types: ${acceptedFileTypes.join(', ')}`,
          invalidFiles
        };
      }
    }
    
    return { valid: true, message: '' };
  }, [maxFiles, maxSizeMB, acceptedFileTypes]);

  // Create a thumbnail preview for image files
  const createThumbnail = useCallback(async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/')) return undefined;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadToSupabase = useCallback(async (file: File): Promise<UploadedFile> => {
    // Generate unique ID for tracking this upload
    const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Generate thumbnail preview if it's an image
    const thumbnailUrl = await createThumbnail(file);
    
    // Create initial file entry with "uploading" status
    // Note: We no longer include the non-serializable File object in this object
    const newFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      thumbnailUrl
    };

    // Add to files state immediately so UI can show progress
    dispatch(addFile(newFile));
    
    try {
      console.log(`Starting upload for ${file.name}`);
      toast(`Uploading file ${file.name}`)
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to the API endpoint
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            dispatch(updateFile({ 
              ...newFile, 
              progress
            }));
            console.log(`Upload progress for ${file.name}: ${progress}%`);
            toast(`Uploading file ${file.name} ${progress}%`)
          }
        }
      });
      
      console.log(`Upload successful for ${file.name}:`, response.data);
      toast(`Upload successful for ${file.name}`)
      
      // Update file status with result
      const updatedFile: UploadedFile = {
        ...newFile,
        status: 'uploaded',
        progress: 100,
        // publicUrl: response.data.publicUrl
      };
      
      dispatch(updateFile(updatedFile));
      
      return updatedFile;
      
    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error);
      toast(`Upload failed for ${file.name}`)
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      const errorFile: UploadedFile = {
        ...newFile,
        status: 'error',
        progress: 0,
        error: errorMessage
      };
      
      dispatch(updateFile(errorFile));
      
      return errorFile;
    }
  }, [createThumbnail, dispatch]);
  
  const uploadFiles = useCallback(async (filesToUpload: File[]) => {
    // First validate files
    const validation = validateFiles(filesToUpload);
    
    if (!validation.valid) {
      setValidationError(validation.message);
      console.error(validation.message);
      toast(validation.message)
      return [];
    }
    
    // Clear any previous validation errors
    setValidationError(null);
    
    console.log(`Uploading ${filesToUpload.length} files`);
    toast(`Uploading ${filesToUpload.length} files`)
    return Promise.all(filesToUpload.map(file => uploadToSupabase(file)));
  }, [uploadToSupabase, validateFiles]);
  
  // Method 1: File input change handler
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log('Files selected via input:', event.target.files);
      const selectedFiles = Array.from(event.target.files);
      uploadFiles(selectedFiles);
      
      // Reset input so same file can be selected again
      if (event.target.value) event.target.value = '';
    }
  }, [uploadFiles]);
  
  // Method 2: Paste handler
  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const { items } = event.clipboardData;
    
    if (items) {
      const filesToUpload: File[] = [];
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) filesToUpload.push(file);
        }
      }
      
      if (filesToUpload.length > 0) {
        console.log('Files pasted:', filesToUpload);
        event.preventDefault();
        uploadFiles(filesToUpload);
      }
    }
  }, [uploadFiles]);
  
  // Method 3: Drag and drop handler
  const handleFileDrop = useCallback((droppedFiles: File[]) => {
    console.log('Files dropped:', droppedFiles);
    uploadFiles(droppedFiles);
  }, [uploadFiles]);
  
  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  // Renamed local removeFile callback to avoid naming conflict
  const handleRemoveFile = useCallback((id: string) => {
    dispatch(removeFileAction(id));
  }, [dispatch]);
  
  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);
  
  return {
    files,
    fileInputRef,
    handleFileSelect,
    handlePaste,
    handleFileDrop,
    triggerFileInput,
    removeFile: handleRemoveFile,
    validationError,
    clearValidationError,
    acceptedFileTypes,
    maxSizeMB,
    maxFiles
  };
}
