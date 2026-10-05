import { createClient } from "@/lib/supabase/server";
import {
  employeeInputSchema,
  employeeUpdateSchema,
  type EmployeeInput,
  type EmployeeUpdate,
} from "@/lib/employees/schema";
import type { Employee } from "@/types/employee";

export async function getEmployees(): Promise<Employee[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }

  return data as Employee[];
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch employee: ${error.message}`);
  }

  return data as Employee | null;
}

export async function createEmployee(
  input: EmployeeInput,
): Promise<Employee> {
  const validatedInput = employeeInputSchema.parse(input);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .insert(validatedInput)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("An employee with this email already exists.");
    }

    throw new Error(`Failed to create employee: ${error.message}`);
  }

  return data as Employee;
}

export async function updateEmployee(
  id: string,
  updates: EmployeeUpdate,
): Promise<Employee> {
  const validatedUpdates = employeeUpdateSchema.parse(updates);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .update(validatedUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("An employee with this email already exists.");
    }

    throw new Error(`Failed to update employee: ${error.message}`);
  }

  return data as Employee;
}

export async function deactivateEmployee(id: string): Promise<Employee> {
  return updateEmployee(id, { status: "inactive" });
}

export async function saveEmployeeSummary(
  id: string,
  summary: string,
): Promise<Employee> {
  const cleanedSummary = summary.trim();

  if (!cleanedSummary) {
    throw new Error("Employee summary cannot be empty.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .update({
      summary: cleanedSummary,
      summary_generated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save employee summary: ${error.message}`);
  }

  return data as Employee;
}