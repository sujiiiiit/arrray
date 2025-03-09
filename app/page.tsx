"use client";
import DrawerDialogDemo from "@/components/chat/findFiles";

import MessageContainer from "@/components/chat/messageContainer";
import Imports from "@/components/chat/imports";
import FileUpload from "@/components/chat/file-upload";
const App = () => {
  return (
    <>
      <div className=" relative flex justify-center items-center h-dvh w-full">
        <div className="flex flex-col gap-3 w-full">
          <MessageContainer />
          <Imports />
        </div>
      </div>
      <DrawerDialogDemo />
      <FileUpload
        maxFiles={5}
        maxSizeMB={10}
        acceptedFileTypes={["image/*", "application/pdf", "text/plain"]}
        onFilesDrop={(files) => {
          console.log("Files dropped:", files);
        }}
      />
    </>
  );
};

export default App;
