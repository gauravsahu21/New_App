"use server";

import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function addUser(
  _previousState: { success: boolean; message: string },
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return { success: false, message: "You are not authorized to add users." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !email.includes("@")) {
    return { success: false, message: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "The passwords do not match." };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return {
      success: false,
      message: "Admin setup is incomplete. Configure the server-only Supabase key.",
    };
  }

  const { error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return {
      success: false,
      message: "Could not add this user. Check whether the email already exists and the password meets your Supabase settings.",
    };
  }

  return {
    success: true,
    message: `Account created for ${email}. They can now sign in with this email and password.`,
  };
}