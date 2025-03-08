"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import { Input } from "@/components/ui/input";
interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export function SidebarWithContext({ children, className }: SidebarProps) {
  const { isSidebarOpen, close } = useSidebar();

  return (
    <>
      {/* Backdrop - only visible when sidebar is open */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0  w-full sm:max-w-xs bg-messageContainer shadow-lg z-50 layer-transition",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full ">
          <header className="flex justify-between gap-2 items-center border-b border-light header-height px-4">
            <Button
              variant="ghost"
              size={"icon"}
              className="aspect-square text-color-secondary toggle-sidebar"

            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 12h16M9 17s-5-3.682-5-5s5-5 5-5"
                  color="currentColor"
                />
              </svg>
            </Button>
            <Input
              type="text"
              className="bg-transparent header-height border-0 border-l rounded-none border-light"
              placeholder="Search..."
            />
          </header>

          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </aside>
    </>
  );
}
