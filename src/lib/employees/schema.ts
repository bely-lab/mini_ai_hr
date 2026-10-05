import { z } from "zod";

export const employeeInputSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(3).max(30),
  job_title: z.string().trim().min(1).max(120),
  department: z.string().trim().min(1).max(100),
  employment_type: z.string().trim().min(1).max(50),
  joining_date: z.iso.date(),
  status: z.enum(["active", "inactive"]),
  manager_name: z.string().trim().min(1).max(120),
  work_location: z.string().trim().min(1).max(120),
});

export const employeeUpdateSchema = employeeInputSchema.partial();

export type EmployeeInput = z.infer<typeof employeeInputSchema>;
export type EmployeeUpdate = z.infer<typeof employeeUpdateSchema>;