"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContextValue {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div {...props}>{children}</div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { isCollapsed } = useSidebar()
  return (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "group relative flex flex-col border-r bg-background",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-14 items-center border-b px-4", className)}>
      {children}
    </div>
  )
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto", className)}>{children}</div>
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-2", className)}>{children}</div>
}

export function SidebarGroupLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <nav className={cn("space-y-1", className)}>{children}</nav>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2", className)}>{children}</div>
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function SidebarMenuButton({
  className,
  active,
  children,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarTrigger() {
  const { setIsCollapsed } = useSidebar()
  return (
    <button
      onClick={() => setIsCollapsed((prev) => !prev)}
      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )
}
