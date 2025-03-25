import { DataStreamWriter, tool } from 'ai';
import { Session } from '@supabase/supabase-js';
import { z } from 'zod';
import { getDocumentById } from '@/actions/chat';
import { documentHandlersByArtifactKind } from '@/lib/artifacts/server';


interface UpdateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}




export const updateDocument = ({ session, dataStream }: UpdateDocumentProps) =>
  tool({
    description: 'Update a document with the given description.',
    parameters: z.object({
      id: z.string().describe('The ID of the document to update'),
      description: z
        .string()
        .describe('The description of changes that need to be made'),
    }),
    execute: async ({ id, description }) => {
      const {data:document,error:docError} = await getDocumentById({ id });

      if (!document) {
        return {
          error: 'Document not found',
        };
      }else if(docError){
        return {
          error: 'Error fetching document',
        };
      }

      dataStream.writeData({
        type: 'clear',
        content: document.title,
      });

      // Ensure document has a valid kind, defaulting to 'code' if undefined or unsupported
      if (!document.kind || document.kind !== 'code') {
        console.warn(`Unsupported document kind: ${document.kind}, defaulting to 'code'`);
        document.kind = 'code'; // Force document kind to 'code'
      }

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === document.kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${document.kind}`);
      }

      await documentHandler.onUpdateDocument({
        document,
        description,
        dataStream,
        session,
      });

      dataStream.writeData({ type: 'finish', content: '' });

      return {
        id,
        title: document.title,
        kind: document.kind,
        content: 'The document has been updated successfully.',
      };
    },
  });