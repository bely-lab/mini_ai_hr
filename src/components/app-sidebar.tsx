"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  LayoutDashboard,
  LogOut,
  UsersRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: UsersRound,
  },
  {
    title: "AI Assistant",
    href: "/assistant",
    icon: Bot,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="bg-sidebar border-r-0"
    >
      <SidebarHeader className="px-3 py-3">
        <div className="flex h-16 items-center gap-3">
          <Image
  src="/logo.png"
  alt="SITA.dev"
  width={150}
  height={150}
  priority
  className="size-16 object-contain"
/>

          <p className="truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Mini AI HR
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-2">
        <SidebarMenu className="gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  className="h-10 rounded-lg px-3 font-medium"
                >
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-3"
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={handleSignOut}
              className="h-10 rounded-lg px-3 font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-[18px]" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}