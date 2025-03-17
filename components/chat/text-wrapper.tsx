
const FileTile = () => {
  return (
    <div className="group/file-tile relative py-1.5">
      <button type="button" className="absolute -left-1 -top-1 z-10 hidden rounded-full border-[3px] border-[#f4f4f4] bg-black p-[2px] text-white group-hover/file-tile:block dark:border-token-main-surface-secondary dark:bg-white dark:text-black">
        <svg
          width="29"
          height="28"
          viewBox="0 0 29 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="icon-xs"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
      <div
        role="button"
        aria-label="Pasted Text"
        id="textdoc-message-temp-td-user:1742205130766"
        className="popover relative z-0 flex select-none flex-col overflow-hidden border bg-token-main-surface-primary transition-shadow duration-500 cursor-pointer font-regular border-light rounded-2xl w-full max-w-64"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.04) 0px 4px 4px 0px",
          opacity: "1",
          willChange: "auto",
          transform: "none",
          height: "10rem",
        }}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-2 self-start border-light px-4 transition-colors duration-700 py-3 text-sm font-medium text-color-secondary">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="flex-shrink-0 transition-[filter] grayscale">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 18 18"
                className="icon-md"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M5.897 2.25H6a.75.75 0 1 1 0 1.5c-.746 0-.971.006-1.138.051a1.5 1.5 0 0 0-1.06 1.06c-.045.167-.052.393-.052 1.139a.75.75 0 1 1-1.5 0v-.103c0-.597 0-1.04.102-1.423a3 3 0 0 1 2.122-2.122c.383-.103.826-.102 1.423-.102ZM13.138 3.8c-.166-.045-.392-.051-1.138-.051a.75.75 0 0 1 0-1.5h.103c.597 0 1.04 0 1.424.102a3 3 0 0 1 2.12 2.122c.104.383.103.826.103 1.423V6a.75.75 0 0 1-1.5 0c0-.746-.006-.972-.051-1.138a1.5 1.5 0 0 0-1.06-1.06ZM6 7.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 6 7.5Zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 6 10.5Zm-3 .75a.75.75 0 0 1 .75.75c0 .746.007.972.051 1.138a1.5 1.5 0 0 0 1.06 1.06c.168.045.393.052 1.14.052a.75.75 0 0 1 0 1.5h-.104c-.597 0-1.04 0-1.423-.102a3 3 0 0 1-2.122-2.122c-.103-.383-.102-.826-.102-1.423V12a.75.75 0 0 1 .75-.75Zm12 0a.75.75 0 0 1 .75.75v.103c0 .597 0 1.04-.102 1.423a3 3 0 0 1-2.121 2.122c-.384.103-.827.102-1.424.102H12a.75.75 0 0 1 0-1.5c.746 0 .972-.007 1.138-.051a1.5 1.5 0 0 0 1.061-1.06c.045-.167.051-.393.051-1.139a.75.75 0 0 1 .75-.75Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <span className="min-w-0 truncate">Pasted Text</span>
          </div>
          <div className="flex gap-2">
            <span className="" data-state="closed">
              <button
                type="button"
                className="rounded-lg p-1 text-color-secondary transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-0"
                style={{ willChange: "auto", opacity: "0.64" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icons"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6.41421L15.2071 10.2071C14.8166 10.5976 14.1834 10.5976 13.7929 10.2071C13.4024 9.81658 13.4024 9.18342 13.7929 8.79289L17.5858 5H14C13.4477 5 13 4.55228 13 4ZM4 13C4.55228 13 5 13.4477 5 14V17.5858L8.79289 13.7929C9.18342 13.4024 9.81658 13.4024 10.2071 13.7929C10.5976 14.1834 10.5976 14.8166 10.2071 15.2071L6.41421 19H10C10.5523 19 11 19.4477 11 20C11 20.5523 10.5523 21 10 21H4C3.44772 21 3 20.5523 3 20V14C3 13.4477 3.44772 13 4 13Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
        <div className="relative flex min-h-0 w-full flex-1 flex-col self-end">
          <div className="whitespace-pre px-4" dangerouslySetInnerHTML={{ __html: "Pasted Text<br>asdasd<br/>asdasd<br>Pasted Text<br>asdasd<br/>asdasd<br>" }}>

          </div>
          <div
            className="absolute bottom-0 z-20 h-24 w-full transition-colors"
            style={{
              height: "50px",
              background: "linear-gradient(rgba(0,0,0,0), var(--message-container))",
            }}
          ></div>
          <div
            className="absolute bottom-0 right-0 top-0 z-20 transition-colors"
            style={{
              width: "50px",
              background:
                "linear-gradient(to right, rgba(0,0,0,0), var(--message-container))",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FileTile;
