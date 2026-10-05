import Link from "next/link";
import { Plus } from "lucide-react";

import { getEmployees } from "@/lib/employees/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Employees
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage employee records and their current status.
            </p>
          </div>

 <Button>
  <Link href="/employees/new" className="flex items-center gap-2">
    <Plus />
    Add employee
  </Link>
</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Employee directory
            </CardTitle>
          </CardHeader>

          <CardContent>
            {employees.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-medium">No employees yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first employee to get started.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Employment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Link
                          href={`/employees/${employee.id}`}
                          className="font-medium hover:underline"
                        >
                          {employee.full_name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {employee.email}
                        </p>
                      </TableCell>

                      <TableCell>{employee.job_title}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.employment_type}</TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}