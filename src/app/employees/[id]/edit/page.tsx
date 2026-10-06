import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { EditEmployeeForm } from "@/components/edit_employee_form";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { getEmployee } from "@/lib/employees/data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditEmployeePage({
  params,
}: Props) {
  const { id } = await params;

  const employee = await getEmployee(id);

  if (!employee) {
    notFound();
  }

  return (
    <AppShell
      title="Edit employee"
      description={`Update the employee record for ${employee.full_name}.`}
    >
      <div className="space-y-6">
        <div>
          <Link
            href={`/employees/${employee.id}`}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            <ArrowLeft className="size-4" />
            Back to employee
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <EditEmployeeForm employee={employee} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}