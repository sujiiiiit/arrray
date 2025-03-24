'use server';

import { getSuggestionsByDocumentId } from '@/actions/chat';

export async function getSuggestions({ documentId }: { documentId: string }) {
  const suggestions = await getSuggestionsByDocumentId({ documentId });
  return suggestions ?? [];
}
