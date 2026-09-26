import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountTabs } from "@/app/components/account-tabs";
import { AddUserForm } from "./add-user-form";
import { hasAdminApiConfig, isAdminEmail } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manage users",
};

export default async function ManageUsersPage() {
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

  if (!isAdminEmail(user.email)) {
    redirect("/account");
  }

  const isConfigured = hasAdminApiConfig();

  return (
    <main className="account-page">
      <section className="account-content admin-content" aria-labelledby="users-title">
        <AccountTabs active="users" isAdmin />
        <p className="eyebrow account-eyebrow">ADMIN</p>
        <h1 className="admin-title" id="users-title">Add a user</h1>
        <p className="admin-description">
          Set the user&apos;s email and password. They can use these credentials to sign in.
        </p>
        {!isConfigured && (
          <p className="admin-config-notice" role="status">
            Add the server-only Supabase key to your environment before creating users.
          </p>
        )}
        <AddUserForm disabled={!isConfigured} />
      </section>
    </main>
  );
}