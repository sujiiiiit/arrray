"use server";
import { getChatsByUserId } from "@/actions/chat";
import { getUser } from "@/lib/auth";
export async function GET() {
  const user = await getUser();
  // biome-ignore lint: Forbidden non-null assertion.
  const { data: chats, error: chatsError } = await getChatsByUserId({
    id: user?.id ?? "",
  });
  if (chatsError) {
    console.error("Error fetching history:", chatsError);
    return new Response(JSON.stringify({ error: "Failed to get history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.json(chats);
}
