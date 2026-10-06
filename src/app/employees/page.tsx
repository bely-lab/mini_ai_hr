import { AppShell } from "@/components/app-shell";
import { getEmployees } from "@/lib/employees/data";
import { EmployeesDirectory } from "@/./components/employees-directory";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <AppShell
      title="Employees"
      description=" " 
    >
      <EmployeesDirectory employees={employees} />
    </AppShell>
  );
}