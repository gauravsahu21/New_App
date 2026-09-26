import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  if (!getSupabaseConfig()) {
    redirect("/");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <main className="account-page">
      <section className="account-content" aria-labelledby="account-title">
        <p className="eyebrow account-eyebrow">ACCOUNT ACCESS</p>
        <h1 id="account-title">You&apos;re signed in.</h1>
        <p className="account-intro">
          {profile?.display_name
            ? `Welcome, ${profile.display_name}.`
            : "Your account is ready."}
        </p>
        <div className="account-identity">
          <span>Email address</span>
          <strong>{user.email ?? "Email unavailable"}</strong>
        </div>
        {isAdminEmail(user.email) && (
          <nav aria-label="Admin" className="account-nav">
            <Link className="account-nav-link" href="/admin/users">
              Manage users <span aria-hidden="true">→</span>
            </Link>
          </nav>
        )}
        <form action={signOut}>
          <button className="signout-button" type="submit">
            Sign out <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}