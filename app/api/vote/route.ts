'use server'

import { getChatById, getVotesByChatId, voteMessage } from "@/actions/chat";
import { auth } from "@/actions/users";

export async function GET(request: Request) {
  const chatId = new URL(request.url).searchParams.get("chatId");

  if (!chatId) {
    return new Response(JSON.stringify({ error: "chatId is required" }), {
      status: 400,
    });
  }

  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get chat data with proper error handling
    const {data:chatResult,error:chatResultError} = await getChatById({ id: chatId });

    if (!chatResult) {
      console.error("Failed to get chat:", chatResultError);
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    // Get votes
    const {data:votesResult,error} = await getVotesByChatId({ id: chatId });
    console.log("votesResult",votesResult);

    if (!votesResult) {
      console.error("Failed to get votes:",error);
      return new Response(
        JSON.stringify({ error: "Failed to retrieve votes" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ votes: votesResult }), {
      status: 200,
    });
  } catch (error) {
    console.error(`Error in GET:`, error);
    return new Response(JSON.stringify({ error: `Internal Server Error` }), {
      status: 500,
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const {
      chatId,
      messageId,
      type,
    }: { chatId: string; messageId: string; type: "up" | "down" } =
      await request.json();

    if (!chatId || !messageId || !type) {
      return new Response(
        JSON.stringify({ error: "messageId, chatId, and type are required" }),
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Verify chat exists and user has access
    const {data:chatResult,error} = await getChatById({ id: chatId });

    if (!chatResult) {
      console.error("Failed to get chat:", error);
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    // Submit the vote
    await voteMessage({
      chatId,
      messageId,
      type,
    });

    

    return new Response(
      JSON.stringify({ message: "Vote recorded successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH:", error);
    return new Response(JSON.stringify({ error: "Failed to process vote" }), {
      status: 500,
    });
  }
}
