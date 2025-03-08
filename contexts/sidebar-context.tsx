"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SidebarContextType = {
  isSidebarOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  // Connect to the toggle-sidebar button
  useEffect(() => {
    const toggleButtons = document.getElementsByClassName("toggle-sidebar")

    const handleToggle = () => {
      toggle()
    }

    Array.from(toggleButtons).forEach((button) => {
      button.addEventListener("click", handleToggle)
    })

    return () => {
      Array.from(toggleButtons).forEach((button) => {
        button.removeEventListener("click", handleToggle)
      })
    }
  }, [])


  return <SidebarContext.Provider value={{ isSidebarOpen, toggle, open, close }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

