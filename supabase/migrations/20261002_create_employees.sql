create table public.employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  job_title text not null,
  department text not null,
  employment_type text not null,
  joining_date date not null,
  status text not null default 'active',
  manager_name text not null,
  work_location text not null,
  summary text,
  summary_generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint employees_status_check
    check (status in ('active', 'inactive'))
);

alter table public.employees enable row level security;

create policy "Authenticated users can view employees"
  on public.employees
  for select
  to authenticated
  using (true);

create policy "Authenticated users can create employees"
  on public.employees
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update employees"
  on public.employees
  for update
  to authenticated
  using (true)
  with check (true);