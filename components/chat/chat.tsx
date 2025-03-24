"use client";
import DrawerDialogDemo from "@/components/chat/findFiles";

import MessageContainer from "@/components/chat/messageContainer";
// import Imports from "@/components/chat/imports";
import FileUpload from "@/components/chat/file-upload";
import { useFileUpload } from "@/hooks/useFileUpload";

import type { Attachment, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Vote } from "@/lib/db/schema";
import { fetcher, generateUUID } from "@/lib/utils";
import { Artifact } from "@/components/artifact/artifact";
// import { MultimodalInput } from "@/components/artifact/multimodal-input";
import { Messages } from "./messages";
// import { VisibilityType } from "@/components/header/visibility-selector";
import { useArtifactSelector } from "@/hooks/use-artifact";
import { toast } from "sonner";

const App = ({
  id,
  initialMessages,
  selectedChatModel,
  // selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  // selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) => {
  const { handleFileDrop } = useFileUpload();
  const { mutate } = useSWRConfig();
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate("/api/history");
    },
    onError: () => {
      toast.error("An error occured, please try again!");
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  // Create an adapter function that accepts File[] and passes it to handleFileDrop
  const handleFilesDropAdapter = (files: File[]) => {
    // Create a minimal synthetic event or process the files directly
    // depending on what your handleFileDrop actually needs
    const event = {
      dataTransfer: { files },
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as React.DragEvent<HTMLDivElement>;

    handleFileDrop(event);
  };

  return (
    <>
      <div className=" relative flex flex-col justify-center items-center h-[calc(100dvh_-_3.5rem)] w-full">
        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />
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
      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
};

export default App;
