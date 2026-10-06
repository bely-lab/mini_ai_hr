"use client";

import Link from "next/link";
import { useEffect, useState, useActionState } from "react";
import { CircleAlert } from "lucide-react";

import {
  createEmployeeAction,
  type EmployeeActionState,
} from "@/app/employees/actions";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
} from "@/lib/employees/schema";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: EmployeeActionState = {};

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50";

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      className="flex items-center gap-1.5 text-xs font-medium text-red-600"
    >
      <CircleAlert className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}

function fieldClassName(hasError: boolean) {
  return hasError
    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
    : "";
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

type Manager = {
  id: string;
  full_name: string;
};

export function EmployeeForm() {
  const [state, formAction, pending] = useActionState(
    createEmployeeAction,
    initialState,
  );

  const [managers, setManagers] = useState<Manager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  const errors = state.fieldErrors ?? {};
  const today = getToday();

  useEffect(() => {
    async function loadManagers() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("employees")
        .select("id, full_name")
        .eq("status", "active")
        .order("full_name", { ascending: true });

      if (!error && data) {
        setManagers(data);
      }

      setLoadingManagers(false);
    }

    loadManagers();
  }, []);

  return (
    <form
      action={formAction}
      noValidate
      className="grid gap-6 md:grid-cols-2"
    >
      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />

          <div>
            <p className="font-semibold">
              Unable to create employee
            </p>
            <p className="mt-0.5 text-red-600">
              {state.error}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>

        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          placeholder="e.g. Jane Smith"
          aria-invalid={!!errors.full_name}
          aria-describedby={
            errors.full_name ? "full_name-error" : undefined
          }
          className={fieldClassName(!!errors.full_name)}
        />

        <FieldError
          id="full_name-error"
          message={errors.full_name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="jane.smith@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClassName(!!errors.email)}
        />

        <FieldError id="email-error" message={errors.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+358 40 123 4567"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={fieldClassName(!!errors.phone)}
        />

        <FieldError id="phone-error" message={errors.phone} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">Job title</Label>

        <Input
          id="job_title"
          name="job_title"
          placeholder="e.g. Software Engineer"
          aria-invalid={!!errors.job_title}
          aria-describedby={
            errors.job_title ? "job_title-error" : undefined
          }
          className={fieldClassName(!!errors.job_title)}
        />

        <FieldError
          id="job_title-error"
          message={errors.job_title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>

        <select
          id="department"
          name="department"
          className={`${selectClassName} ${fieldClassName(
            !!errors.department,
          )}`}
          defaultValue=""
          aria-invalid={!!errors.department}
          aria-describedby={
            errors.department ? "department-error" : undefined
          }
        >
          <option value="" disabled>
            Select department
          </option>

          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <FieldError
          id="department-error"
          message={errors.department}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employment_type">
          Employment type
        </Label>

        <select
          id="employment_type"
          name="employment_type"
          className={`${selectClassName} ${fieldClassName(
            !!errors.employment_type,
          )}`}
          defaultValue=""
          aria-invalid={!!errors.employment_type}
          aria-describedby={
            errors.employment_type
              ? "employment_type-error"
              : undefined
          }
        >
          <option value="" disabled>
            Select employment type
          </option>

          {EMPLOYMENT_TYPES.map((employmentType) => (
            <option key={employmentType} value={employmentType}>
              {employmentType}
            </option>
          ))}
        </select>

        <FieldError
          id="employment_type-error"
          message={errors.employment_type}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="joining_date">Joining date</Label>

        <Input
          id="joining_date"
          name="joining_date"
          type="date"
          max={today}
          aria-invalid={!!errors.joining_date}
          aria-describedby={
            errors.joining_date ? "joining_date-error" : undefined
          }
          className={fieldClassName(!!errors.joining_date)}
        />

        <FieldError
          id="joining_date-error"
          message={errors.joining_date}
        />
      </div>

      <div className="space-y-2">
  <Label htmlFor="manager_name">Manager</Label>

  <select
  id="manager_name"
  name="manager_name"
  className={`${selectClassName} ${fieldClassName(
    !!errors.manager_name,
  )}`}
  defaultValue=""
  disabled={loadingManagers}
  aria-invalid={!!errors.manager_name}
  aria-describedby={
    errors.manager_name ? "manager_name-error" : undefined
  }
>
  <option value="">No manager</option>

  {managers.map((manager) => (
    <option key={manager.id} value={manager.full_name}>
      {manager.full_name}
    </option>
  ))}
</select>

  <FieldError
    id="manager_name-error"
    message={errors.manager_name}
  />
</div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="work_location">Work location</Label>

        <Input
          id="work_location"
          name="work_location"
          placeholder="e.g. Helsinki, Finland"
          aria-invalid={!!errors.work_location}
          aria-describedby={
            errors.work_location ? "work_location-error" : undefined
          }
          className={fieldClassName(!!errors.work_location)}
        />

        <FieldError
          id="work_location-error"
          message={errors.work_location}
        />
      </div>

      <div className="flex justify-end gap-3 md:col-span-2">
        <Link
          href="/employees"
          className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </Link>

        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create employee"}
        </Button>
      </div>
    </form>
  );
}