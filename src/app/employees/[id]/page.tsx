import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { DeactivateEmployeeButton } from "@/components/deactivate-employee-button";
import { getEmployee } from "@/lib/employees/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type EmployeePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EmployeePage({
  params,
}: EmployeePageProps) {
  const { id } = await params;
  const employee = await getEmployee(id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Link
              href="/employees"
              className="flex h-full w-full items-center justify-center"
            >
              <ArrowLeft />
              <span className="sr-only">Back to employees</span>
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {employee.full_name}
            </h1>
            <p className="text-muted-foreground">
              {employee.job_title}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Link
              href={`/employees/${employee.id}/edit`}
              className="flex items-center gap-2"
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>

          {employee.status === "active" && (
            <DeactivateEmployeeButton employeeId={employee.id} />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Employee information</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <Info label="Full name" value={employee.full_name} />
            <Info label="Email" value={employee.email} />
            <Info label="Phone" value={employee.phone} />
            <Info label="Job title" value={employee.job_title} />
            <Info label="Department" value={employee.department} />
            <Info
              label="Employment type"
              value={employee.employment_type}
            />
            <Info label="Joining date" value={employee.joining_date} />
            <Info label="Manager" value={employee.manager_name} />
            <Info
              label="Work location"
              value={employee.work_location}
            />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI summary</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {employee.summary ? (
              <div className="space-y-3">
                <p className="text-sm leading-6">{employee.summary}</p>

                {employee.summary_generated_at && (
                  <p className="text-xs text-muted-foreground">
                    Generated{" "}
                    {new Date(
                      employee.summary_generated_at,
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No AI summary has been generated yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}