import {
  useEffect,
  useReducer,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/loading";
import { getProjectsAction } from "@/actions/projects";
import { toast } from "sonner";
import { projectsReducer } from "./reducer";

interface Project {
  id: string | number;
  name: string;
  [key: string]: string | number;
}

interface ProjectListProps {
  searchTerm: string;
  onSelect: (project: Project) => void;
  selectedProject?: Project;
}

interface ProjectListRef {
  refreshProjects: () => void;
}

export const ProjectList = forwardRef<ProjectListRef, ProjectListProps>(
  ({ searchTerm, onSelect, selectedProject }, ref) => {
    const [state, dispatch] = useReducer(projectsReducer, {
      projects: [],
      loading: true,
      error: null,
    });

    useEffect(() => {
      fetchProjects();
    }, []);

    async function fetchProjects() {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await getProjectsAction();
        if (result.success) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data || [] });
        } else {
          toast.error(result.error || "Failed to load projects");
          dispatch({ type: "FETCH_FAILURE", payload: result.error || "Error" });
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
        dispatch({ type: "FETCH_FAILURE", payload: errorMessage });
      }
    }

    const filteredProjects = useMemo(
      () =>
        state.projects.filter((project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      [state.projects, searchTerm]
    );

    const renderContent = () => {
      if (state.loading) {
        return (
          <div className="flex items-center justify-center h- sm:h-[calc(60dvh_-_10rem)] px-4 h-dvh max-h-[60dvh] ">
            <Spinner size={"lg"} />
          </div>
        );
      }
      if (!state.loading && filteredProjects.length === 0) {
        return (
          <p className="flex items-center justify-center h- sm:h-[calc(60dvh_-_10rem)] px-4 h-dvh max-h-[60dvh] text-color-secondary ">
            No projects found
          </p>
        );
      }
      return (
        <ScrollArea className="h-dvh max-h-[60dvh] sm:h-[calc(60dvh-10rem)] mt-0 w-full px-3">
          {filteredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelect(project)}
              className={`w-full flex gap-6 items-center ${
                selectedProject && selectedProject.id === project.id
                  ? "bg-blue-100 border-blue-100 text-blue-500 dark:text-[#48AAFF] dark:bg-blue-500/20 dark:border-blue-500/20 "
                  : "bg-messageContainer hover:bg-accent"
              } text-left px-5 py-2 rounded-lg  truncate`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                className="text-color-secondary h-5 w-5 shrink-0"
              >
                {selectedProject && selectedProject.id === project.id ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      className="text-blue-500 dark:text-[#48AAFF] dark:bg-blue-500/20 dark:border-blue-500/20 h-5 w-5 shrink-0"
                    >
                      <path
                        d="M5 14L8.5 17.5L19 6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <path
                      d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
              <span className="w-full max-w-52 truncate">
              {project.name}
              </span>
            </button>
          ))}
        </ScrollArea>
      );
    };

    useImperativeHandle(ref, () => ({
      refreshProjects: fetchProjects,
    }));

    return <>{renderContent()}</>;
  }
);
ProjectList.displayName = "ProjectList";