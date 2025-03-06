"use client";
import { ModeToggle } from "@/components/ModeToggle";
import DrawerDialogDemo from "@/components/chat/findFiles";
import { useAppSelector } from "@/hooks/redux";
import { useMediaQuery } from "@react-hook/media-query";
import MessageContainer from "@/components/chat/messageContainer";
import Imports from "@/components/chat/imports";
import FileUpload from "@/components/chat/file-upload";

const App = () => {
  const isOpen = useAppSelector((state) => state.dialog.isOpen);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <div className="h-dvh w-dvw overflow-hidden">
        <header className="h-12 border-b border-light flex items-center justify-center px-2">
          <nav className="flex items-center justify-between w-full max-w-7xl">
            <div className="flex aspect-square">
              <svg
                fill="currentColor"
                viewBox="0 0 40 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="size-10"
              >
                <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"></path>
                <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"></path>
              </svg>
            </div>
            <ModeToggle />
          </nav>
        </header>

        <div className="container relative flex justify-center items-center h-dvh max-w-3xl m-auto p-3 ">
          <div className="flex flex-col gap-3 w-full">
            <MessageContainer />
            <Imports />
          </div>
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
