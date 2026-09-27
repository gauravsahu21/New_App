import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountTabs } from "@/app/components/account-tabs";
import { isAdminEmail } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

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
    .select("display_name, points")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <main className="account-page">
      <section className="account-content signed-in-content" aria-labelledby="account-title">
        <AccountTabs active="account" isAdmin={isAdminEmail(user.email)} />
        <p className="eyebrow account-eyebrow">ACCOUNT ACCESS</p>
        <h1 id="account-title">You&apos;re signed in.</h1>
        <p className="account-intro">
          {profile?.display_name
            ? `Welcome, ${profile.display_name}.`
            : "Your account is ready."}
        </p>
        <div className="account-points" aria-label={`${(profile?.points ?? 0).toLocaleString()} points`}>
          <span>POINTS BALANCE</span>
          <strong>{(profile?.points ?? 0).toLocaleString()}</strong>
          <small>points</small>
        </div>
        <div className="account-identity">
          <span>Email address</span>
          <strong>{user.email ?? "Email unavailable"}</strong>
        </div>
      </section>
    </main>
  );
}