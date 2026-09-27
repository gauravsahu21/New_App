"use client";

import { useActionState } from "react";
import { updateUser } from "./actions";

const initialState = { success: false, message: "" };

export function EditUserForm({
  userId,
  name,
  email,
  phoneNumber,
  village,
}: {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  village: string;
}) {
  const [state, formAction, pending] = useActionState(updateUser, initialState);

  return (
    <form action={formAction} className="user-edit-form" onSubmit={(event) => {
      if (!window.confirm(`Save these changes to ${name || email}'s account?`)) event.preventDefault();
    }}>
      <input name="userId" type="hidden" value={userId} />
      <label>
        Name
        <input autoComplete="name" defaultValue={name} maxLength={100} name="name" required />
      </label>
      <label>
        Email
        <input autoComplete="email" defaultValue={email} name="email" required type="email" />
      </label>
      <label>
        Phone number
        <input autoComplete="tel" defaultValue={phoneNumber} maxLength={32} name="phoneNumber" required type="tel" />
      </label>
      <label>
        Village
        <input autoComplete="address-level2" defaultValue={village} maxLength={120} name="village" required />
      </label>
      <label>
        New password
        <input autoComplete="new-password" minLength={8} name="password" placeholder="Leave blank to keep current password" type="password" />
      </label>
      <button className="user-save" disabled={pending} type="submit">
        {pending ? "Saving..." : "Save changes"}
      </button>
      {state.message && (
        <p className="user-action-feedback" role="status" data-success={state.success}>
          {state.message}
        </p>
      )}
    </form>
  );
}