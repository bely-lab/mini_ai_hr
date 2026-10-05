"use server";

import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "@/lib/employees/data";

import type {
  EmployeeInput,
  EmployeeUpdate,
} from "@/lib/employees/schema";

export async function createEmployeeAction(input: EmployeeInput) {
  return createEmployee(input);
}

export async function updateEmployeeAction(
  id: string,
  updates: EmployeeUpdate,
) {
  return updateEmployee(id, updates);
}

export async function deactivateEmployeeAction(id: string) {
  return deactivateEmployee(id);
}