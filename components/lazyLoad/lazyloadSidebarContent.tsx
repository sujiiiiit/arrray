"use client";
// LazySidebarContent.tsx
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import {Spinner} from "@/components/ui/loading";
// Dynamically import the SidebarContent component without server-side rendering.
const SidebarContent = dynamic(
  () =>
    import("@/components/sidebar/sidebar-content").then((mod) => mod.SidebarContent),
  { ssr: false }
);

const LazySidebarContent = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Loads only once when in view
    threshold: 0.1, // Adjust threshold as needed
  });

  return <div ref={ref}>{inView ? <SidebarContent /> : <Spinner/>}</div>;
};

export default LazySidebarContent;
