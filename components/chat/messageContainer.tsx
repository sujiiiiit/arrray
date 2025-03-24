import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useFileUpload } from "@/hooks/useFileUpload";
import { motion, AnimatePresence } from "framer-motion";
import Attachments from "@/components/chat/attachments";
import FindProjects, { Project } from "@/components/chat/projects/FindProject";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toggleDialog } from "@/store/dialogSlice";
import {
  selectInput,
  setText,
  updateTimestamp,
  toggleSearch,
  selectProject,
} from "@/store/inputSlice";
import { clearAllFiles } from "@/store/uploadSlice";

const MessageContainer = () => {
  const inputState = useAppSelector(selectInput);
  // const uploadedImages = useAppSelector(selectImageFiles);
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Synchronize text input with Redux
  const handleTextChange = (text: string) => {
    if (textAreaRef.current) {
      textAreaRef.current.value = text;
      dispatch(setText(text));
    }
  };

  const handleSubmit = () => {
    // Get content from textarea which is synced with contentEditable
    const content = textAreaRef.current?.value || "";

    // Create a submission object that includes text and files
    const hasFiles = files.length > 0;

    // Add the content to the input slice
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
    if (contentEditableRef.current) {
      contentEditableRef.current.innerText = "";
      clearContent();
    }

    setTimeout(() => {
      dispatch(setText(""));
    }, 200);

    // Update timestamp when message is sent
    dispatch(updateTimestamp());

    // Now log the complete input state after updates
    console.log("Submit message:", content);
    console.log("Files attached:", files.length > 0 ? files : "none");
    console.log("Current input slice state:", inputState);

    // Clear all files from Redux store
    if (hasFiles) {
      // Import and use the clearAllFiles action from uploadSlice
      dispatch(clearAllFiles());
    }
  };

  const { contentEditableRef, hasContent, textAreaRef, clearContent } =
    useContentEditable({
      onSubmit: handleSubmit,
      onChange: handleTextChange,
    });

  const { files, fileInputRef, handleFileSelect, handlePaste, removeFile } =
    useFileUpload();

  // Handle search toggle
  const handleSearchToggle = () => {
    dispatch(toggleSearch());
  };

  // Handle file upload button click
  const handleFileUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("File upload button clicked");

    // Keep the dropdown open
    setDropdownOpen(true);

    // Directly click the file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+V or Cmd+V is handled by default paste behavior
    // But could add other shortcuts here

    // Example: Ctrl/Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleProjectSelect = (project: Project) => {
    console.log("Selected project:", project);
    dispatch(selectProject(project.id as string));
  };

  return (
    <>
    <AnimatePresence>
      <motion.div
        className="message-container w-full max-w-3xl sm:pb-4"
                initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="relative z-[1] flex h-full max-w-full flex-1 flex-col">
            <div className="group relative z-[1] flex w-full items-center">
              <div className="w-full p-3">
                <div
                  id="composer-background"
                  className="flex w-full max-w-3xl cursor-text flex-col rounded-3xl px-3 py-1 duration-150 ease-in-out contain-inline-size motion-safe:transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] dark:shadow-none shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] has-[:focus]:shadow-[0_2px_12px_0px_rgba(0,0,0,0.04),_0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] bg-token-main-surface-primary dark:bg-messageContainer transition-all border border-light dark:border-0 m-auto"
                >
                  {files.length > 0 && (
                    <div className="-ml-1.5 flex flex-nowrap gap-2 overflow-x-auto">
                      <Attachments files={files} onRemoveFile={removeFile} />
                    </div>
                  )}

                  <div className="flex flex-col justify-start">
                    <div className="flex min-h-[44px] items-start pl-1">
                      <div className="min-w-0 max-w-full flex-1">
                        <div className="relative flex max-h-52 overflow-y-auto">
                          <textarea
                            className="hidden"
                            ref={textAreaRef}
                            onChange={(e) => handleTextChange(e.target.value)}
                          ></textarea>
                          <div
                            contentEditable="true"
                            translate="no"
                            className="w-full p-[0.5rem_0] overflow-auto resize-none border-none outline-none text-base transition-all duration-200 ease-in-out relative"
                            id="prompt-textarea"
                            data-virtualkeyboard="true"
                            ref={contentEditableRef}
                            onPaste={handlePaste}
                            onKeyDown={handleKeyDown}
                            onInput={() => {
                              // Keep textarea synced with contentEditable on any input
                              if (
                                textAreaRef.current &&
                                contentEditableRef.current
                              ) {
                                textAreaRef.current.value =
                                  contentEditableRef.current.innerText;
                              }
                            }}
                          ></div>

                          <span
                            className="text-color-secondary block pointer-events-none absolute opacity-0 max-w-full p-2 pl-0 left-0 z-1 whitespace-nowrap overflow-ellipsis overflow-hidden transition-all data-[state=empty]:opacity-100 duration-150 ease-in-out transform data-[state=empty]:translate-x-0 data-[state=empty]:translate-y-0 translate-x-[calc(1rem_*_1)] translate-y-0"
                            data-state={hasContent ? "full" : "empty"}
                          >
                            Ask anything
                          </span>
                        </div>
                      </div>
                      <div className="w-[32px] pt-1">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none invisible fixed left-0 top-0 block"
                        >
                          O
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 mt-1 flex items-center justify-between sm:mt-5 gap-x-1.5">
                    <div className="flex gap-x-1.5">
                      <div>
                        <div className="relative">
                          <div className="relative">
                            <div className="flex flex-col">
                              <DropdownMenu
                                open={dropdownOpen}
                                onOpenChange={setDropdownOpen}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                      <button className="flex items-center justify-center h-9 rounded-full border border-light hover:bg-accent w-9 outline-none text-color-secondary">
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-[18px] w-[18px]"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
                                            fill="currentColor"
                                          ></path>
                                        </svg>
                                      </button>
                                    </DropdownMenuTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" align="center">
                                    <p>Attach file</p>
                                  </TooltipContent>

                                  <DropdownMenuContent side="top" align="start">
                                    <DropdownMenuItem
                                      id="toggle-dialog"
                                      onClick={() => dispatch(toggleDialog())}
                                    >
                                      <span className="flex items-center justify-center text-color-secondary h-5 w-5">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          className="h-5 w-5 shrink-0"
                                        >
                                          <path
                                            d="M13 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C21.9796 9.05942 21.9992 10.0588 22 12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                          />
                                          <path
                                            d="M22 21L19.8529 18.8529M19.8529 18.8529C19.9675 18.7384 20.0739 18.6158 20.1714 18.486C20.602 17.913 20.8571 17.2006 20.8571 16.4286C20.8571 14.535 19.3221 13 17.4286 13C15.535 13 14 14.535 14 16.4286C14 18.3221 15.535 19.8571 17.4286 19.8571C18.3753 19.8571 19.2325 19.4734 19.8529 18.8529Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span>Choose from Project space</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={handleFileUpload}
                                    >
                                      <span className="flex items-center justify-center text-color-secondary h-5 w-5">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          className="h-5 w-5 shrink-0"
                                        >
                                          <path
                                            d="M4 12.0005L4 14.5446C4 17.7896 4 19.4122 4.88607 20.5111C5.06508 20.7331 5.26731 20.9354 5.48933 21.1144C6.58831 22.0005 8.21082 22.0005 11.4558 22.0005C12.1614 22.0005 12.5141 22.0005 12.8372 21.8865C12.9044 21.8627 12.9702 21.8355 13.0345 21.8047C13.3436 21.6569 13.593 21.4075 14.0919 20.9086L18.8284 16.172C19.4065 15.594 19.6955 15.3049 19.8478 14.9374C20 14.5699 20 14.1611 20 13.3436V10.0005C20 6.22922 20 4.34361 18.8284 3.17203C17.7693 2.11287 16.1265 2.01125 13.0345 2.0015M13 21.5005V21.0005C13 18.172 13 16.7578 13.8787 15.8791C14.7574 15.0005 16.1716 15.0005 19 15.0005H19.5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M12 5.99954H4M8 1.99954V9.99954"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span>Upload from computer</span>
                                    </DropdownMenuItem>
                                    <Input
                                      ref={fileInputRef}
                                      type="file"
                                      className="hidden"
                                      onChange={handleFileSelect}
                                      multiple
                                      accept="image/*,application/pdf,text/plain"
                                    />
                                  </DropdownMenuContent>
                                </Tooltip>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger role="button" asChild>
                          <span data-state="closed">
                            <input
                              type="checkbox"
                              id="searchCheckbox"
                              className="hidden peer"
                              checked={inputState.searchEnabled}
                              onChange={handleSearchToggle}
                            />

                            <label
                              htmlFor="searchCheckbox"
                              className="flex h-9 min-w-8 items-center justify-center rounded-full border p-2 text-[13px] font-medium border-light cursor-pointer group hover:bg-accent text-color-secondary peer-checked:bg-blue-100 peer-checked:border-blue-100 transition-all peer-checked:text-blue-500 dark:peer-checked:text-[#48AAFF] dark:peer-checked:bg-blue-500/20 dark:peer-checked:border-blue-500/20"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[18px] w-[18px]"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9851 4.00291C11.9933 4.00046 11.9982 4.00006 11.9996 4C12.001 4.00006 12.0067 4.00046 12.0149 4.00291C12.0256 4.00615 12.047 4.01416 12.079 4.03356C12.2092 4.11248 12.4258 4.32444 12.675 4.77696C12.9161 5.21453 13.1479 5.8046 13.3486 6.53263C13.6852 7.75315 13.9156 9.29169 13.981 11H10.019C10.0844 9.29169 10.3148 7.75315 10.6514 6.53263C10.8521 5.8046 11.0839 5.21453 11.325 4.77696C11.5742 4.32444 11.7908 4.11248 11.921 4.03356C11.953 4.01416 11.9744 4.00615 11.9851 4.00291ZM8.01766 11C8.08396 9.13314 8.33431 7.41167 8.72334 6.00094C8.87366 5.45584 9.04762 4.94639 9.24523 4.48694C6.48462 5.49946 4.43722 7.9901 4.06189 11H8.01766ZM4.06189 13H8.01766C8.09487 15.1737 8.42177 17.1555 8.93 18.6802C9.02641 18.9694 9.13134 19.2483 9.24522 19.5131C6.48461 18.5005 4.43722 16.0099 4.06189 13ZM10.019 13H13.981C13.9045 14.9972 13.6027 16.7574 13.1726 18.0477C12.9206 18.8038 12.6425 19.3436 12.3823 19.6737C12.2545 19.8359 12.1506 19.9225 12.0814 19.9649C12.0485 19.9852 12.0264 19.9935 12.0153 19.9969C12.0049 20.0001 11.9999 20 11.9999 20C11.9999 20 11.9948 20 11.9847 19.9969C11.9736 19.9935 11.9515 19.9852 11.9186 19.9649C11.8494 19.9225 11.7455 19.8359 11.6177 19.6737C11.3575 19.3436 11.0794 18.8038 10.8274 18.0477C10.3973 16.7574 10.0955 14.9972 10.019 13ZM15.9823 13C15.9051 15.1737 15.5782 17.1555 15.07 18.6802C14.9736 18.9694 14.8687 19.2483 14.7548 19.5131C17.5154 18.5005 19.5628 16.0099 19.9381 13H15.9823ZM19.9381 11C19.5628 7.99009 17.5154 5.49946 14.7548 4.48694C14.9524 4.94639 15.1263 5.45584 15.2767 6.00094C15.6657 7.41167 15.916 9.13314 15.9823 11H19.9381Z"
                                  fill="currentColor"
                                ></path>
                              </svg>

                              <span className="flex text-inherit items-center whitespace-nowrap pl-1 pr-1 select-none">
                                Search
                              </span>
                            </label>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          <p>Search from internet </p>
                        </TooltipContent>
                      </Tooltip>
                      <FindProjects onSelect={handleProjectSelect} />
                    </div>
                    <div className="flex gap-4">
                      <div className="sm:flex hidden font-mono justify-start items-center text-xs gap-2 text-color-secondary select-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          fill="currentColor"
                          height="12px"
                          width="12px"
                          viewBox="0 0 60 60"
                        >
                          <path d="M49,38h-7V22h7c6.065,0,11-4.935,11-11S55.065,0,49,0S38,4.935,38,11v7H22v-7c0-6.065-4.935-11-11-11S0,4.935,0,11  s4.935,11,11,11h7v16h-7C4.935,38,0,42.935,0,49s4.935,11,11,11s11-4.935,11-11v-7h16v7c0,6.065,4.935,11,11,11s11-4.935,11-11  S55.065,38,49,38z M42,11c0-3.859,3.14-7,7-7s7,3.141,7,7s-3.14,7-7,7h-7V11z M11,18c-3.86,0-7-3.141-7-7s3.14-7,7-7s7,3.141,7,7v7  H11z M18,49c0,3.859-3.14,7-7,7s-7-3.141-7-7s3.14-7,7-7h7V49z M22,38V22h16v16H22z M49,56c-3.86,0-7-3.141-7-7v-7h7  c3.86,0,7,3.141,7,7S52.86,56,49,56z" />
                        </svg>
                        <code className="relative rounded">+ V to Paste</code>
                      </div>
                      <div className="min-w-9">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="relative flex h-9 items-center justify-center rounded-full bg-black text-white transition-all focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 can-hover:hover:opacity-70 dark:bg-white dark:text-black w-9"
                          disabled={!hasContent && files.length === 0}
                        >
                          <div className="flex items-center justify-center">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon-2xl"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
   
      </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MessageContainer;