'use server'

import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { systemPrompt } from "@/lib/ai/prompts";

import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/actions/chat";

import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from "@/lib/utils";

import { auth } from "@/actions/users";

import { generateTitleFromUserMessage } from "@/actions/actions";

import { createDocument } from "@/lib/ai/tools/create-document";

import { updateDocument } from "@/lib/ai/tools/update-document";
import { isProductionEnvironment } from "@/lib/constants";
import { myProvider } from "@/lib/ai/providers";

// export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return Response.json({ error: "No user message found" }, { status: 400 });
    }

    // Get chat data - Note: performSupabaseAction returns {data, success, error}
    const { data: chatResult, error } = await getChatById({ id });

    if (!chatResult) {
      console.error("Error getting chat:", error);
    }

    // This is chatResult.data, not chat.data as in your original code
    const chatData = chatResult;
    console.log("chatData:", chatData);

    if (!chatData) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

     await saveChat({
        id,
        userId: session.user.id,
        title,
      });

    } else if (chatData.userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    
      await saveMessages({
        messages: [
          {
            chatId: id,
            id: userMessage.id,
            role: "user",
            parts: userMessage.parts,
            attachments: userMessage.experimental_attachments ?? [],
            createdAt: new Date(),
          },
        ],
      });

  

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt,
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === "chat-model"
              ? ["createDocument", "updateDocument"]
              : ["createDocument", "updateDocument"],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: {
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                  await saveMessages({
                    messages: [
                      {
                        id: assistantId,
                        chatId: id,
                        role: assistantMessage.role,
                        parts: assistantMessage.parts,
                        attachments:
                          assistantMessage.experimental_attachments ?? [],
                        createdAt: new Date(),
                      },
                    ],
                  });

              } catch (_error) {
                console.error(`Failed to save assistant message: ${_error}`);
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error("Stream error:", error);
        return "Oops, an error occurred!";
      },
    });
  } catch (error) {
    console.error("POST handler error:", error);
    return Response.json(
      { error: `An error occurred while processing your request: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing chat ID" }, { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await getChatById({ id });

    // Properly handle the return value from performSupabaseAction
    if (!result.success || !result.data) {
      console.error("Chat not found:", result.error);
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    if (result.data.userId !== session.user.id) {
      console.error("Chat access denied");
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    const deleteResult = await deleteChatById({ id });

    if (!deleteResult.success) {
      console.error("Chat deletion error:", deleteResult.error);
      return Response.json({ error: "Failed to delete chat" }, { status: 500 });
    }

    return Response.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return Response.json(
      { error: `An error occurred: ${error}` },
      { status: 500 }
    );
  }
}
