"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Clock,
  Home,
  Users,
  FolderKanban,
  BarChart3,
  CreditCard,
  Settings,
  Building2,
  CalendarDays,
  User
} from "lucide-react"

const navigationItems = {
  overview: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Time Entries",
      href: "/time-entries",
      icon: Clock,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: CalendarDays,
    },
  ],
  management: [
    {
      title: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: Building2,
    },
    {
      title: "Team",
      href: "/team",
      icon: Users,
    },
  ],
  finance: [
    {
      title: "Invoices",
      href: "/invoices",
      icon: CreditCard,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
  ],
  system: [
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Profile",
      href: "settings/profile",
      icon: User,
    },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()

  const renderMenuItems = (items: typeof navigationItems.overview) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <Link 
          href={item.href} 
          className="w-full"
          aria-current={pathname === item.href ? "page" : undefined}
        >
          <SidebarMenuButton active={pathname === item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    ))
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-xl font-semibold">Timeline</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(navigationItems.overview)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(navigationItems.management)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(navigationItems.finance)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(navigationItems.system)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
