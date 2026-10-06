import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { DeactivateEmployeeButton } from "@/components/deactivate-employee-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEmployee } from "@/lib/employees/data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
};

const successMessages: Record<string, string> = {
  created: "Employee created successfully.",
  updated: "Employee information updated successfully.",
  deactivated: "Employee deactivated successfully.",
};

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function EmployeeProfilePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { success } = await searchParams;

  const employee = await getEmployee(id);

  if (!employee) {
    notFound();
  }

  const successMessage = success
    ? successMessages[success]
    : undefined;

  return (
    <AppShell title="Employee profile">
      <div className="space-y-6">
        {successMessage && (
          <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
          >
            {successMessage}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href="/employees"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
              aria-label="Back to employees"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {employee.full_name}
                </h1>

                <Badge
                  variant={
                    employee.status === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {employee.status}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {employee.job_title} · {employee.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link
              href={`/employees/${employee.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              Edit employee
            </Link>

            {employee.status === "active" && (
              <DeactivateEmployeeButton
                employeeId={employee.id}
              />
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader>
              <CardTitle>Employee information</CardTitle>
              <p className="text-sm text-muted-foreground">
                
              </p>
            </CardHeader>

            <CardContent className="grid gap-6 sm:grid-cols-2">
              <Detail
                icon={Mail}
                label="Email"
                value={employee.email}
              />

              <Detail
                icon={Phone}
                label="Phone"
                value={employee.phone}
              />

              <Detail
                icon={BriefcaseBusiness}
                label="Job title"
                value={employee.job_title}
              />

              <Detail
                icon={BriefcaseBusiness}
                label="Department"
                value={employee.department}
              />

              <Detail
                icon={UserRound}
                label="Manager"
                value={employee.manager_name}
              />

              <Detail
                icon={BriefcaseBusiness}
                label="Employment type"
                value={employee.employment_type}
              />

              <Detail
                icon={CalendarDays}
                label="Joining date"
                value={employee.joining_date}
              />

              <Detail
                icon={MapPin}
                label="Work location"
                value={employee.work_location}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generated from the employee record.
                </p>
              </CardHeader>

              <CardContent>
                {employee.summary ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {employee.summary}
                  </p>
                ) : (
                  <div className="rounded-lg border border-dashed p-5 text-center">
                    <p className="text-sm font-medium">
                      No summary yet
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Use the AI Assistant to generate a summary
                      from this employee&apos;s stored information.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Record details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="size-4 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Added
                    </p>
                    <p className="text-sm font-medium">
                      {formatDateTime(employee.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="size-4 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last updated
                    </p>
                    <p className="text-sm font-medium">
                      {formatDateTime(employee.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}