"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { Employee } from "@/types/employee";

type EmployeesDirectoryProps = {
  employees: Employee[];
};

type StatusFilter = "all" | "active" | "inactive";

export function EmployeesDirectory({
  employees,
}: EmployeesDirectoryProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const searchableFields = [
        employee.full_name,
        employee.email,
        employee.job_title,
        employee.department,
        employee.manager_name,
        employee.work_location,
      ];

      const matchesSearch =
        !query ||
        searchableFields.some((field) =>
          field.toLowerCase().includes(query),
        );

      const matchesStatus =
        status === "all" || employee.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, status]);

  const hasFilters = search.trim() !== "" || status !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? `${filteredEmployees.length} of ${employees.length} ${
                  employees.length === 1
                    ? "employee"
                    : "employees"
                } shown.`
              : employees.length === 1
                ? "1 employee in your workspace."
                : `${employees.length} employees in your workspace.`}
          </p>
        </div>

        <Link href="/employees/new">
          <Button>
            <Plus className="size-4" />
            Add employee
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All employees</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Search and filter employee records.
              </p>
            </div>

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-fit"
              >
                <X className="size-4" />
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <label htmlFor="employee-search" className="sr-only">
                Search employees
              </label>

              <Input
                id="employee-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, job title, department, manager, or location..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />

              <label htmlFor="employee-status-filter" className="sr-only">
                Filter employees by status
              </label>

              <select
                id="employee-status-filter"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as StatusFilter)
                }
                className="h-9 w-40 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Users className="size-6 text-muted-foreground" />
              </div>

              <p className="font-medium">
                {employees.length === 0
                  ? "No employees yet"
                  : "No employees found"}
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {employees.length === 0
                  ? "Add your first employee to start building your directory."
                  : "No employees match your current search or status filter."}
              </p>

              {employees.length > 0 && hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              )}

              {employees.length === 0 && (
                <Link href="/employees/new" className="mt-4">
                  <Button size="sm">
                    <Plus className="size-4" />
                    Add employee
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Employee directory
                </caption>

                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Employee
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Job title
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Department
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Employment
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/employees/${employee.id}`}
                          className="group block min-w-48"
                        >
                          <p className="font-medium group-hover:underline">
                            {employee.full_name}
                          </p>

                          <p className="mt-1 text-muted-foreground">
                            {employee.email}
                          </p>
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <span className="whitespace-nowrap">
                          {employee.job_title}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="whitespace-nowrap">
                          {employee.department}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="whitespace-nowrap">
                          {employee.employment_type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/employees/${employee.id}`}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}