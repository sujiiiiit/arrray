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
  getDocumentById,
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

//  const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    console.error("GET: Missing document ID.");
    return Response.json({ error: "Missing document ID" }, { status: 400 });
  }

  const session = await auth();
  if (!session || !session.user) {
    console.error("GET: Unauthorized access attempt.");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: result, error } = await getDocumentById({ id });
    if (!result) {
      console.error(`GET: Document ${id} not found.`, error);
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    console.info(`GET: Successfully fetched document ${id}.`);
    return Response.json({ documents: result }, { status: 200 });
  } catch (err) {
    console.error("GET: Error fetching document:", err);
    return Response.json({ error: `An error occurred: ${err}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, messages, selectedChatModel }: { 
      id: string; 
      messages: UIMessage[]; 
      selectedChatModel: string; 
    } = await request.json();

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      console.error("POST: Unauthorized access attempt.");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);
    if (!userMessage) {
      console.error("POST: No user message found in the request payload.");
      return Response.json({ error: "No user message found" }, { status: 400 });
    }

    const { data: chatResult } = await getChatById({ id });
    if (!chatResult) {
      const title = await generateTitleFromUserMessage({ message: userMessage });
      await saveChat({ id, userId: session.user.id, title });
      console.info(`POST: New chat created with ID ${id} and title "${title}".`);
    } else if (chatResult.userId !== session.user.id) {
      console.error(`POST: Unauthorized access. Chat ${id} belongs to ${chatResult.userId}.`);
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
    console.info(`POST: User message saved for chat ${id}.`);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === "chat-model-reasoning"
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
                  messages: response.messages.filter((msg) => msg.role === "assistant"),
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
                      attachments: assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
                console.info(`POST: Assistant message saved for chat ${id}.`);
              } catch (assistantError) {
                console.error(`POST: Failed to save assistant message for chat ${id}:`, assistantError);
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream, { sendReasoning: true });
      },
      onError: () => "Oops, an error occurred!",
    });
  } catch (err) {
    console.error("POST: Unexpected error processing request:", err);
    return Response.json({ error: `An error occurred while processing your request: ${err}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    console.error("DELETE: Missing chat ID.");
    return Response.json({ error: "Missing chat ID" }, { status: 400 });
  }

  const session = await auth();
  if (!session || !session.user) {
    console.error("DELETE: Unauthorized access attempt.");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {data:result,error} = await getChatById({ id });
    if (!result) {
      console.error(`DELETE: Chat ${id} not found.`,error);
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
    
    if (result.data.userId !== session.user.id) {
      console.error(`DELETE: Access denied. User ${session.user.id} cannot delete chat ${id} owned by ${result.data.userId}.`);
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    const {data:deleteResult,error:deleteerror} = await deleteChatById({ id });
    if (!deleteResult) {
      console.error(`DELETE: Failed to delete chat ${id}:`, deleteerror);
      return Response.json({ error: "Failed to delete chat" }, { status: 500 });
    }

    console.info(`DELETE: Chat ${id} deleted successfully.`);
    return Response.json({ message: "Chat deleted" }, { status: 200 });
  } catch (err) {
    console.error(`DELETE: Unexpected error deleting chat ${id}:`, err);
    return Response.json({ error: `An error occurred: ${err}` }, { status: 500 });
  }
}
