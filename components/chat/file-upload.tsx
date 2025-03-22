"use client";

import type React from "react";
import { useRef } from "react";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
interface FileUploadProps {
  onFilesDrop: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export default function FileUpload({
  onFilesDrop,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedFileTypes = ["image/*", "application/pdf"],
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement> | DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDragIn = useCallback(
    (e: React.DragEvent<HTMLDivElement> | DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    },
    []
  );

  const handleDragOut = useCallback(
    (e: React.DragEvent<HTMLDivElement> | DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDragging(false);
      }
    },
    []
  );

  const validateFiles = useCallback(
    (filesToValidate: File[]): { valid: boolean; message: string } => {
      if (filesToValidate.length > maxFiles) {
        return {
          valid: false,
          message: `You can only upload up to ${maxFiles} files at once.`,
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
            .join(", ")}`,
        };
      }

      if (acceptedFileTypes.length > 0) {
        const invalidFiles = filesToValidate.filter((file) => {
          return !acceptedFileTypes.some((type) => {
            if (type.includes("*")) {
              const typePrefix = type.split("/")[0];
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
              .join(", ")}. Accepted types: ${acceptedFileTypes.join(", ")}`,
          };
        }
      }

      return { valid: true, message: "" };
    },
    [maxFiles, maxSizeMB, acceptedFileTypes]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement> | DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validation = validateFiles(droppedFiles);

        if (!validation.valid) {
          console.error(validation.message);
          toast.error(validation.message);
          return;
        }

        console.log("Files being dropped and passed to onFilesDrop:", droppedFiles);
        // Make sure we have a valid function to call
        if (typeof onFilesDrop === 'function') {
          onFilesDrop(droppedFiles);
        } else {
          console.error("onFilesDrop is not a function", onFilesDrop);
        }
        
        e.dataTransfer.clearData();
      }
    },
    [validateFiles, onFilesDrop]
  );

  useEffect(() => {
    // These event listeners must be added to the window to catch all drag events
    window.addEventListener("dragenter", handleDragIn);
    window.addEventListener("dragleave", handleDragOut);
    window.addEventListener("dragover", handleDrag);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragIn);
      window.removeEventListener("dragleave", handleDragOut);
      window.removeEventListener("dragover", handleDrag);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragIn, handleDragOut, handleDrag, handleDrop]);

  // Only render the drop area when dragging
  if (!isDragging) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="bg-transparent">
        <div className="flex flex-col items-center justify-center gap-4">
          <Image src="/upload-assets.svg" alt="upload" width={12} height={12} className="w-48" />
          <div className="flex flex-col gap-3 w-full justify-center text-center">
            <h3 className="text-2xl text-white font-medium">Add anything</h3>
            <p className="text-base text-white">
              Drag any file to add it to conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}