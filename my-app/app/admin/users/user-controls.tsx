"use client";

import { useActionState } from "react";
import { addPoints, deleteUser } from "./actions";

const initialState = { success: false, message: "" };

export function UserControls({ userId, pointsDisabled }: { userId: string; pointsDisabled: boolean }) {
  const [pointsState, pointsAction, pointsPending] = useActionState(addPoints, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUser, initialState);

  return (
    <div className="user-controls">
      <form action={pointsAction} className="points-form">
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
      <form action={deleteAction} onSubmit={(event) => {
        if (!window.confirm("Permanently delete this user and their profile?")) event.preventDefault();
      }}>
        <input name="userId" type="hidden" value={userId} />
        <button className="user-delete" disabled={deletePending} type="submit">
          {deletePending ? "Deleting..." : "Delete"}
        </button>
      </form>
      {(pointsState.message || deleteState.message) && (
        <p className="user-action-feedback" role="status" data-success={pointsState.success || deleteState.success}>
          {pointsState.message || deleteState.message}
        </p>
      )}
    </div>
  );
}