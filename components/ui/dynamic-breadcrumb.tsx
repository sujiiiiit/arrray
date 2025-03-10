"use client";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/common-dropdown";

interface PathMap {
  [key: string]: string;
}

interface DynamicBreadcrumbProps {
  /**
   * Root path to start from (default: '/')
   */
  rootPath?: string;
  /**
   * Display name for the root path (default: 'Home')
   */
  rootName?: string;
  /**
   * Custom mapping of path segments to display names
   */
  pathNames?: PathMap;
  /**
   * Paths to exclude from the breadcrumb
   */
  excludePaths?: string[];
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Whether to transform path segments to title case if no mapping is provided
   */
  titleCase?: boolean;
}

export function DynamicBreadcrumb({
  rootPath = "/",
  rootName = "Home",
  pathNames = {},
  excludePaths = [],
  className = "",
  titleCase = true,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  
  // Store all path segments
  const allPaths = React.useMemo(() => {
    if (!pathname) return [rootPath];

    // Start with the root path
    const paths = [rootPath];

    // Skip the root path in segments
    const segments = pathname.replace(rootPath, "").split("/").filter(Boolean);

    // Build paths incrementally
    let currentPath = rootPath;
    segments.forEach((segment) => {
      currentPath = currentPath.endsWith("/")
        ? `${currentPath}${segment}`
        : `${currentPath}/${segment}`;

      // Only add if not in excluded paths
      if (!excludePaths.includes(currentPath)) {
        paths.push(currentPath);
      }
    });

    return paths;
  }, [pathname, rootPath, excludePaths]);

  // State to track which paths to show
  const [displayState, setDisplayState] = useState({
    showEllipsis: false,
    visiblePaths: allPaths,
    hiddenPaths: [] as string[],
  });

  // Check overflow and update display state once after mount and when dependencies change
  useLayoutEffect(() => {
    const checkAndUpdateDisplay = () => {
      if (!containerRef.current || !breadcrumbRef.current || allPaths.length <= 2) {
        setDisplayState({
          showEllipsis: false,
          visiblePaths: allPaths,
          hiddenPaths: [],
        });
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const breadcrumbWidth = breadcrumbRef.current.scrollWidth;
      
      if (breadcrumbWidth > containerWidth) {
        // It's overflowing, show first and last path with ellipsis
        setDisplayState({
          showEllipsis: true,
          visiblePaths: [allPaths[0], allPaths[allPaths.length - 1]],
          hiddenPaths: allPaths.slice(1, allPaths.length - 1),
        });
      } else {
        // No overflow, show all paths
        setDisplayState({
          showEllipsis: false,
          visiblePaths: allPaths,
          hiddenPaths: [],
        });
      }
    };

    // Initial update after render
    const timeoutId = setTimeout(checkAndUpdateDisplay, 0);
    
    // Add resize handler
    const handleResize = () => {
      checkAndUpdateDisplay();
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [allPaths]);

  // Format a path segment to a display name
  const formatPathSegment = (segment: string): string => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get display name for a path
  const getPathName = (path: string) => {
    // For root path
    if (path === rootPath) return rootName;

    // Get the last segment of the path
    const segment = path.split("/").pop() || "";

    // Check if we have a custom name for this path
    if (pathNames[path]) return pathNames[path];

    // Check if we have a custom name for this segment
    if (pathNames[segment]) return pathNames[segment];

    // Format the segment if titleCase is enabled
    return titleCase ? formatPathSegment(segment) : segment;
  };

  // Check if path is the current page (last segment)
  const isCurrentPage = (path: string) => {
    return path === pathname;
  };

  // Use a basic rendering initially
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className={className}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{getPathName(pathname || rootPath)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={breadcrumbRef} className="w-full">
        <Breadcrumb>
          <BreadcrumbList>
            {displayState.visiblePaths.map((path, index) => (
              <React.Fragment key={path}>
                {index > 0 && <BreadcrumbSeparator />}

                <BreadcrumbItem>
                  {isCurrentPage(path) ? (
                    <BreadcrumbPage>{getPathName(path)}</BreadcrumbPage>
                  ) : (
                    <Link className="transition-colors hover:text-foreground" href={path}>{getPathName(path)}</Link>
                  )}
                </BreadcrumbItem>

                {/* Show dropdown after first item if there are hidden paths */}
                {index === 0 && displayState.showEllipsis && displayState.hiddenPaths.length > 0 && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          <BreadcrumbEllipsis className="h-4 w-4" />
                          <span className="sr-only">Show hidden paths</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {displayState.hiddenPaths.map((hiddenPath) => (
                            <DropdownMenuItem key={hiddenPath} asChild>
                              <Link href={hiddenPath}>
                                {getPathName(hiddenPath)}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                  </>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}