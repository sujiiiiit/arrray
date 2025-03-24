import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { addFile, updateFile, removeFile as removeFileAction, setIsUploading } from '@/store/uploadSlice';
import { addImage, removeImage } from '@/store/inputSlice';
import { toast } from 'sonner';

export type FileStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

export interface UploadedFile {
  id: string;
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
    maxFiles = 3,
  } = options;

  const dispatch = useAppDispatch();
  const files = useAppSelector((state) => state.fileUpload.files);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (filesToValidate: File[]): FileValidationResult => {
      // Check if adding these files would exceed maxFiles
      if (files.length + filesToValidate.length > maxFiles) {
        return {
          valid: false,
          message: `You can only upload up to ${maxFiles} files at once. You already have ${files.length} files.`,
          invalidFiles: filesToValidate.slice(maxFiles - files.length),
        };
      }

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const oversizedFiles = filesToValidate.filter(
        (file) => file.size > maxSizeBytes
      );

      if (oversizedFiles.length > 0) {
        return {
          valid: false,
          message: `Some files exceed the maximum size of ${maxSizeMB}MB: ${oversizedFiles
            .map((f) => f.name)
            .join(', ')}`,
          invalidFiles: oversizedFiles,
        };
      }

      if (acceptedFileTypes.length > 0) {
        const invalidFiles = filesToValidate.filter((file) => {
          return !acceptedFileTypes.some((type) => {
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
            message: `Invalid file type(s): ${invalidFiles
              .map((f) => f.name)
              .join(', ')}. Accepted types: ${acceptedFileTypes.join(', ')}`,
            invalidFiles,
          };
        }
      }

      return { valid: true, message: '' };
    },
    [files.length, maxFiles, maxSizeMB, acceptedFileTypes]
  );

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

  const uploadToSupabase = useCallback(
    async (file: File): Promise<UploadedFile> => {
      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const thumbnailUrl = await createThumbnail(file);
      const newFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        thumbnailUrl,
      };

      // Add to general file upload state
      dispatch(addFile(newFile));
      dispatch(setIsUploading(true));

      try {
        console.log(`Starting upload for ${file.name}`);
        toast.info(`Uploading file ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              dispatch(updateFile({ ...newFile, progress }));
            }
          },
        });

        console.log(`Upload successful for ${file.name}:`, response.data);
        toast.success(`Upload successful for ${file.name}`);

        const updatedFile: UploadedFile = {
          ...newFile,
          status: 'uploaded',
          progress: 100,
          publicUrl: response.data?.publicUrl || null,
        };

        dispatch(updateFile(updatedFile));
        dispatch(setIsUploading(false));

        // If it's an image, also add it to the input state's images array
        if (file.type.startsWith('image/')) {
          dispatch(addImage({
            id: updatedFile.id,
            url: updatedFile.thumbnailUrl || updatedFile.publicUrl || '',
            name: updatedFile.name,
            type: updatedFile.type,
          }));
        }

        return updatedFile;
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        toast.error(`Upload failed for ${file.name}`);

        const errorMessage = error instanceof Error ? error.message : 'Upload failed';

        const errorFile: UploadedFile = {
          ...newFile,
          status: 'error',
          progress: 0,
          error: errorMessage,
        };

        dispatch(updateFile(errorFile));
        dispatch(setIsUploading(false));
        return errorFile;
      }
    },
    [createThumbnail, dispatch]
  );

  const uploadFiles = useCallback(
    async (filesToUpload: File[]) => {
      const validation = validateFiles(filesToUpload);

      if (!validation.valid) {
        setValidationError(validation.message);
        console.error(validation.message);
        toast.error(validation.message);
        return [];
      }

      setValidationError(null);

      console.log(`Uploading ${filesToUpload.length} files`);
      // toast(`Uploading ${filesToUpload.length} files`);
      return Promise.all(filesToUpload.map((file) => uploadToSupabase(file)));
    },
    [uploadToSupabase, validateFiles]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        console.log('Files selected via input:', event.target.files);
        const selectedFiles = Array.from(event.target.files);
        uploadFiles(selectedFiles);

        if (event.target.value) event.target.value = '';
      }
    },
    [uploadFiles]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent) => {
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
    },
    [uploadFiles]
  );

  const handleFileDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(event.dataTransfer.files);
        console.log('Files dropped:', droppedFiles);
        uploadFiles(droppedFiles);
      }
    },
    [uploadFiles]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleRemoveFile = useCallback(
    (id: string) => {
      // Remove from both slices to keep them in sync
      dispatch(removeFileAction(id));
      dispatch(removeImage(id));
    },
    [dispatch]
  );

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  return {
    files,
    fileInputRef,
    handleFileSelect,
    handlePaste,
    handleFileDrop,
    handleDragOver,
    triggerFileInput,
    removeFile: handleRemoveFile,
    validationError,
    clearValidationError,
    acceptedFileTypes,
    maxSizeMB,
    maxFiles,
  };
}