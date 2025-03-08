const Attachments = () => {
  return (
    <>
      <div className="-ml-1.5 flex flex-nowrap gap-2 overflow-x-auto p-1.5">
        <div className="group relative inline-block text-sm ">
          <div className="relative overflow-hidden border border-light bg-accent rounded-2xl">
            <div className="p-2 min-w-40 w-auto max-w-52">
              <div className="flex flex-row items-center gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 36 36"
                    fill="none"
                    className="h-10 w-10 flex-shrink-0"
                    width="36"
                    height="36"
                  >
                    <rect width="36" height="36" rx="6" fill="#0088FF"></rect>
                    <path
                      d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z"
                      stroke="white"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M18.833 9.66663V15.5H24.6663"
                      stroke="white"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <div className="truncate font-semibold">p3.ipynb</div>
                  <div className="truncate text-color-secondary">File</div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full transition-colors border-[3px] border-[#f4f4f4] bg-black p-[2px] text-white dark:border-token-main-surface-secondary dark:bg-white dark:text-black"
          >
            <span data-state="closed">
              <svg
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-xs"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
        </div>
        <div className="group relative inline-block text-sm ">
          <div className="relative overflow-hidden border border-light bg-accent rounded-2xl">
            <div className="h-14 w-14">
              <button type="button" className="h-full w-full">
                <span className="flex items-center h-full w-full justify-center bg-accent bg-cover bg-center text-white"></span>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full transition-colors border-[3px] border-[#f4f4f4] bg-black p-[2px] text-white dark:border-token-main-surface-secondary dark:bg-white dark:text-black"
          >
            <span data-state="closed">
              <svg
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-xs"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Attachments;
