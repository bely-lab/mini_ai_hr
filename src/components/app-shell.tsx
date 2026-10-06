import { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

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
          <SidebarTrigger className="-ml-1" />

          <span className="ml-3 text-sm font-medium">
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