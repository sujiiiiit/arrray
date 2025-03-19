import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeftArrow } from "@/app/settings/icons";
import { createProjectAction } from "@/actions/projects";
import { toast } from "sonner";

export function CreateProject({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [state, setState] = useState({
    createOpen: false,
    projectName: "",
    isSubmitting: false,
  });
  const { createOpen, projectName, isSubmitting } = state;

  const handleSubmit = useCallback(async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const result = await createProjectAction(projectName.trim());
      if (result.success) {
        toast.success(`Project "${projectName}" created successfully`);
        setState({ createOpen: false, projectName: "", isSubmitting: false });
        onProjectCreated(); // Update project list
      } else {
        toast.error(result.error || "Failed to create project");
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [projectName, onProjectCreated]);

  return (
    <div className="flex w-full px-4 relative rounded-3xl items-center h-10">
      <Button
        onClick={() => setState((prev) => ({ ...prev, createOpen: true }))}
        className={`layer-transition rounded-full absolute right-0 left-0 sm:right-4 sm:left-4 ${
          createOpen ? "z-10 border-none bg-transparent" : "z-20"
        } hover:bg-primary`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="icons shrink-0"
          fill="none"
        >
          <path
            d="M12 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Create Project
      </Button>

      <Input
        value={projectName}
        onChange={(e) =>
          setState((prev) => ({ ...prev, projectName: e.target.value }))
        }
        placeholder="Enter project name"
        className={`layer-transition rounded-3xl absolute right-0 left-0 sm:right-4 sm:left-4 w-auto px-12 bg-messageContainer ${
          createOpen ? "z-20" : "z-10"
        }`}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />

      <Button
        onClick={handleSubmit}
        size={"icon"}
        variant={"ghost"}
        disabled={isSubmitting}
        className={`absolute right-3 sm:right-7 h-7 w-7 rounded-full ${
          createOpen ? "z-20" : "z-10"
        }`}
      >
        {isSubmitting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
            <path
              d="M5 14L8.5 17.5L19 6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Button>
      <Button
        onClick={() =>
          setState({ createOpen: false, projectName: "", isSubmitting: false })
        }
        size={"icon"}
        variant={"ghost"}
        className={`absolute left-3 sm:left-7 h-7 w-7 rounded-full ${
          createOpen ? "z-20" : "z-10"
        }`}
      >
        <LeftArrow />
      </Button>
    </div>
  );
}