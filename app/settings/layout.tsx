"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Keys, Profile, RightArrowSmall } from "./icons";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { useState, useEffect, useMemo } from "react";

// Navigation configuration - easier to maintain and extend
const NAVIGATION_ITEMS = [
  { name: "Profile", href: "/settings/profile", icon: <Profile /> },
  { name: "Manage keys", href: "/settings/keys", icon: <Keys /> },
];

// Path mapping for breadcrumbs - centralized for consistency
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
  const navigationWithActiveState = useMemo(() => 
    NAVIGATION_ITEMS.map(item => ({
      ...item,
      isActive: item.href === "/settings" 
        ? isMainSettingsRoute
        : pathname.startsWith(item.href)
    })),
    [pathname, isMainSettingsRoute]
  );

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <>
      {/* Breadcrumb header */}
      <header className="h-12 flex justify-start items-center max-w-screen-xl px-4 mx-auto">
        <DynamicBreadcrumb pathNames={PATH_NAMES} className="w-full" />
      </header>
      
      <div className="flex h-[calc(100dvh_-_6rem)] w-full max-w-screen-xl mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className="w-full sm:max-w-64 bg-background px-3 py-2 sm:border-r transition-transform duration-300 
                    sm:relative sm:translate-x-0 fixed 
                    -translate-x-20 data-[open=true]:translate-x-0
                    dark:border-background overflow-hidden"
          data-open={!isSidebarOpen}
        >
          <nav className="w-full">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <ul className="sm:space-y-2 w-full">
              {navigationWithActiveState.map((item) => (
                <li key={item.name} className="w-full">
                  <Link
                    onClick={() => setIsSidebarOpen(true)}
                    href={item.href}
                    className={`group h-14 sm:h-auto border-b sm:border-0 
                              flex items-center justify-between
                              px-4 py-2 w-full sm:max-w-64 sm:rounded-md
                              transition-colors duration-200
                              ${item.isActive
                                ? "sm:bg-blue-100 sm:text-blue-500 sm:dark:bg-blue-500/20 sm:dark:text-blue-300"
                                : "hover:bg-accent"
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
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="sm:flex-1 sm:p-8 transition-transform duration-300 
                   w-full flex items-center flex-col 
                   bg-background overflow-auto
                   fixed sm:relative h-[calc(100dvh_-_6rem)] sm:h-auto
                   data-[open=false]:translate-x-0 data-[open=true]:translate-x-full 
                   sm:data-[open=true]:translate-x-0"
          data-open={!isSidebarOpen}
        >
          {children}
        </main>
      </div>
    </>
  );
}