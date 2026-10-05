"use server";

import { redirect } from "next/navigation";

import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "@/lib/employees/data";

import {
  employeeInputSchema,
  employeeUpdateSchema,
  type EmployeeInput,
  type EmployeeUpdate,
} from "@/lib/employees/schema";

export type EmployeeActionState = {
  error?: string;
};

function getValidationError(
  result: ReturnType<typeof employeeInputSchema.safeParse>,
) {
  if (result.success) {
    return undefined;
  }

  const firstError = result.error.issues[0];

  return firstError
    ? `${firstError.path.join(".")}: ${firstError.message}`
    : "Please check the employee information.";
}

export async function createEmployeeAction(
  _previousState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const input: EmployeeInput = {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    job_title: String(formData.get("job_title") ?? ""),
    department: String(formData.get("department") ?? ""),
    employment_type: String(formData.get("employment_type") ?? ""),
    joining_date: String(formData.get("joining_date") ?? ""),
    status: "active",
    manager_name: String(formData.get("manager_name") ?? ""),
    work_location: String(formData.get("work_location") ?? ""),
  };

  const result = employeeInputSchema.safeParse(input);

  if (!result.success) {
    return {
      error: getValidationError(result),
    };
  }

  try {
    const employee = await createEmployee(result.data);

    redirect(`/employees/${employee.id}?success=created`);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create employee.",
    };
  }
}

export async function updateEmployeeAction(
  _previousState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Employee ID is missing." };
  }

  const input: EmployeeUpdate = {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    job_title: String(formData.get("job_title") ?? ""),
    department: String(formData.get("department") ?? ""),
    employment_type: String(formData.get("employment_type") ?? ""),
    joining_date: String(formData.get("joining_date") ?? ""),
    status:
      formData.get("status") === "inactive"
        ? "inactive"
        : "active",
    manager_name: String(formData.get("manager_name") ?? ""),
    work_location: String(formData.get("work_location") ?? ""),
  };

  const result = employeeUpdateSchema.safeParse(input);

  if (!result.success) {
    const firstError = result.error.issues[0];

    return {
      error: firstError
        ? `${firstError.path.join(".")}: ${firstError.message}`
        : "Please check the employee information.",
    };
  }

  try {
    await updateEmployee(id, result.data);

    redirect(`/employees/${id}?success=updated`);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update employee.",
    };
  }
}

export async function deactivateEmployeeAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Employee ID is missing.");
  }

  await deactivateEmployee(id);

  redirect(`/employees/${id}?success=deactivated`);
}