import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountTabs } from "@/app/components/account-tabs";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { EditUserForm } from "../../edit-user-form";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  if (!getSupabaseConfig()) redirect("/");

  const supabase = await createClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) redirect("/");
  if (!isAdminEmail(admin.email)) redirect("/account");

  const { userId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(userId)) redirect("/admin/users");

  const adminClient = createAdminClient();
  if (!adminClient) redirect("/admin/users");

  const { data: authData, error: authError } = await adminClient.auth.admin.getUserById(userId);
  if (authError || !authData.user || isAdminEmail(authData.user.email)) redirect("/admin/users");

  const { data: profile } = await adminClient
    .from("profiles")
    .select("display_name, email, phone_number, village")
    .eq("user_id", userId)
    .maybeSingle();

  const metadata = authData.user.user_metadata;
  const name = profile?.display_name ?? metadata.display_name ?? metadata.name ?? "";
  const email = profile?.email ?? authData.user.email ?? "";
  const phoneNumber = profile?.phone_number ?? metadata.phone_number ?? "";
  const village = profile?.village ?? metadata.village ?? "";

  return (
    <main className="account-page">
      <section className="account-content admin-content" aria-labelledby="edit-user-title">
        <AccountTabs active="users" isAdmin />
        <Link className="edit-user-back" href="/admin/users">← Back to users</Link>
        <p className="eyebrow account-eyebrow">USER ACCOUNT</p>
        <h1 className="admin-title" id="edit-user-title">Update user</h1>
        <p className="admin-description">Update profile details and optionally set a new password.</p>
        <EditUserForm
          userId={userId}
          name={String(name)}
          email={String(email)}
          phoneNumber={String(phoneNumber)}
          village={String(village)}
        />
      </section>
    </main>
  );
}