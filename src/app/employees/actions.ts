"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createEmployee,
  deactivateEmployee,
  updateEmployee,
} from "@/lib/employees/data";
import {
  employeeInputSchema,
  employeeUpdateSchema,
} from "@/lib/employees/schema";

export type EmployeeActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const formSchema = z.object({
  full_name: z.string(),
  email: z.string(),
  phone: z.string(),
  job_title: z.string(),
  department: z.string(),
  employment_type: z.string(),
  joining_date: z.string(),
  status: z.string().optional(),
  manager_name: z.string(),
  work_location: z.string(),
});

function getFormValues(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    job_title: String(formData.get("job_title") ?? ""),
    department: String(formData.get("department") ?? ""),
    employment_type: String(formData.get("employment_type") ?? ""),
    joining_date: String(formData.get("joining_date") ?? ""),
    status: String(formData.get("status") ?? ""),
    manager_name: String(formData.get("manager_name") ?? ""),
    work_location: String(formData.get("work_location") ?? ""),
  };
}

function getFieldErrors(
  issues: z.ZodIssue[],
): Record<string, string> {
  return issues.reduce<Record<string, string>>((errors, issue) => {
    const field = issue.path[0];

    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
}

export async function createEmployeeAction(
  _previousState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const rawValues = getFormValues(formData);

  const formResult = formSchema.safeParse(rawValues);

  if (!formResult.success) {
    return {
      error: "Please correct the highlighted fields.",
    };
  }

  const result = employeeInputSchema.safeParse({
    ...formResult.data,
    status: "active",
  });

  if (!result.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: getFieldErrors(result.error.issues),
    };
  }

  let employee;

  try {
    employee = await createEmployee(result.data);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create employee.",
    };
  }

  redirect(`/employees/${employee.id}?success=created`);
}

export async function updateEmployeeAction(
  _previousState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Employee ID is missing." };
  }

  const rawValues = getFormValues(formData);

  const formResult = formSchema.safeParse(rawValues);

  if (!formResult.success) {
    return {
      error: "Please correct the highlighted fields.",
    };
  }

  const { status: _status, ...editableValues } = formResult.data;

  const result = employeeUpdateSchema.safeParse(editableValues);

  if (!result.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: getFieldErrors(result.error.issues),
    };
  }

  try {
    await updateEmployee(id, result.data);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update employee.",
    };
  }

  redirect(`/employees/${id}?success=updated`);
}

export async function deactivateEmployeeAction(
  id: string,
): Promise<EmployeeActionState> {
  if (!id) {
    return { error: "Employee ID is missing." };
  }

  try {
    await deactivateEmployee(id);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to deactivate employee.",
    };
  }

  redirect(`/employees/${id}?success=deactivated`);
}