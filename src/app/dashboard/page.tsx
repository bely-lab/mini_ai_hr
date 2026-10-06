import Link from "next/link";
import {
  ArrowRight,
  Building2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getEmployees } from "@/lib/employees/data";

export default async function DashboardPage() {
  const employees = await getEmployees();

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "inactive",
  );

  const departments = new Set(
    employees.map((employee) => employee.department),
  ).size;

  const recentEmployees = employees.slice(0, 5);

  const stats = [
    {
      label: "Total employees",
      value: employees.length,
      icon: Users,
    },
    {
      label: "Active employees",
      value: activeEmployees.length,
      icon: UserCheck,
    },
    {
      label: "Departments",
      value: departments,
      icon: Building2,
    },
    {
      label: "Inactive employees",
      value: inactiveEmployees.length,
      icon: UserX,
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      description="Overview of your HR workspace."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Recent employees</CardTitle>

               
              </div>

              <Link
                href="/employees"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </CardHeader>

            <CardContent>
              {recentEmployees.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
                  <Users className="mb-3 size-8 text-muted-foreground" />

                  <p className="font-medium">
                    No employees yet
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your first employee to get started.
                  </p>

                  <Link
                    href="/employees/new"
                    className={buttonVariants({
                      size: "sm",
                      className: "mt-4",
                    })}
                  >
                    Add employee
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {recentEmployees.map((employee) => (
                    <Link
                      key={employee.id}
                      href={`/employees/${employee.id}`}
                      className="flex items-center justify-between gap-4 rounded-md py-4 transition-colors hover:bg-muted/40 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {employee.full_name}
                        </p>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {employee.job_title} · {employee.department}
                        </p>
                      </div>

                      <Badge
                        variant={
                          employee.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>

              
            </CardHeader>

            <CardContent className="space-y-3">
              <Link
                href="/employees/new"
                className={buttonVariants({
                  className: "w-full justify-between",
                })}
              >
                Add employee
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/assistant"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full justify-between",
                })}
              >
                Open AI Assistant
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}