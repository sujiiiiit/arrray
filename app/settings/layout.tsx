"use client";
import { ReactNode } from "react";
import { ProgressBarLink } from "@/components/ui/page-progress";
import { usePathname } from "next/navigation";
import { Keys, Profile, RightArrowSmall, LeftArrow } from "./icons";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { useState, useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// Navigation configuration - easier to maintain and extend
const NAVIGATION_ITEMS = [
  { name: "profile", href: "/settings/profile", icon: <Profile /> },
  { name: "Manage keys", href: "/settings/keys", icon: <Keys /> },
];

// Path mapping for breadcrumbs and titles - centralized for consistency
const PATH_NAMES = {
  "/settings/profile": "Profile",
  "/settings/keys": "Manage Keys",
  // Add more path mappings here as needed
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Determine if we're at the main settings route
  const isMainSettingsRoute = pathname === "/settings";

  // Initialize sidebar state based on current route
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMainSettingsRoute);

  // Update sidebar state when pathname changes
  useEffect(() => {
    setIsSidebarOpen(!isMainSettingsRoute);
  }, [isMainSettingsRoute]);

  // Memoize active state calculations to prevent unnecessary re-renders
  const navigationWithActiveState = useMemo(
    () =>
      NAVIGATION_ITEMS.map((item) => ({
        ...item,
        isActive:
          item.href === "/settings"
            ? isMainSettingsRoute
            : pathname.startsWith(item.href),
      })),
    [pathname, isMainSettingsRoute]
  );

  // Get the current page title based on pathname
  const pageTitle = useMemo(() => {
    if (isMainSettingsRoute) return "Settings";
    return PATH_NAMES[pathname as keyof typeof PATH_NAMES] || "Settings";
  }, [pathname, isMainSettingsRoute]);

  return (
    <>
      {/* Breadcrumb header */}
      <header className="h-12 flex justify-start items-center max-w-screen-xl px-4 mx-auto">
        <DynamicBreadcrumb pathNames={PATH_NAMES} className="w-full" />
      </header>

      <ScrollArea className="h-[calc(100dvh_-_6rem)] w-full relative sm:overflow-auto">
        {/* Sidebar Navigation */}
        <div className="flex w-full max-w-screen-xl mx-auto  ">
          <aside
            className="w-full sm:max-w-xs bg-background px-3 py-2 layer-transition 
            sm:relative sm:translate-x-0 sticky top-0 
            -translate-x-20 data-[open=true]:translate-x-0
            dark:border-background "
            data-open={!isSidebarOpen}
          >
            <nav className="w-full">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <ul className="sm:space-y-2 w-full">
                {navigationWithActiveState.map((item) => (
                  <li key={item.name} className="w-full flex flex-nowrap gap-1">
                    {item.isActive && (
                      <div className="sm:flex hidden w-1 h-14 sm:h-auto bg-blue-500 sm:bg-blue-500 rounded-full" />
                    )}
                    <ProgressBarLink
                      href={item.href}
                      className={`group h-14 sm:h-auto border-b sm:border-0 
                                flex items-center justify-between
                                px-4 py-2 w-full sm:max-w-64 sm:rounded-md
                                transition-colors duration-200
                                ${
                                  item.isActive
                                    ? "sm:bg-blue-100 sm:text-blue-500 sm:dark:bg-blue-500/20 sm:dark:text-blue-300"
                                    : "hover:bg-accent sm:ml-2"
                                }`}
                      aria-current={item.isActive ? "page" : undefined}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-sm">{item.name}</span>
                      </span>
                      <span className="flex sm:hidden">
                        <RightArrowSmall />
                      </span>
                    </ProgressBarLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main
            className="sm:flex-1 px-3 py-2 layer-transition 
                     w-full flex 
                     bg-background
                     fixed sm:relative h-[calc(100dvh_-_6rem)] sm:h-auto
                     data-[open=false]:translate-x-0 data-[open=true]:translate-x-full 
                     sm:data-[open=true]:translate-x-0  overflow-auto sm:overflow-hidden "
            data-open={!isSidebarOpen}
          >
            <div className="w-full">
              <div className="flex items-center justify-between border-b border-light sm:pb-4 pb-2 px-3 sm:px-6">
                <div className="flex items-center gap-4">
                  <ProgressBarLink
                    href="/settings"
                    className="flex aspect-square items-center text-color-secondary hover:text-color-primary relative shrink-0 sm:hidden"
                  >
                    <LeftArrow />
                  </ProgressBarLink>
                  <h2 className="text-xl font-bold">{pageTitle}</h2>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row w-full py-10 justify-between gap-2">
                {children}
              </div>
            </div>
          </main>
        </div>
      </ScrollArea>
    </>
  );
}
