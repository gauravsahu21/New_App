import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountTabs } from "@/app/components/account-tabs";
import { AddUserForm } from "./add-user-form";
import { createAdminClient, hasAdminApiConfig, isAdminEmail } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { UserControls } from "./user-controls";

export const metadata: Metadata = {
  title: "Manage users",
};

const USERS_PER_PAGE = 50;

export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
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
  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const searchTerm = (params.q ?? "").replace(/[^a-zA-Z0-9@+._\-\s]/g, " ").trim().slice(0, 100);
  const adminClient = isConfigured ? createAdminClient() : null;
  let usersQuery = adminClient
    ? adminClient
      .from("profiles")
      .select("user_id, email, display_name, phone_number, village, points, created_at", { count: "exact" })
      .neq("email", user.email!.trim().toLowerCase())
      .order("created_at", { ascending: false })
    : null;
  if (usersQuery && searchTerm) {
    usersQuery = usersQuery.or(
      `display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`,
    );
  }
  const { data: users, error: usersError, count } = usersQuery
    ? await usersQuery.range((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE - 1)
    : { data: [], error: null, count: 0 };
  const listedUsers = users ?? [];
  const pageCount = Math.max(1, Math.ceil((count ?? 0) / USERS_PER_PAGE));
  const pageHref = (targetPage: number) => {
    const query = new URLSearchParams({ page: String(targetPage) });
    if (searchTerm) query.set("q", searchTerm);
    return `/admin/users?${query.toString()}`;
  };

  return (
    <main className="account-page">
      <section className="account-content admin-content" aria-labelledby="users-title">
        <AccountTabs active="users" isAdmin />
        <p className="eyebrow account-eyebrow">ADMIN</p>
        <h1 className="admin-title" id="users-title">Manage users</h1>
        <p className="admin-description">
          Add accounts, adjust point balances, and remove users.
        </p>
        {!isConfigured && (
          <p className="admin-config-notice" role="status">
            Add the server-only Supabase key to your environment before creating users.
          </p>
        )}
        <AddUserForm disabled={!isConfigured} />
        <section className="user-directory" aria-labelledby="directory-title">
          <div className="user-directory-heading">
            <h2 id="directory-title">User directory</h2>
            {(count ?? 0) > 0 && <span>{count} users</span>}
          </div>
          <form action="/admin/users" className="user-search" role="search">
            <label className="visually-hidden" htmlFor="user-search">Search name, email, or phone</label>
            <input
              id="user-search"
              name="q"
              placeholder="Search name, email, or phone"
              type="search"
              defaultValue={searchTerm}
            />
            <button type="submit">Search</button>
            {searchTerm && <Link href="/admin/users">Clear</Link>}
          </form>
          {!isConfigured && (
            <p className="admin-config-notice" role="status">Configure the server-only Supabase key to load users.</p>
          )}
          {usersError && <p className="admin-config-notice" role="alert">Could not load users from Supabase.</p>}
          {isConfigured && !usersError && listedUsers.length === 0 && (
            <p className="admin-empty">{searchTerm ? "No users match that search." : "No users found."}</p>
          )}
          {listedUsers.length > 0 && (
            <>
              <div className="user-table-scroll">
                <table className="user-table">
                  <thead>
                    <tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">Village</th><th scope="col">Points</th><th scope="col">Created</th><th scope="col">Actions</th></tr>
                  </thead>
                  <tbody>
                    {listedUsers.map((listedUser) => (
                      <tr key={listedUser.user_id}>
                        <td>{listedUser.display_name ?? "Name unavailable"}</td>
                        <td className="user-email">{listedUser.email ?? "Email unavailable"}</td>
                        <td>{listedUser.phone_number ?? "Not provided"}</td>
                        <td>{listedUser.village ?? "Not provided"}</td>
                        <td>{(listedUser.points ?? 0).toLocaleString()}</td>
                        <td>{new Date(listedUser.created_at).toLocaleDateString()}</td>
                        <td><UserControls userId={listedUser.user_id} pointsDisabled={Boolean(usersError)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav className="user-pagination" aria-label="User pages">
                {page > 1 ? <Link href={pageHref(page - 1)}>Previous</Link> : <span />}
                <span>Page {page} of {pageCount}</span>
                {page < pageCount ? <Link href={pageHref(page + 1)}>Next</Link> : <span />}
              </nav>
            </>
          )}
        </section>
      </section>
    </main>
  );
}