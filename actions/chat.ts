"use server";

import { getUser } from "@/lib/auth";
import { createSupabaseClient } from "@/supabase/server-client";
import { Chat,ArtifactKind } from "@/types";
import { Suggestion,DBMessage } from "@/lib/db/schema";

const TABLES = {
  CHATS: "Chat",
  VOTES: "Vote",
  MESSAGES: "Message",
  DOCUMENTS: "Document",
  SUGGESTIONS: "Suggestion",
};

export async function performSupabaseAction(action: () => Promise<any>, errorMessage: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "User not authenticated", success: false };

    const { data, error } = await action();

    if (error) {
      console.error(errorMessage, error);
      return { error: errorMessage, success: false };
    }

    return { data, success: true };
  } catch (error) {
    console.error(errorMessage, error);
    return { error: errorMessage, success: false };
  }
}

export async function saveChat({ id, userId, title }: Chat) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.CHATS).insert([{ id, userId, title }]);
    },
    "Failed to save chat"
  );
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.DOCUMENTS).insert([{
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      }]);
    },
    "Failed to save document"
  );
}

export async function deleteChatById({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();

      // Delete related votes and messages
      await supabase.from(TABLES.VOTES).delete().eq("chatId", id);
      await supabase.from(TABLES.MESSAGES).delete().eq("chatId", id);

      return await supabase.from(TABLES.CHATS).delete().eq("id", id).select();
    },
    "Failed to delete chat"
  );
}

export async function getChatsByUserId({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.CHATS).select().eq("userId", id).order("createdAt", { ascending: false });
    },
    "Failed to get chats"
  );
}

export async function getChatById({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.CHATS).select().eq("id", id).single();
    },
    "Failed to get chat"
  );
}

export async function saveMessages({ messages }: { messages: Array<DBMessage> }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.MESSAGES).insert(messages);
    },
    "Failed to save messages"
  );
}

export async function getMessagesByChatId({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.MESSAGES).select().eq("chatId", id).order("createdAt", { ascending: true });
    },
    "Failed to get messages"
  );
}

export async function voteMessage({ chatId, messageId, type }: { chatId: string; messageId: string; type: "up" | "down"; }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      
      const { data: existingVote, error: selectError } = await supabase
        .from(TABLES.VOTES)
        .select()
        .eq("messageId", messageId)
        .single();

      if (existingVote) {
        return await supabase
          .from(TABLES.VOTES)
          .update({ isUpvoted: type === "up" })
          .eq("messageId", messageId)
          .eq("chatId", chatId);
      } else {
        return await supabase.from(TABLES.VOTES).insert([{ chatId, messageId, isUpvoted: type === "up" }]);
      }
    },
    "Failed to vote message"
  );
}

export async function getVotesByChatId({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.VOTES).select().eq("chatId", id);
    },
    "Failed to get votes"
  );
}

export async function getDocumentsById({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.DOCUMENTS).select().eq("id", id).order("createdAt", { ascending: true });
    },
    "Failed to get documents"
  );
}

export async function getDocumentById({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.DOCUMENTS).select().eq("id", id).order("createdAt", { ascending: false });
    },
    "Failed to get document"
  );
}

export async function deleteDocumentsByIdAfterTimestamp({ id, timestamp }: { id: string; timestamp: Date; }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.SUGGESTIONS).delete().eq("id", id).gt("createdAt", timestamp);
    },
    "Failed to delete documents"
  );
}

export async function saveSuggestions({ suggestions }: { suggestions: Array<Suggestion>; }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.SUGGESTIONS).insert(suggestions);
    },
    "Failed to save suggestions"
  );
}

export async function getSuggestionsByDocumentId({ documentId }: { documentId: string; }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.SUGGESTIONS).select().eq("documentId", documentId);
    },
    "Failed to get suggestions"
  );
}

export async function getMessageById({ id }: { id: string }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.MESSAGES).select().eq("id", id);
    },
    "Failed to get message"
  );
}

export async function deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp }: { chatId: string; timestamp: Date; }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      const { data: messagesToDelete } = await supabase
        .from(TABLES.MESSAGES)
        .select("id")
        .eq("chatId", chatId)
        .gte("createdAt", timestamp);

      if (messagesToDelete && messagesToDelete.length > 0) {
        const messageIds = messagesToDelete.map((msg) => msg.id);

        await supabase.from(TABLES.VOTES).delete().eq("chatId", chatId).in("messageId", messageIds);
        return await supabase.from(TABLES.MESSAGES).delete().eq("chatId", chatId).in("id", messageIds).select();
      }

      return { data: [], success: true };
    },
    "Failed to delete messages"
  );
}

export async function updateChatVisiblityById({ chatId, visibility }: { chatId: string; visibility: 'private' | 'public'; }) {
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      return await supabase.from(TABLES.CHATS).update({ visibility }).eq("id", chatId).select();
    },
    "Failed to update chat visibility"
  );
}