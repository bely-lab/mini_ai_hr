import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Link href="/employees" className="flex items-center justify-center">
            <ArrowLeft />
            <span className="sr-only">Back to employees</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add employee
          </h1>
          <p className="text-muted-foreground">
            Add a new employee to the HR system.
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Employee information</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <form className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job title</Label>
              <Input id="job_title" name="job_title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment type</Label>
              <Input
                id="employment_type"
                name="employment_type"
                placeholder="Full-time"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining date</Label>
              <Input
                id="joining_date"
                name="joining_date"
                type="date"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager_name">Manager name</Label>
              <Input id="manager_name" name="manager_name" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="work_location">Work location</Label>
              <Input id="work_location" name="work_location" required />
            </div>

            <div className="flex justify-end gap-3 md:col-span-2">
              <Button variant="outline">
                <Link href="/employees">Cancel</Link>
              </Button>

              <Button type="submit">Create employee</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}