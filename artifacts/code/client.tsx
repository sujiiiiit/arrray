import { Artifact } from "@/components/code/create-artifact";
import { CodeEditor } from "@/components/code/code-editor";



interface Metadata {
  // Console-related fields removed
}

export const codeArtifact = new Artifact<"code", Metadata>({
  kind: "code",
  description: "Create Websites in minutes.",
  initialize: async () => {
    // Console initialization removed
  },
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "code-delta") {
      interface DraftArtifact {
        content: string;
        isVisible?: boolean;
        status?: string;
      }

      interface StreamPart {
        type: string;
        content: string;
      }

      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        isVisible:
          draftArtifact.status === "streaming" &&
          draftArtifact.content.length > 300 &&
          draftArtifact.content.length < 310
            ? true
            : draftArtifact.isVisible,
        status: "streaming",
      }));
    }
  },
  content: (props) => {
    return (
      <div className="px-1">
        <CodeEditor height="calc(100vh - 4rem)" {...props} />
      </div>
    );
  },

});
