// components/chat/findFiles.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";
// import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tooltip,TooltipContent,TooltipTrigger } from "@/components/ui/tooltip";

export default function DrawerDialogDemo() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <Tooltip>
        <TooltipTrigger asChild>

        <DialogTrigger>

          <AddProject />
        </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          Add Project to the conversation
        </TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[600px] p-0  h-[60dvh] max-h-[60dvh]">
          <DialogHeader className="hidden">
            <DialogTitle>Search Files</DialogTitle>
            <DialogDescription>
              Search the files from the project space or you have uploaded
              recently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex border-b border-light h-12 items-center justify-between">
            <span className="p-4 rounded-none rounded-tr-2xl outline-0 text-color-secondary">
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
            <SearchInput />
            <DialogClose className="p-4 rounded-none rounded-tr-2xl outline-0 " />
          </div>
        </DialogContent>

      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <AddProject />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-3">
          <DrawerTitle className="hidden">Search Files</DrawerTitle>
          <DrawerDescription className="hidden">
            Search the files from the project space or you have uploaded
            recently.
          </DrawerDescription>
          <SearchInput className="h-auto bg-accent border rounded-full" />
        </DrawerHeader>
        <ScrollArea className="min-h-[35dvh] max-h-[55dvh] h-dvh px-4"></ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

export function SearchInput({ className }: { className?: string }) {
  return (
    <>
      <Input
        placeholder="Search projects..."
        className={cn(
          "h-12 bg-transparent border-0 outline-0  px-4 border-x border-light rounded-none",
          className
        )}
      />
    </>
  );
}

export function AddProject() {
  return (
    <label
    className="flex h-9 min-w-8 items-center justify-center rounded-full border p-2 pl-3 text-[13px] font-medium border-light cursor-pointer group hover:bg-accent text-color-secondary transition-all bg-transparent gap-[2px] outline-0"
  >
    <svg
     
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[18px] w-[18px]  shrink-0"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 13.5v8m4-4h-8m-7-11h9.75c2.107 0 3.16 0 3.917.506a3 3 0 0 1 .827.827c.465.695.502 1.851.505 3.667M12 6.5l-.633-1.267c-.525-1.05-1.005-2.106-2.168-2.542C8.69 2.5 8.108 2.5 6.944 2.5c-1.816 0-2.724 0-3.406.38A3 3 0 0 0 2.38 4.038C2 4.72 2 5.628 2 7.444V10.5c0 4.714 0 7.071 1.464 8.535C4.822 20.394 6.944 20.493 11 20.5"
        color="currentColor"
      />
    </svg>
  
    <p className="min-w-0 text-inherit items-center pl-1 pr-1 select-none w-full max-w-24 truncate">
      Project
    </p>
  </label>
  
  );
}
