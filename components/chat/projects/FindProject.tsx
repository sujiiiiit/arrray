import { useState, useCallback } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchInput } from "./SearchInput";
import { ProjectList } from "./ProjectList";
import { CreateProject } from "./CreateProject";
import { AddProject } from "./AddProject";
import { DialogDescription } from "@radix-ui/react-dialog";

// Main component: state only used for callbacks, not storing selectedProject
export interface Project {
  id: string | number;
  name: string;
  [key: string]: string | number;
}

interface DrawerDialogDemoProps {
  onSelect?: (project: Project) => void;
}

export default function DrawerDialogDemo({
  onSelect,
}: DrawerDialogDemoProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState<boolean>(false); // Add state for dialog/drawer open status
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Keep track of selected project
  const [success, setSuccess] = useState<boolean>(false);

  const handleProjectSelect = useCallback(
    (project: Project) => {
      if (selectedProject && selectedProject.id === project.id) {
        // Deselect if the same project is clicked again
        setSelectedProject(null);
        toast.success(`Deselected Project: ${project.name}`);
        setSuccess(false);
      } else {
        setSelectedProject(project);
        toast.success(`Selected Project: ${project.name}`);
        setSuccess(true);
        onSelect?.(project);
      }
      setOpen(false); // Close the dialog/drawer after selection
    },
    [onSelect, selectedProject]
  );

  const fetchProjects = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const handleOpenChange = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (isOpen) {
      setSearchTerm(""); // Reset search term when dialog/drawer is opened
    }
  };

  const commonContent = (
    <>
      <ProjectList
        key={refreshKey}
        searchTerm={searchTerm}
        onSelect={handleProjectSelect}
        selectedProject={selectedProject || undefined}
      />
    </>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger onClick={() => setOpen(true)}>
            <AddProject selectedProject={selectedProject || undefined} success={success} />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          Add Project to the conversation
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[600px] p-0 h-[60dvh] max-h-[60dvh] gap-0">
        <DialogHeader className="hidden">
          <DialogTitle>Search Files</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Search for projects to add to the conversation
        </DialogDescription>
        <div className="flex border-b border-light h-12 items-center justify-between">
          <span className="p-4 rounded-none rounded-tr-2xl text-color-secondary">
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              className="h-5 w-5 shrink-0"
            >
              <path
                d="M17.5 17.5L22 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <SearchInput onSearch={setSearchTerm} />
          <DialogClose className="p-4 rounded-none rounded-tr-2xl" />
        </div>
        {commonContent}
        <DialogFooter className="mt-0">
          <CreateProject onProjectCreated={fetchProjects} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger onClick={() => setOpen(true)}>
        <AddProject selectedProject={selectedProject || undefined} success={success} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-3">
          <DrawerTitle className="hidden">Search Files</DrawerTitle>
          <SearchInput
            onSearch={setSearchTerm}
            className="h-auto bg-accent border rounded-full"
          />
        </DrawerHeader>
        {commonContent}
        <DrawerFooter className="px-2 mt-0 pb-2">
          <CreateProject onProjectCreated={fetchProjects} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}