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
      className="border-0 shadow-sm"
    >
      <SidebarHeader className="px-3 py-4">
        <div className="flex h-10 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="SITA.dev"
              width={86}
              height={86}
              priority
              className="size-9 object-contain"
            />
          </div>

          <p className="truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Mini AI HR
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-5">
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
                  className="h-10 px-3 font-medium transition-colors"
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
              className="h-10 px-3 font-medium text-muted-foreground transition-colors hover:text-foreground"
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