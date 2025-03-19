// Define the Project type
export interface Project {
  id: string | number;
  name: string;
  [key: string]: string | number;
}

// Reducer types for project fetching
export type ProjectsState = {
  projects: Project[];
  loading: boolean;
  error: string | null;
};

export type ProjectsAction =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: Project[] }
  | { type: "FETCH_FAILURE"; payload: string };

export function projectsReducer(
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { projects: action.payload, loading: false, error: null };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error("Unhandled action type");
  }
}