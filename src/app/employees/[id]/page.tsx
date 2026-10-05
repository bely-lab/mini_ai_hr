import Link from "next/link";
import { Bot, UserCheck, Users, UserX } from "lucide-react";

import { getEmployees } from "@/lib/employees/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const employees = await getEmployees();

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "inactive",
  );

  const recentEmployees = employees.slice(0, 5);

  const stats = [
    {
      title: "Total employees",
      value: employees.length,
      icon: Users,
    },
    {
      title: "Active",
      value: activeEmployees.length,
      icon: UserCheck,
    },
    {
      title: "Inactive",
      value: inactiveEmployees.length,
      icon: UserX,
    },
  ];

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your employee records and HR tasks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Recent employees</CardTitle>
          </CardHeader>

          <CardContent>
            {recentEmployees.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No employees have been added yet.
              </p>
            ) : (
              <div className="divide-y">
                {recentEmployees.map((employee) => (
                  <Link
                    key={employee.id}
                    href={`/employees/${employee.id}`}
                    className="flex items-center justify-between gap-4 rounded-md py-4 first:pt-0 last:pb-0 hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-medium">
                        {employee.full_name}
                      </p>

                      <p className="text-sm text-muted-foreground">
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
            <Link href="/assistant" className="block">
              <Button className="w-full">
                <Bot className="mr-2 size-4" />
                Open AI Assistant
              </Button>
            </Link>

            <Link href="/employees" className="block">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 size-4" />
                View employees
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}