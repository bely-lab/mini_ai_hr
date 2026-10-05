create table public.employees (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  email text not null,
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
    check (status in ('active', 'inactive')),

  constraint employees_email_check
    check (
      email = lower(btrim(email))
      and btrim(email) <> ''
    ),

  constraint employees_email_unique
    unique (email),

  constraint employees_summary_check
    check (
      (summary is null and summary_generated_at is null)
      or
      (summary is not null and summary_generated_at is not null)
    )
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

grant usage on schema public to authenticated;

grant select, insert, update
on table public.employees
to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists employees_set_updated_at
on public.employees;

create trigger employees_set_updated_at
before update on public.employees
for each row
execute function public.set_updated_at();