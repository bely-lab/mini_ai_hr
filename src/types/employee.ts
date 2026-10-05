export type EmployeeStatus = "active" | "inactive";

export type Employee = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  department: string;
  employment_type: string;
  joining_date: string;
  status: EmployeeStatus;
  manager_name: string;
  work_location: string;
  summary: string | null;
  summary_generated_at: string | null;
  created_at: string;
  updated_at: string;
};