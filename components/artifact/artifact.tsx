import type { Attachment, UIMessage } from "ai";
import { formatDistance } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";
import type { Document } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import MultimodalInput from "@/components/chat/messageContainer";
import { VersionFooter } from "@/components/artifact/version-footer";
import { ArtifactActions } from "./artifact-actions";
import { ArtifactCloseButton } from "./artifact-close-button";
import { ArtifactMessages } from "./artifact-messages";
// import { useSidebar } from './ui/sidebar';
import { useArtifact } from "@/hooks/use-artifact";
import { codeArtifact } from "@/artifacts/code/client";
import equal from "fast-deep-equal";
import { UseChatHelpers } from "@ai-sdk/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Play } from "../icons";

export const artifactDefinitions = [codeArtifact];
export type ArtifactKind = (typeof artifactDefinitions)[number]["kind"];

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: "streaming" | "idle";
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

function PureArtifact({
  chatId,
  input,
  setInput,
  handleSubmit,
  status,
  stop,
  attachments,
  setAttachments,
  append,
  messages,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  input: string;
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  stop: UseChatHelpers["stop"];
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  append: UseChatHelpers["append"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
}) {
  const { artifact, setArtifact, metadata, setMetadata } = useArtifact();

  const {
    data: documents,
    isLoading: isDocumentsFetching,
    mutate: mutateDocuments,
  } = useSWR<Array<Document>>(
    artifact.documentId !== "init" && artifact.status !== "streaming"
      ? `/api/document?id=${artifact.documentId}`
      : null,
    fetcher
  );

  const [mode, setMode] = useState<"edit" | "diff">("edit");
  const [document, setDocument] = useState<Document | null>(null);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);

  // const { open: isSidebarOpen } = useSidebar();

  useEffect(() => {
    if (documents && documents.length > 0) {
      const mostRecentDocument = documents.at(-1);

      if (mostRecentDocument) {
        setDocument(mostRecentDocument);
        setCurrentVersionIndex(documents.length - 1);
        setArtifact((currentArtifact) => ({
          ...currentArtifact,
          content: mostRecentDocument.content ?? "",
        }));
      }
    }
  }, [documents, setArtifact]);

  useEffect(() => {
    mutateDocuments();
  }, [artifact.status, mutateDocuments]);

  const { mutate } = useSWRConfig();
  const [isContentDirty, setIsContentDirty] = useState(false);

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!artifact) return;

      mutate<Array<Document>>(
        `/api/document?id=${artifact.documentId}`,
        async (currentDocuments) => {
          if (!currentDocuments) return undefined;

          const currentDocument = currentDocuments.at(-1);

          if (!currentDocument || !currentDocument.content) {
            setIsContentDirty(false);
            return currentDocuments;
          }

          if (currentDocument.content !== updatedContent) {
            await fetch(`/api/document?id=${artifact.documentId}`, {
              method: "POST",
              body: JSON.stringify({
                title: artifact.title,
                content: updatedContent,
                kind: artifact.kind,
              }),
            });

            setIsContentDirty(false);

            const newDocument = {
              ...currentDocument,
              content: updatedContent,
              createdAt: new Date(),
            };

            return [...currentDocuments, newDocument];
          }
          return currentDocuments;
        },
        { revalidate: false }
      );
    },
    [artifact, mutate]
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    2000
  );

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      if (document && updatedContent !== document.content) {
        setIsContentDirty(true);

        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      }
    },
    [document, debouncedHandleContentChange, handleContentChange]
  );

  function getDocumentContentById(index: number) {
    if (!documents) return "";
    if (!documents[index]) return "";
    return documents[index].content ?? "";
  }

  const handleVersionChange = (type: "next" | "prev" | "toggle" | "latest") => {
    if (!documents) return;

    if (type === "latest") {
      setCurrentVersionIndex(documents.length - 1);
      setMode("edit");
    }

    if (type === "toggle") {
      setMode((mode) => (mode === "edit" ? "diff" : "edit"));
    }

    if (type === "prev") {
      if (currentVersionIndex > 0) {
        setCurrentVersionIndex((index) => index - 1);
      }
    } else if (type === "next") {
      if (currentVersionIndex < documents.length - 1) {
        setCurrentVersionIndex((index) => index + 1);
      }
    }
  };

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  /*
   * NOTE: if there are no documents, or if
   * the documents are being fetched, then
   * we mark it as the current version.
   */

  const isCurrentVersion =
    documents && documents.length > 0
      ? currentVersionIndex === documents.length - 1
      : true;

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind
  );

  if (!artifactDefinition) {
    throw new Error("Artifact definition not found!");
  }

  useEffect(() => {
    if (artifact.documentId !== "init") {
      if (artifactDefinition.initialize) {
        artifactDefinition.initialize({
          documentId: artifact.documentId,
          setMetadata,
        });
      }
    }
  }, [artifact.documentId, artifactDefinition, setMetadata]);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Code" },
    { id: 1, label: "Preview" },
  ];
  return (
    <AnimatePresence>
      {artifact.isVisible && (
        <motion.div
          data-testid="artifact"
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent scrollbar"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {!isMobile && (
            <motion.div
              className="fixed bg-background h-dvh"
              initial={{
                // width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                width: windowWidth,
                right: 0,
              }}
              animate={{ width: windowWidth, right: 0 }}
              exit={{
                // width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                width: windowWidth,
                right: 0,
              }}
            />
          )}

          {!isMobile && (
            <motion.div
              className="relative w-[400px] bg-background h-dvh shrink-0"
              initial={{ opacity: 0, x: 10, scale: 1 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: 0,
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              <AnimatePresence>
                {!isCurrentVersion && (
                  <motion.div
                    className="left-0 absolute h-dvh w-[400px] top-0 bg-zinc-900/50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <div className="flex flex-col h-full justify-between items-center">
                <ArtifactMessages
                  chatId={chatId}
                  status={status}
                  messages={messages}
                  setMessages={setMessages}
                  reload={reload}
                  isReadonly={isReadonly}
                  artifactStatus={artifact.status}
                />

                <form className="flex flex-row gap-2 relative items-end w-full ">
                  <MultimodalInput
                    chatId={chatId}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    status={status}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    append={append}
                    className="bg-background dark:bg-muted"
                    setMessages={setMessages}
                  />
                </form>
              </div>
            </motion.div>
          )}

          <motion.div
            className="fixed bg-vs h-dvh flex flex-col overflow-y-hidden md:border-l shadow-lg"
            initial={
              isMobile
                ? {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
                : {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : "calc(100dvw)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
                : {
                    opacity: 1,
                    x: 400,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth
                      ? windowWidth - 400
                      : "calc(100dvw-400px)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            <SidebarProvider className="block overflow-hidden">
              <div className="w-full h-11 px-3 flex flex-row justify-between items-center   border-b">
                <div className="flex items-center h-full gap-3 w-full max-w-40">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarTrigger />
                    </TooltipTrigger>
                    <TooltipContent
                      variant="default"
                      size="xs"
                      shape="md"
                      side="bottom"
                    >
                      Sidebar
                    </TooltipContent>
                  </Tooltip>
                    <div className="relative flex bg-transparent w-full max-w-xs border rounded-full h-8 p-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative z-10 w-1/2 text-nowrap text-xs text-center layer-transition rounded-full ${
                            activeTab === tab.id
                              ? "text-blue-500 dark:text-[#48AAFF]"
                              : "text-color-primary"
                          }`}
                        >
                          {tab.label}
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="tab-indicator"
                              className="absolute inset-0  bg-blue-100   dark:bg-blue-500/20  text-[13px]  rounded-full"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              style={{ zIndex: -1 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  
                </div>

                <div className="flex flex-row  flex-1 justify-center gap-2 items-center h-12">
                  <div className="flex items-center h-full">
                    <div className="text-[13px] flex gap-2 flex-nowrap">
                      <span className="">{artifact.title}</span>{" "}
                      <code className="bg-accent px-1 rounded-md font-mono">
                        V{currentVersionIndex + 2}
                      </code>
                    </div>
                  </div>
                </div>

                {/* <ArtifactActions
              /> */}
                <div className="h-full flex items-center">
                  <ArtifactCloseButton />
                </div>
              </div>

              <div className=" relative flex h-full flex-row flex-grow-0 bg-vs-code overflow-hidden w-dvw md:max-w-[calc(100dvw_-_400px)]">
                <AppSidebar />

                <SidebarInset>
                  <header className="px-6 flex items-center py-1 bg-vs-code text-xs"></header>
                  <artifactDefinition.content
                    title={artifact.title}
                    content={
                      isCurrentVersion
                        ? artifact.content
                        : getDocumentContentById(currentVersionIndex)
                    }
                    mode={mode}
                    status={artifact.status}
                    currentVersionIndex={currentVersionIndex}
                    onSaveContent={saveContent}
                    isInline={false}
                    isCurrentVersion={isCurrentVersion}
                    getDocumentContentById={getDocumentContentById}
                    isLoading={isDocumentsFetching && !artifact.content}
                    metadata={metadata}
                    setMetadata={setMetadata}
                  />
                  <footer>hello how are ou</footer>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Artifact = memo(PureArtifact, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (!equal(prevProps.messages, nextProps.messages.length)) return false;

  return true;
});
