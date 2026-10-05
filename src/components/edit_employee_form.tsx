"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  updateEmployeeAction,
  type EmployeeActionState,
} from "@/app/employees/actions";
import type { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: EmployeeActionState = {};

type EditEmployeeFormProps = {
  employee: Employee;
};

export function EditEmployeeForm({
  employee,
}: EditEmployeeFormProps) {
  const [state, formAction, pending] = useActionState(
    updateEmployeeAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-6 md:grid-cols-2">
      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive md:col-span-2"
        >
          {state.error}
        </div>
      )}

      <input type="hidden" name="id" value={employee.id} />

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={employee.full_name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={employee.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={employee.phone}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">Job title</Label>
        <Input
          id="job_title"
          name="job_title"
          defaultValue={employee.job_title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          name="department"
          defaultValue={employee.department}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employment_type">Employment type</Label>
        <Input
          id="employment_type"
          name="employment_type"
          defaultValue={employee.employment_type}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="joining_date">Joining date</Label>
        <Input
          id="joining_date"
          name="joining_date"
          type="date"
          defaultValue={employee.joining_date}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager_name">Manager name</Label>
        <Input
          id="manager_name"
          name="manager_name"
          defaultValue={employee.manager_name}
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="work_location">Work location</Label>
        <Input
          id="work_location"
          name="work_location"
          defaultValue={employee.work_location}
          required
        />
      </div>

      <input
        type="hidden"
        name="status"
        value={employee.status}
      />

      <div className="flex justify-end gap-3 md:col-span-2">
        <Link
          href={`/employees/${employee.id}`}
          className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </Link>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}