"use client";

import { useActionState } from "react";

import { createEmployeeAction, type EmployeeActionState } from "@/app/employees/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: EmployeeActionState = {};

export function EmployeeForm() {
  const [state, formAction, pending] = useActionState(
    createEmployeeAction,
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

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" autoComplete="tel" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">Job title</Label>
        <Input id="job_title" name="job_title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input id="department" name="department" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employment_type">Employment type</Label>
        <Input
          id="employment_type"
          name="employment_type"
          placeholder="Full-time"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="joining_date">Joining date</Label>
        <Input
          id="joining_date"
          name="joining_date"
          type="date"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager_name">Manager name</Label>
        <Input id="manager_name" name="manager_name" required />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="work_location">Work location</Label>
        <Input id="work_location" name="work_location" required />
      </div>

      <input type="hidden" name="status" value="active" />

      <div className="flex justify-end gap-3 md:col-span-2">
        <Button variant="outline" type="button" disabled={pending}>
          Cancel
        </Button>

        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create employee"}
        </Button>
      </div>
    </form>
  );
}