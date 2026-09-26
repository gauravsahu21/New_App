# Your Space

Email and password sign-in backed by Supabase Auth. Supabase manages password hashing and authentication; the app never stores passwords itself. The protected account page verifies the session on the server.

## Configure Supabase

1. Create a Supabase project.
2. In **Authentication → Sign In / Providers**, enable Email. The admin account must already exist in Supabase Auth with a confirmed email.
3. Create `.env.local` in the project root. Set the project URL, publishable key, and server-only service-role key from the Supabase project settings. Set `SUPABASE_ADMIN_EMAIL` to the admin account email. Keep this file local; it is ignored by Git.
4. Run `supabase/schema.sql` in the Supabase SQL Editor. It creates a `profiles` table with row-level security and policies that allow each signed-in user to read and update only their own profile.
5. Restart the development server, then open `http://localhost:3000`. The configured admin can open **Manage users** from the account page and create confirmed email/password accounts. New users can sign in immediately with those credentials.

Never put `SUPABASE_SERVICE_ROLE_KEY` in a `NEXT_PUBLIC_` variable or browser code. It bypasses row-level security and is used only in the server action after the admin session is verified. The publishable key is safe to expose when row-level security is enabled and policies are restrictive. Rotate any service-role/secret key that was previously exposed or committed.

## Run

```bash
npm run dev
npm run lint
npm run build
```

