"use client";
import DrawerDialogDemo from "@/components/chat/findFiles";

import MessageContainer from "@/components/chat/messageContainer";
// import Imports from "@/components/chat/imports";
import FileUpload from "@/components/chat/file-upload";
import {useFileUpload} from "@/hooks/useFileUpload";

const App = () => {
  const { handleFileDrop } = useFileUpload();

  // Create an adapter function that accepts File[] and passes it to handleFileDrop
  const handleFilesDropAdapter = (files: File[]) => {
    // Create a minimal synthetic event or process the files directly
    // depending on what your handleFileDrop actually needs
    const event = { 
      dataTransfer: { files },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as React.DragEvent<HTMLDivElement>;
    
    handleFileDrop(event);
  };

  return (
    <>
      <div className=" relative flex flex-col justify-center items-center h-[calc(100dvh_-_3.5rem)] w-full">
          <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 w-full scrollbar"></div>
          <MessageContainer />
          {/* <Imports /> */}
      </div>
      <DrawerDialogDemo />
      <FileUpload
        maxFiles={5}
        maxSizeMB={10}
        acceptedFileTypes={["image/*", "application/pdf", "text/plain"]}
        onFilesDrop={handleFilesDropAdapter}
      />
    </>
  );
};

export default App;