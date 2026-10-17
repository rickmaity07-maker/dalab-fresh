"use client";

import { useActionState } from "react";
import { type LoginState, login } from "@/app/admin/actions";
import { button, input } from "../ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="grid gap-3">
      <label htmlFor="admin-password" className="text-sm font-semibold">Passwort</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        aria-invalid={Boolean(state.error)}
        aria-describedby={state.error ? "admin-error" : undefined}
        className={input}
      />
      {state.error ? <p id="admin-error" role="alert" className="text-[13px] font-bold text-bad">{state.error}</p> : null}
      <button type="submit" disabled={pending} className={`${button.primary} mt-1`}>{pending ? "Wird geprüft" : "Anmelden"}</button>
    </form>
  );
}
