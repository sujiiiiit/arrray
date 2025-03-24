import { getChatById, getVotesByChatId, voteMessage } from "@/actions/chat";

export async function GET(request: Request) {
  const chatId = new URL(request.url).searchParams.get("chatId");

  if (!chatId) return new Response("chatId is required", { status: 400 });

  try {
    const { data: chat, error: chaterror } = await getChatById({ id: chatId });

    if (chaterror)
      return new Response(`Failed to get chat: ${chaterror}`, {
        status: 500,
      });
    if (!chat) return new Response("Chat not found", { status: 404 });

    const { data: votes, error: voteError } = await getVotesByChatId({
      id: chatId,
    });

    if (voteError)
      return new Response(`Failed to get votes: ${voteError}`, {
        status: 500,
      });

    return Response.json(votes, { status: 200 });
  } catch (error) {
    console.error(`Error in GET: ${error}`);
    return new Response(`Internal Server Error: ${error}`, {
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
      return new Response("messageId and type are required", { status: 400 });
    }

    const { data: chat, error: chaterror } = await getChatById({
      id: chatId,
    });

    if (chaterror)
      return new Response(`Failed to get chat: ${chaterror}`, {
        status: 500,
      });
    if (!chat) return new Response("Chat not found", { status: 404 });

    await voteMessage({ chatId, messageId, type });

    return new Response("Message voted", { status: 200 });
  } catch (error) {
    console.error("Error in PATCH:", error);
    return new Response(
      JSON.stringify({ error: `Failed to process vote: ${error}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
