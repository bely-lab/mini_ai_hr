import { z } from "zod";

import {
  createEmployee,
  deactivateEmployee,
  getEmployee,
  getEmployees,
  saveEmployeeSummary,
  updateEmployee,
} from "@/lib/employees/data";
import {
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  employeeInputSchema,
} from "@/lib/employees/schema";

const employeeIdSchema = z.object({
  employee_id: z.string().uuid(),
});

const employeeLookupSchema = z.object({
  employee_id: z.string().uuid().optional(),
  email: z.string().trim().email().optional(),
  full_name: z.string().trim().min(1).max(120).optional(),
});

const employeeAiInputSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(30),
  job_title: z.string().trim().min(2).max(120),
  department: z.enum(DEPARTMENTS),
  employment_type: z.enum(EMPLOYMENT_TYPES),
  joining_date: z.iso.date(),
  status: z.enum(EMPLOYEE_STATUSES),
  manager_name: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .optional(),
  work_location: z.string().trim().min(2).max(120),
});

const employeeAiUpdateSchema = employeeAiInputSchema
  .omit({ status: true })
  .partial();

export const employeeTools = {
  list_employees: {
    description:
      "List employee records. Optionally filter by active or inactive status.",
    parameters: z.object({
      status: z.enum(["active", "inactive"]).optional(),
    }),
    execute: async ({
      status,
    }: {
      status?: "active" | "inactive";
    }) => {
      const employees = await getEmployees();

      const filtered = status
        ? employees.filter(
            (employee) => employee.status === status,
          )
        : employees;

      return filtered.map((employee) => ({
        id: employee.id,
        full_name: employee.full_name,
        email: employee.email,
        job_title: employee.job_title,
        department: employee.department,
        employment_type: employee.employment_type,
        joining_date: employee.joining_date,
        status: employee.status,
        manager_name: employee.manager_name,
        work_location: employee.work_location,
      }));
    },
  },

  get_employee: {
    description:
      "Find one employee using their employee ID, email, or full name. If a full name matches multiple employees, do not choose one; ask the user to clarify.",
    parameters: employeeLookupSchema,
    execute: async ({
      employee_id,
      email,
      full_name,
    }: {
      employee_id?: string;
      email?: string;
      full_name?: string;
    }) => {
      const identifiers = [
        employee_id,
        email,
        full_name,
      ].filter(Boolean);

      if (identifiers.length === 0) {
        return {
          found: false,
          message: "An employee identifier is required.",
        };
      }

      if (employee_id) {
        const employee = await getEmployee(employee_id);

        if (!employee) {
          return {
            found: false,
            message: "Employee not found.",
          };
        }

        return {
          found: true,
          employee,
        };
      }

      const employees = await getEmployees();

      if (email) {
        const normalizedEmail = email.trim().toLowerCase();

        const matches = employees.filter(
          (employee) =>
            employee.email.toLowerCase() === normalizedEmail,
        );

        if (matches.length === 0) {
          return {
            found: false,
            message: "Employee not found.",
          };
        }

        return {
          found: true,
          employee: matches[0],
        };
      }

      if (full_name) {
        const normalizedName = full_name.trim().toLowerCase();

        const matches = employees.filter(
          (employee) =>
            employee.full_name.trim().toLowerCase() ===
            normalizedName,
        );

        if (matches.length === 0) {
          return {
            found: false,
            message: "Employee not found.",
          };
        }

        if (matches.length > 1) {
          return {
            found: false,
            ambiguous: true,
            employees: matches.map((employee) => ({
              id: employee.id,
              full_name: employee.full_name,
              email: employee.email,
              department: employee.department,
            })),
            message:
              "Multiple employees have this name. Ask the user to identify the employee by email or another identifier.",
          };
        }

        return {
          found: true,
          employee: matches[0],
        };
      }

      return {
        found: false,
        message: "Employee not found.",
      };
    },
  },

  create_employee: {
    description:
      "Create a new employee. All required employee information must be provided before calling this tool. The manager is optional. The joining date must not be in the future.",
    parameters: employeeAiInputSchema,
    execute: async (
      input: z.infer<typeof employeeAiInputSchema>,
    ) => {
      const validatedInput = employeeInputSchema.parse(input);
      const employee = await createEmployee(validatedInput);

      return {
        success: true,
        employee,
      };
    },
  },

  update_employee: {
    description:
      "Update an existing employee. The employee must first be identified unambiguously. Employee status is not changed through this tool; use deactivate_employee for deactivation.",
    parameters: employeeLookupSchema.extend({
      updates: employeeAiUpdateSchema,
    }),
    execute: async ({
      employee_id,
      email,
      full_name,
      updates,
    }: {
      employee_id?: string;
      email?: string;
      full_name?: string;
      updates: Partial<z.infer<typeof employeeAiInputSchema>>;
    }) => {
      const lookup = await employeeTools.get_employee.execute({
        employee_id,
        email,
        full_name,
      });

      if (!lookup.found || !lookup.employee) {
        return lookup;
      }

      const employee = await updateEmployee(
        lookup.employee.id,
        updates,
      );

      return {
        success: true,
        employee,
      };
    },
  },

  deactivate_employee: {
    description:
      "Deactivate an existing active employee. The employee must first be identified unambiguously. If the employee is already inactive, report that instead of treating it as a new deactivation.",
    parameters: employeeLookupSchema,
    execute: async ({
      employee_id,
      email,
      full_name,
    }: {
      employee_id?: string;
      email?: string;
      full_name?: string;
    }) => {
      const lookup = await employeeTools.get_employee.execute({
        employee_id,
        email,
        full_name,
      });

      if (!lookup.found || !lookup.employee) {
        return lookup;
      }

      const employee = await deactivateEmployee(
        lookup.employee.id,
      );

      return {
        success: true,
        employee,
      };
    },
  },

generate_employee_summary: {
  description:
    "Retrieve an employee's stored information so the assistant can generate a concise factual HR summary. The summary must be based only on the employee record. Do not invent achievements, skills, responsibilities, or other information.",
  parameters: employeeIdSchema,
  execute: async ({
    employee_id,
  }: {
    employee_id: string;
  }) => {
    const employee = await getEmployee(employee_id);

    if (!employee) {
      return {
        success: false,
        message: "Employee not found.",
      };
    }

    return {
      success: true,
      employee,
      needs_generation: true,
    };
  },
},

  save_employee_summary: {
    description:
      "Save a generated employee summary for an existing employee. The summary must be based only on the employee's stored information.",
    parameters: z.object({
      employee_id: z.string().uuid(),
      summary: z.string().trim().min(1).max(2000),
    }),
    execute: async ({
      employee_id,
      summary,
    }: {
      employee_id: string;
      summary: string;
    }) => {
      const employee = await saveEmployeeSummary(
        employee_id,
        summary,
      );

      return {
        success: true,
        employee,
      };
    },
  },
};