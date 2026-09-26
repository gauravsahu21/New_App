"use client";

import { useActionState } from "react";
import { addUser } from "./actions";

const initialState = { success: false, message: "" };

export function AddUserForm({ disabled = false }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(addUser, initialState);

  return (
    <form action={formAction} className="admin-form">
      <div className="field-group">
        <label htmlFor="new-user-email">Email address</label>
        <input
          autoComplete="off"
          autoCapitalize="none"
          disabled={disabled || pending}
          id="new-user-email"
          inputMode="email"
          name="email"
          placeholder="person@example.com"
          required
          type="email"
        />
      </div>
      <div className="field-group">
        <label htmlFor="new-user-password">Set password</label>
        <input
          autoComplete="new-password"
          disabled={disabled || pending}
          id="new-user-password"
          minLength={8}
          name="password"
          placeholder="At least 8 characters"
          required
          type="password"
        />
      </div>
      <div className="field-group">
        <label htmlFor="confirm-user-password">Confirm password</label>
        <input
          autoComplete="new-password"
          disabled={disabled || pending}
          id="confirm-user-password"
          minLength={8}
          name="confirmPassword"
          placeholder="Re-enter the password"
          required
          type="password"
        />
      </div>
      <button className="submit-button" disabled={disabled || pending} type="submit">
        <span>{pending ? "Adding user..." : "Add user"}</span>
        <span aria-hidden="true" className="submit-arrow">→</span>
      </button>
      <p
        aria-live="polite"
        className="admin-feedback"
        data-success={state.success}
        role="status"
      >
        {state.message}
      </p>
    </form>
  );
}