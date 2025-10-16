"use client"

import {supabase} from "@/utils/supabase/client";

export async function signUp(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	})

	if (error) {
		throw new Error(error.message)
	}

	return data
}