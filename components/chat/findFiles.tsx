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
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toggleDialog } from "@/store/dialogSlice";

export default function DrawerDialogDemo() {
  const isOpen = useAppSelector((state) => state.dialog.isOpen);
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpenChange = () => {
    dispatch(toggleDialog());
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild></DrawerTrigger>
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
  const isOpen = useAppSelector((state) => state.dialog.isOpen);

  return (
    <>
      <Input
        autoFocus={isOpen}
        placeholder="Search files..."
        className={cn(
          "h-12 bg-transparent border-0 outline-0  px-4 border-x border-light rounded-none",
          className
        )}
      />
    </>
  );
}
