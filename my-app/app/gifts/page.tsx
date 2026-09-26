import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountTabs } from "@/app/components/account-tabs";
import { ItemCatalog } from "@/app/components/item-catalog";
import { isAdminEmail } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Gifts",
};

export default async function GiftsPage() {
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

  return (
    <main className="account-page">
      <section className="account-content signed-in-content" aria-labelledby="gifts-page-title">
        <AccountTabs active="gifts" isAdmin={isAdminEmail(user.email)} />
        <p className="eyebrow account-eyebrow">YOUR COLLECTION</p>
        <h1 className="admin-title" id="gifts-page-title">Gifts</h1>
        <p className="admin-description">Browse gifts and the points needed for each one.</p>
        <ItemCatalog />
      </section>
    </main>
  );
}