"use client";

import { useTransition } from "react";

import { deactivateEmployeeAction } from "@/app/employees/actions";
import { Button } from "@/components/ui/button";

type DeactivateEmployeeButtonProps = {
  employeeId: string;
};

export function DeactivateEmployeeButton({
  employeeId,
}: DeactivateEmployeeButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleDeactivate() {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this employee?",
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.set("id", employeeId);

    startTransition(async () => {
      await deactivateEmployeeAction(formData);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={handleDeactivate}
    >
      {pending ? "Deactivating..." : "Deactivate"}
    </Button>
  );
}