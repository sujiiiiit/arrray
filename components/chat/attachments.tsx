import { UploadedFile } from "@/hooks/useFileUpload";

interface AttachmentProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

const Attachment = ({ file, onRemove }: AttachmentProps) => {
  const { status, name, type, progress, thumbnailUrl, size } = file;
  
  // console.log("Rendering individual attachment:", file);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Determine if this is an image attachment
  const isImage = type.startsWith('image/');
  
  if (isImage && thumbnailUrl) {
    return (
      <div className="image group relative inline-block text-sm">
        <div className="relative overflow-hidden border border-light bg-accent rounded-2xl">
          <div className="h-14 w-14">
            <button type="button" className="h-full w-full">
              <span 
                className="flex items-center h-full w-full justify-center bg-accent bg-cover bg-center text-white"
                style={{ 
                  backgroundImage: `url(${thumbnailUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {status === 'uploading' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-xs">{progress}%</div>
                  </div>
                )}
                {status === 'error' && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </span>
            </button>
          </div>
        </div>
        <button
          type="button"
          className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full transition-colors border-[3px] border-[#f4f4f4] bg-black p-[2px] text-white dark:border-token-main-surface-secondary dark:bg-white dark:text-black"
          onClick={() => onRemove(file.id)}
        >
          <span data-state="closed">
            <svg
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon-xs"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    );
  }

  // For non-image files
  return (
    <div className="file group relative inline-block text-sm">
      <div className="relative overflow-hidden border border-light bg-accent rounded-2xl">
        <div className="p-2 min-w-40 w-auto max-w-52">
          <div className="flex flex-row items-center gap-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                fill="none"
                className="h-10 w-10 flex-shrink-0"
                width="36"
                height="36"
              >
                <rect width="36" height="36" rx="6" fill="#0088FF"></rect>
                <path
                  d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M18.833 9.66663V15.5H24.6663"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div className="overflow-hidden">
              <div className="truncate font-semibold">{name}</div>
              <div className="truncate text-color-secondary">
                {status === 'uploading' ? (
                  <div className="flex items-center">
                    <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-1 text-xs">{progress}%</span>
                  </div>
                ) : status === 'error' ? (
                  <span className="text-red-500 text-xs">Upload failed</span>
                ) : (
                  formatFileSize(size)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full transition-colors border-[3px] border-[#f4f4f4] bg-black p-[2px] text-white dark:border-token-main-surface-secondary dark:bg-white dark:text-black"
        onClick={() => onRemove(file.id)}
      >
        <span data-state="closed">
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="icon-xs"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

interface AttachmentsProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

const Attachments = ({ files, onRemoveFile }: AttachmentsProps) => {
  console.log("Attachments component rendering with files:", files);
  
  // Ensure files is an array and has length
  if (!Array.isArray(files) || files.length === 0) {
    console.log("No files to display in Attachments");
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {files.map((file) => (
        <Attachment key={file.id} file={file} onRemove={onRemoveFile} />
      ))}
    </div>
  );
};

export default Attachments;