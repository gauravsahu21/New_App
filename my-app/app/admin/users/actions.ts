"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ActionState = { success: boolean; message: string };

async function getAuthorizedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user && isAdminEmail(user.email) ? user : null;
}

export async function addUser(
  _previousState: ActionState,
  formData: FormData,
) {
  if (!(await getAuthorizedAdmin())) {
    return { success: false, message: "You are not authorized to add users." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const village = String(formData.get("village") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !email.includes("@") || name.length < 2 || name.length > 100) {
    return { success: false, message: "Enter a valid email and a name between 2 and 100 characters." };
  }

  if (!/^[+()\d\s.-]{6,32}$/.test(phoneNumber) || phoneNumber.replace(/\D/g, "").length < 6) {
    return { success: false, message: "Enter a valid phone number." };
  }

  if (!village || village.length > 120) {
    return { success: false, message: "Enter a village name up to 120 characters." };
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
    user_metadata: {
      display_name: name,
      phone_number: phoneNumber,
      village,
    },
  });

  if (error) {
    return {
      success: false,
      message: "Could not add this user. Check whether the email already exists and the password meets your Supabase settings.",
    };
  }

  revalidatePath("/admin/users");
  return {
    success: true,
    message: `Account created for ${name}. They can now sign in with this email and password.`,
  };
}

export async function addPoints(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAuthorizedAdmin())) {
    return { success: false, message: "You are not authorized to update points." };
  }

  const userId = String(formData.get("userId") ?? "");
  const points = Number(formData.get("points"));
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !Number.isSafeInteger(points) || points < 1 || points > 1000000) {
    return { success: false, message: "Enter a valid user and a points amount from 1 to 1,000,000." };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, message: "Admin setup is incomplete. Configure the server-only Supabase key." };
  }

  const { error } = await adminClient.rpc("add_user_points", {
    p_user_id: userId,
    p_points: points,
  });

  if (error) {
    return { success: false, message: "Could not add points. Confirm the database schema is up to date." };
  }

  revalidatePath("/admin/users");
  return { success: true, message: `Added ${points.toLocaleString()} points.` };
}

export async function deleteUser(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAuthorizedAdmin();
  if (!admin) {
    return { success: false, message: "You are not authorized to delete users." };
  }

  const userId = String(formData.get("userId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(userId) || userId === admin.id) {
    return { success: false, message: "This account cannot be deleted." };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, message: "Admin setup is incomplete. Configure the server-only Supabase key." };
  }

  const { data, error: lookupError } = await adminClient.auth.admin.getUserById(userId);
  if (lookupError || !data.user || isAdminEmail(data.user.email)) {
    return { success: false, message: "This account cannot be deleted." };
  }

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) {
    return { success: false, message: "Could not delete this user." };
  }

  revalidatePath("/admin/users");
  return { success: true, message: "User deleted." };
}