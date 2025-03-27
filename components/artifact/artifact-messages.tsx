import { PreviewMessage } from "@/components/chat/message";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { UIMessage } from "ai";
import { memo } from "react";
import { UIArtifact } from "./artifact";
import { UseChatHelpers } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtifactMessagesProps {
  chatId: string;
  status: UseChatHelpers["status"];
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  artifactStatus: UIArtifact["status"];
}

function PureArtifactMessages({
  chatId,
  status,
  messages,
  setMessages,
  reload,
  isReadonly,
}: ArtifactMessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <ScrollArea
      ref={messagesContainerRef}
      className="flex flex-col gap-4 h-full items-center py-6 px-2 scrollbar"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          chatId={chatId}
          key={message.id}
          message={message}
          isLoading={status === "streaming" && index === messages.length - 1}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </ScrollArea>
  );
}

function areEqual(
  prevProps: ArtifactMessagesProps,
  nextProps: ArtifactMessagesProps
) {
  if (
    prevProps.artifactStatus === "streaming" &&
    nextProps.artifactStatus === "streaming"
  )
    return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;

  return true;
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual);
