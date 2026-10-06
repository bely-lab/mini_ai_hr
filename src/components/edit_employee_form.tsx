"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CircleAlert } from "lucide-react";

import {
  updateEmployeeAction,
  type EmployeeActionState,
} from "@/app/employees/actions";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
} from "@/lib/employees/schema";
import type { Employee } from "@/types/employee";
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

  const [values, setValues] = useState({
    full_name: employee.full_name,
    email: employee.email,
    phone: employee.phone,
    job_title: employee.job_title,
    department: employee.department,
    employment_type: employee.employment_type,
    joining_date: employee.joining_date,
    manager_name: employee.manager_name,
    work_location: employee.work_location,
  });

  const errors = state.fieldErrors ?? {};
  const today = getToday();

  const hasChanges =
    values.full_name !== employee.full_name ||
    values.email !== employee.email ||
    values.phone !== employee.phone ||
    values.job_title !== employee.job_title ||
    values.department !== employee.department ||
    values.employment_type !== employee.employment_type ||
    values.joining_date !== employee.joining_date ||
    values.manager_name !== employee.manager_name ||
    values.work_location !== employee.work_location;

  function updateField(
    field: keyof typeof values,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

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
              Unable to save changes
            </p>
            <p className="mt-0.5 text-red-600">
              {state.error}
            </p>
          </div>
        </div>
      )}

      <input
        type="hidden"
        name="id"
        value={employee.id}
      />

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>

        <Input
          id="full_name"
          name="full_name"
          value={values.full_name}
          onChange={(event) =>
            updateField("full_name", event.target.value)
          }
          autoComplete="name"
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
          value={values.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={
            errors.email ? "email-error" : undefined
          }
          className={fieldClassName(!!errors.email)}
        />

        <FieldError
          id="email-error"
          message={errors.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={(event) =>
            updateField("phone", event.target.value)
          }
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={
            errors.phone ? "phone-error" : undefined
          }
          className={fieldClassName(!!errors.phone)}
        />

        <FieldError
          id="phone-error"
          message={errors.phone}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">Job title</Label>

        <Input
          id="job_title"
          name="job_title"
          value={values.job_title}
          onChange={(event) =>
            updateField("job_title", event.target.value)
          }
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
          value={values.department}
          onChange={(event) =>
            updateField("department", event.target.value)
          }
          className={`${selectClassName} ${fieldClassName(
            !!errors.department,
          )}`}
          aria-invalid={!!errors.department}
          aria-describedby={
            errors.department
              ? "department-error"
              : undefined
          }
        >
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
          value={values.employment_type}
          onChange={(event) =>
            updateField(
              "employment_type",
              event.target.value,
            )
          }
          className={`${selectClassName} ${fieldClassName(
            !!errors.employment_type,
          )}`}
          aria-invalid={!!errors.employment_type}
          aria-describedby={
            errors.employment_type
              ? "employment_type-error"
              : undefined
          }
        >
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
          value={values.joining_date}
          max={today}
          onChange={(event) =>
            updateField(
              "joining_date",
              event.target.value,
            )
          }
          aria-invalid={!!errors.joining_date}
          aria-describedby={
            errors.joining_date
              ? "joining_date-error"
              : undefined
          }
          className={fieldClassName(!!errors.joining_date)}
        />

        <FieldError
          id="joining_date-error"
          message={errors.joining_date}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager_name">Manager name</Label>

        <Input
          id="manager_name"
          name="manager_name"
          value={values.manager_name}
          onChange={(event) =>
            updateField("manager_name", event.target.value)
          }
          aria-invalid={!!errors.manager_name}
          aria-describedby={
            errors.manager_name
              ? "manager_name-error"
              : undefined
          }
          className={fieldClassName(!!errors.manager_name)}
        />

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
          value={values.work_location}
          onChange={(event) =>
            updateField(
              "work_location",
              event.target.value,
            )
          }
          aria-invalid={!!errors.work_location}
          aria-describedby={
            errors.work_location
              ? "work_location-error"
              : undefined
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
          href={`/employees/${employee.id}`}
          className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </Link>

        <Button
          type="submit"
          disabled={pending || !hasChanges}
        >
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}