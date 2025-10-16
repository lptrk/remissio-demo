export enum Medications {
	NONE = "None",
}

/**
 * Profile model
 * Maps to: public.Profiles
 */
export interface Profile {
	id: string
	created_at?: string // timestamp with time zone
	updated_at?: string // timestamp without time zone
	deleted_at?: string | null // date
	email: string
	name?: string | null
	gender?: "male" | "female" | "other" | ""
	height_in_cm?: number | null
	weight?: number | null
	current_medication: string // text, not enum in DB
	notes?: string | null
	year_of_diagnosis?: string | null
	date_of_birth?: string | null
	age?: number | null
	onboarding_completed: boolean
}

/**
 * Meal model
 * Maps to: public.Meals
 */
export interface Meal {
	id: string
	created_at?: string
	name: string
	type?: string
	time: string // e.g. "18:30:00+02"
	ingredients: string
	notes?: string | null
	user_id: string
	image_url?: string | null
	signedUrl?: string | null
}

/**
 * Mood model
 * Maps to: public.Moods
 */
export interface Mood {
	id: string
	created_at?: string
	amount: number
	notes?: string | null
	user_id: string
}

/**
 * PUCAI model
 * Maps to: public.Pucais
 */
export interface Pucai {
	id: string
	created_at?: string
	stomachache: number
	rectal_bleeding: number
	texture: number
	frequency: number
	nightly_bowel_movements: number
	level_of_activity: number
	sum: number
	user_id: string
}
