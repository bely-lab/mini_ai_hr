import { parsePhoneNumberFromString } from "libphonenumber-js";
import validator from "validator";
import { z } from "zod";

export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "Product",
  "Design",
  "Research",
  "Other",
] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
  "Temporary",
] as const;

export const EMPLOYEE_STATUSES = ["active", "inactive"] as const;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .refine(
    (value) => validator.isEmail(value),
    "Please enter a valid email address.",
  )
  .transform((value) => value.toLowerCase());

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Phone number is required.")
  .max(30, "Phone number is too long.")
  .refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value, "FI");

      return phoneNumber?.isValid() ?? false;
    },
    "Please enter a valid phone number.",
  );

const joiningDateSchema = z
  .iso.date("Please enter a valid joining date.")
  .refine(
    (value) => value <= new Date().toISOString().slice(0, 10),
    "Joining date cannot be in the future.",
  );

const personNameSchema = z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters.")
  .max(120, "Name is too long.")
  .regex(
    /^[\p{L}][\p{L}' .-]*$/u,
    "Name can only contain letters, spaces, apostrophes, dots, and hyphens.",
  );

export const employeeInputSchema = z.object({
  full_name: personNameSchema,

  email: emailSchema,

  phone: phoneSchema,

  job_title: z
    .string()
    .trim()
    .min(2, "Job title must contain at least 2 characters.")
    .max(120, "Job title is too long."),

  department: z.enum(DEPARTMENTS),

  employment_type: z.enum(EMPLOYMENT_TYPES),

  joining_date: joiningDateSchema,

  status: z.enum(EMPLOYEE_STATUSES),

  manager_name: personNameSchema,

  work_location: z
    .string()
    .trim()
    .min(2, "Work location must contain at least 2 characters.")
    .max(120, "Work location is too long."),
});

export const employeeUpdateSchema = employeeInputSchema.partial();

export type EmployeeInput = z.infer<typeof employeeInputSchema>;
export type EmployeeUpdate = z.infer<typeof employeeUpdateSchema>;