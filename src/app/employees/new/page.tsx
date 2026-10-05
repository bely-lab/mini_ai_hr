import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EmployeeForm } from "@/components/employee_form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
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
            Add employee
          </h1>
          <p className="text-muted-foreground">
            Add a new employee to the HR system.
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Employee information</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  );
}