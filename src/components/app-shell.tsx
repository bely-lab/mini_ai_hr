"use client";

import { ReactNode } from "react";
import { Menu } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

function MenuToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="-ml-1 size-9 text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-label="Toggle sidebar"
    >
      <Menu className="size-5" strokeWidth={1.75} />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

export function AppShell({
  children,
  title,
  description,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center bg-background/95 px-4 shadow-sm backdrop-blur lg:px-6">
          <MenuToggle />

          <span className="ml-3 truncate text-sm font-medium text-foreground">
            {title}
          </span>
        </header>

        <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
          <div className="mx-auto w-full max-w-7xl px-4 py-7 lg:px-8 lg:py-8">
            {description && (
              <div className="mb-7">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            )}

            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}