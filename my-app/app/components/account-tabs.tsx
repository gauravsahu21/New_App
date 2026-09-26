import Link from "next/link";
import { signOut } from "@/app/account/actions";

type ActiveTab = "account" | "gifts" | "users";

export function AccountTabs({
  active,
  isAdmin = false,
}: {
  active: ActiveTab;
  isAdmin?: boolean;
}) {
  const tabs: { id: ActiveTab; label: string; href: string }[] = [
    { id: "account", label: "Account", href: "/account" },
    { id: "gifts", label: "Gifts", href: "/gifts" },
  ];

  if (isAdmin) {
    tabs.push({ id: "users", label: "Users", href: "/admin/users" });
  }

  return (
    <nav aria-label="Account navigation" className="admin-tabs">
      {tabs.map((tab) => (
        <Link
          aria-current={active === tab.id ? "page" : undefined}
          className="admin-tab"
          href={tab.href}
          key={tab.id}
        >
          {tab.label}
        </Link>
      ))}
      <form action={signOut}>
        <button className="admin-signout" type="submit">
          Sign out
        </button>
      </form>
    </nav>
  );
}