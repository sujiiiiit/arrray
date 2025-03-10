"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@react-hook/media-query";

export default function SettingsPage() {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDesktop) {
      router.push("/settings/profile");
    }
  }, [isDesktop, router]);

  return null;
}