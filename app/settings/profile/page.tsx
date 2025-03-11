import { Tooltip,TooltipTrigger,TooltipContent } from "@/components/ui/tooltip";
const Page = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-light sm:pb-4 pb-2 px-3 sm:px-6 ">
        <h2 className="text-xl font-bold">Public profile</h2>
        <Tooltip>
        <TooltipTrigger className="text-xs text-color-secondary flex items-center gap-1">
          Github{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            className="h-3.5 w-3.5 inline-block"
          >
            <path
              d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.992 8H12.001"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </TooltipTrigger>
        <TooltipContent>
            <p className="text-sm">You have logged in with Github</p>
        </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Page;
