"use client"


import {supabase} from "@/utils/supabase/client";

export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		throw new Error(error.message)
	}

	return data
}
