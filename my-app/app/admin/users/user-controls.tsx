"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addPoints, deleteUser } from "./actions";

const initialState = { success: false, message: "" };

type UserDetails = {
  userId: string;
  name: string;
  email: string;
  pointsDisabled: boolean;
};

export function UserControls({ userId, name, email, pointsDisabled }: UserDetails) {
  const [pointsState, pointsAction, pointsPending] = useActionState(addPoints, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUser, initialState);

  return (
    <div className="user-controls">
      <div className="user-controls-toolbar">
        <form action={pointsAction} className="points-form" onSubmit={(event) => {
          const amount = String(new FormData(event.currentTarget).get("points") ?? "");
          if (!window.confirm(`Add ${amount} points to ${name || email}?`)) event.preventDefault();
        }}>
          <input name="userId" type="hidden" value={userId} />
          <label className="visually-hidden" htmlFor={`points-${userId}`}>Points to add</label>
          <input
            disabled={pointsDisabled || pointsPending}
            id={`points-${userId}`}
            inputMode="numeric"
            max="1000000"
            min="1"
            name="points"
            placeholder="Amount"
            required
            type="number"
          />
          <button disabled={pointsDisabled || pointsPending} type="submit">
            {pointsPending ? "Adding..." : "Add"}
          </button>
        </form>
        <details className="user-options">
          <summary aria-label={`More options for ${name || email}`} title="More options">
            <span aria-hidden="true" className="user-options-dots"><i /><i /><i /></span>
          </summary>
          <div className="user-options-menu">
            <Link href={`/admin/users/${userId}/edit`}>
              Update details
            </Link>
            <form action={deleteAction} onSubmit={(event) => {
              if (!window.confirm(`Permanently delete ${name || email} and their profile?`)) event.preventDefault();
            }}>
              <input name="userId" type="hidden" value={userId} />
              <button className="user-delete" disabled={deletePending} type="submit">
                {deletePending ? "Deleting..." : "Delete user"}
              </button>
            </form>
          </div>
        </details>
      </div>
      {(pointsState.message || deleteState.message) && (
        <p className="user-action-feedback" role="status" data-success={pointsState.success || deleteState.success}>
          {pointsState.message || deleteState.message}
        </p>
      )}
    </div>
  );
}