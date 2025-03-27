"use server";

import { getUser } from "@/lib/auth";
import { createSupabaseClient } from "@/supabase/server-client";
import { Chat,ArtifactKind } from "@/types";
import { DBMessage } from "@/lib/db/schema";

const TABLES = {
  CHATS: "Chat",
  MESSAGES: "Message",
  DOCUMENTS: "Document",
};

export async function performSupabaseAction(action: () => Promise<any>, errorMessage: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "User not authenticated", success: false };

    const result = await action();
    const { data, error } = result || { data: null, error: null };

    if (error) {
      console.error(`${errorMessage}:`, error);
      return { error: errorMessage, details: error, success: false };
    }

    return { data, success: true };
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return { error: errorMessage, details: error, success: false };
  }
}

export async function saveChat({ id, userId, title }: Chat) {
  console.log(`Attempting to save chat: ${id} for user: ${userId}`);
  
  return await performSupabaseAction(
    async () => {
      const supabase = await createSupabaseClient();
      const result = await supabase.from(TABLES.CHATS).insert([{ id, userId, title }]);
      console.log(`Chat save result:`, result);
      return result;
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