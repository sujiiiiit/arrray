import { memo } from "react";
import { CrossIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { initialArtifactData, useArtifact } from "@/hooks/use-artifact";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
function PureArtifactCloseButton() {
  const { setArtifact } = useArtifact();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="artifact-close-button"
          variant="ghost"
          className="w-5 h-5"
          size={"actions"}
          onClick={() => {
            setArtifact((currentArtifact) =>
              currentArtifact.status === "streaming"
                ? {
                    ...currentArtifact,
                    isVisible: false,
                  }
                : { ...initialArtifactData, status: "idle" }
            );
          }}
        >
          <CrossIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent variant="default" size="xs" shape="md" side="bottom">
        Close
      </TooltipContent>
    </Tooltip>
  );
}

export const ArtifactCloseButton = memo(PureArtifactCloseButton, () => true);
