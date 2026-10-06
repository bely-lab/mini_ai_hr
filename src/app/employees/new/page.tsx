import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { EmployeeForm } from "@/components/employee_form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewEmployeePage() {
  return (
    <AppShell
      title="Add employee"
      description="Create a new employee record with their contact and employment information."
    >
      <div className="space-y-6">
        <div>
          <Link
            href="/employees"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            <ArrowLeft className="size-4" />
            Back to employees
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <EmployeeForm />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}