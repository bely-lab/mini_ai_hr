import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { EditEmployeeForm } from "@/components/edit_employee_form";
import { getEmployee } from "@/lib/employees/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type EditEmployeePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEmployeePage({
  params,
}: EditEmployeePageProps) {
  const { id } = await params;
  const employee = await getEmployee(id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Link
            href={`/employees/${employee.id}`}
            className="flex h-full w-full items-center justify-center"
          >
            <ArrowLeft />
            <span className="sr-only">Back to employee</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit employee
          </h1>
          <p className="text-muted-foreground">
            Update the information for {employee.full_name}.
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Employee information</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <EditEmployeeForm employee={employee} />
        </CardContent>
      </Card>
    </div>
  );
}