"use client";

import { useActionState } from "react";

import {
  deactivateEmployeeAction,
  type EmployeeActionState,
} from "@/app/employees/actions";
import { Button } from "@/components/ui/button";

type DeactivateEmployeeButtonProps = {
  employeeId: string;
};

const initialState: EmployeeActionState = {};

export function DeactivateEmployeeButton({
  employeeId,
}: DeactivateEmployeeButtonProps) {
  const [state, formAction, pending] = useActionState(
    async (
      _previousState: EmployeeActionState,
      _formData: FormData,
    ): Promise<EmployeeActionState> => {
      return deactivateEmployeeAction(employeeId);
    },
    initialState,
  );

  return (
    <div className="space-y-2">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              "Are you sure you want to deactivate this employee?",
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <Button
          type="submit"
          variant="destructive"
          disabled={pending}
        >
          {pending ? "Deactivating..." : "Deactivate employee"}
        </Button>
      </form>

      {state.error && (
        <p
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {state.error}
        </p>
      )}
    </div>
  );
}