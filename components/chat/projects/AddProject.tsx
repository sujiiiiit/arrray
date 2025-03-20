interface AddProjectProps {
  selectedProject?: { name: string };
  success?: boolean;
}

export function AddProject({ selectedProject,success }: AddProjectProps) {
  return (
    <label className={`flex h-9 min-w-8 items-center justify-center rounded-full border p-2 pl-3 text-[13px] font-medium  cursor-pointer group  transition-all  gap-[2px] outline-0 layer-transition ${success ? 'bg-blue-100 border-blue-100 text-blue-500 dark:text-[#48AAFF] dark:bg-blue-500/20 dark:border-blue-500/20 ' : 'bg-transparent hover:bg-accent text-color-secondary border-light'}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[18px] w-[18px] shrink-0"
      >
        <path
          d="M13 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C21.9796 9.05942 21.9992 10.0588 22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 15.4615V17.9231C21 19.6224 19.6569 21 18 21C16.3431 21 15 19.6224 15 17.9231V14.5385C15 13.6888 15.6716 13 16.5 13C17.3284 13 18 13.6888 18 14.5385V17.9231"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="min-w-0 text-inherit items-center pl-1 pr-1 select-none w-full max-w-24 truncate">
        {selectedProject ? selectedProject.name : "Project"}
      </p>
    </label>
  );
}