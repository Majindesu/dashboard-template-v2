"use server";

import { redirect } from "next/navigation";
import getMyDetail from "../services/getMyDetail";
import { cookies } from "next/headers";

/**
 * Enforces a guest-only access policy by redirecting authenticated users to the dashboard.
 * This function asynchronously checks if the user is authenticated by attempting to retrieve user details.
 * If the user is authenticated, they are redirected to the dashboard page.
 *
 * @returns A promise that resolves when the operation completes. The function itself does not return a value.
 */
export default async function guestOnly(): Promise<void> {
	const token = cookies().get("token");

	if (!token) return;

	const user = await getMyDetail(token.value);

	// If an authenticated user is detected, redirect them to the dashboard.
	if (user) {
		redirect("/dashboard");
	}
}
