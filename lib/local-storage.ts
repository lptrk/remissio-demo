export interface User {
	id: string
	email: string
	user_metadata?: {
		name?: string
	}
}

export interface Profile {
	id: string
	email: string
	name?: string
	gender?: string
	date_of_birth?: string
	age?: number
	weight?: number
	height_in_cm?: number
	year_of_diagnosis?: number
	current_medication?: string
	notes?: string
	language?: string
	onboarding_completed?: boolean
	created_at: string
	updated_at: string
}

export interface Pucai {
	id: string
	user_id: string
	stomachache: number
	rectal_bleeding: number
	texture: number
	frequency: number
	nightly_bowel_movements: number
	level_of_activity: number
	sum: number
	created_at: string
}

export interface Mood {
	id: string
	user_id: string
	amount: number
	notes?: string | null
	created_at: string
}

export interface Meal {
	id: string
	user_id: string
	name: string
	time: string
	type?: string | null
	ingredients: string
	notes?: string | null
	image_url?: string | null
	created_at: string
}

// Helper functions
function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getFromStorage<T>(key: string): T[] {
	if (typeof window === "undefined") return []

	try {
		const data = localStorage.getItem(key)
		if (!data) return []

		const parsed = JSON.parse(data)

		// Ensure we always return an array
		if (!Array.isArray(parsed)) {
			console.warn(`[v0] Data in ${key} is not an array, resetting to empty array`)
			localStorage.setItem(key, JSON.stringify([]))
			return []
		}

		return parsed
	} catch (error) {
		console.error(`[v0] Error parsing localStorage key "${key}":`, error)
		// Reset corrupted data
		localStorage.setItem(key, JSON.stringify([]))
		return []
	}
}

function saveToStorage<T>(key: string, data: T[]): void {
	if (typeof window === "undefined") return

	try {
		// Ensure data is an array before saving
		if (!Array.isArray(data)) {
			console.error(`[v0] Attempted to save non-array data to ${key}`)
			return
		}

		localStorage.setItem(key, JSON.stringify(data))
		console.log(`[v0] Successfully saved to ${key}:`, data.length, "items")
	} catch (error) {
		console.error(`[v0] Error saving to localStorage key "${key}":`, error)

		// If quota exceeded, try to clear some space
		if (error instanceof Error && error.name === "QuotaExceededError") {
			console.error("[v0] localStorage quota exceeded!")
		}
	}
}

// Auth functions
export const localAuth = {
	getUser: async (): Promise<{ data: { user: User | null }; error: any }> => {
		const currentUser = getFromStorage<User>("current_user")[0] || null
		return { data: { user: currentUser }, error: null }
	},

	signIn: async (email: string, password: string): Promise<{ data: { user: User | null }; error: any }> => {
		const users = getFromStorage<User & { password: string }>("users")
		const user = users.find((u) => u.email === email && u.password === password)

		if (!user) {
			return { data: { user: null }, error: { message: "Ungültige Anmeldedaten" } }
		}

		const { password: _, ...userWithoutPassword } = user
		saveToStorage("current_user", [userWithoutPassword])
		return { data: { user: userWithoutPassword }, error: null }
	},

	signUp: async (
		email: string,
		password: string,
		name: string,
	): Promise<{ data: { user: User | null }; error: any }> => {
		const users = getFromStorage<User & { password: string }>("users")

		if (users.find((u) => u.email === email)) {
			return { data: { user: null }, error: { message: "E-Mail bereits registriert" } }
		}

		const newUser: User & { password: string } = {
			id: generateId(),
			email,
			password,
			user_metadata: { name },
		}

		users.push(newUser)
		saveToStorage("users", users)

		const { password: _, ...userWithoutPassword } = newUser
		saveToStorage("current_user", [userWithoutPassword])

		// Create initial profile
		const profiles = getFromStorage<Profile>("profiles")
		profiles.push({
			id: newUser.id,
			email: newUser.email,
			name,
			onboarding_completed: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		saveToStorage("profiles", profiles)

		return { data: { user: userWithoutPassword }, error: null }
	},

	signOut: async (): Promise<{ error: any }> => {
		localStorage.removeItem("current_user")
		return { error: null }
	},

	updateUser: async (updates: { data?: { name?: string } }): Promise<{ error: any }> => {
		const currentUser = getFromStorage<User>("current_user")[0]
		if (!currentUser) return { error: { message: "Nicht angemeldet" } }

		if (updates.data?.name) {
			currentUser.user_metadata = { ...currentUser.user_metadata, name: updates.data.name }
			saveToStorage("current_user", [currentUser])

			// Update in users list
			const users = getFromStorage<User & { password: string }>("users")
			const userIndex = users.findIndex((u) => u.id === currentUser.id)
			if (userIndex !== -1) {
				users[userIndex].user_metadata = currentUser.user_metadata
				saveToStorage("users", users)
			}
		}

		return { error: null }
	},
}

// Database functions
export const localDb = {
	from: (table: string) => ({
		select: (columns = "*") => ({
			eq: (column: string, value: any) => ({
				single: async () => {
					try {
						const data = getFromStorage<any>(table)
						const item = data.find((d: any) => d[column] === value)
						return { data: item || null, error: item ? null : { message: "Not found" } }
					} catch (error) {
						console.error("[v0] Error in select.eq.single:", error)
						return { data: null, error }
					}
				},
				order: (orderColumn: string, options?: { ascending?: boolean }) => {
					const orderResult = {
						limit: async (count: number) => {
							try {
								console.log(
									`[v0] Fetching from ${table} where ${column}=${value}, ordering by ${orderColumn}, limit ${count}`,
								)
								const data = getFromStorage<any>(table)
								console.log(`[v0] Total items in ${table}:`, data.length)
								const filtered = data.filter((d: any) => d[column] === value)
								console.log(`[v0] Filtered items where ${column}=${value}:`, filtered.length)
								const sorted = filtered.sort((a: any, b: any) => {
									const aVal = new Date(a[orderColumn]).getTime()
									const bVal = new Date(b[orderColumn]).getTime()
									return options?.ascending ? aVal - bVal : bVal - aVal
								})
								const result = sorted.slice(0, count)
								console.log(`[v0] Returning ${result.length} items after limit`)
								return { data: result, error: null }
							} catch (error) {
								console.error("[v0] Error in select.eq.order.limit:", error)
								return { data: [], error }
							}
						},
						then: async (resolve: any, reject: any) => {
							try {
								console.log(
									`[v0] Fetching from ${table} where ${column}=${value}, ordering by ${orderColumn} (no limit)`,
								)
								const data = getFromStorage<any>(table)
								console.log(`[v0] Total items in ${table}:`, data.length)
								const filtered = data.filter((d: any) => d[column] === value)
								console.log(`[v0] Filtered items where ${column}=${value}:`, filtered.length)
								const sorted = filtered.sort((a: any, b: any) => {
									const aVal = new Date(a[orderColumn]).getTime()
									const bVal = new Date(b[orderColumn]).getTime()
									return options?.ascending ? aVal - bVal : bVal - aVal
								})
								console.log(`[v0] Returning all ${sorted.length} items`)
								resolve({ data: sorted, error: null })
							} catch (error) {
								console.error("[v0] Error in select.eq.order:", error)
								reject({ data: [], error })
							}
						},
					}
					return orderResult
				},
				gte: (gteColumn: string, gteValue: any) => ({
					lte: async (lteColumn: string, lteValue: any) => {
						try {
							const data = getFromStorage<any>(table)
							const filtered = data.filter((d: any) => {
								const matchesEq = d[column] === value
								const matchesGte = d[gteColumn] >= gteValue
								const matchesLte = d[lteColumn] <= lteValue
								return matchesEq && matchesGte && matchesLte
							})
							return { data: filtered, error: null }
						} catch (error) {
							console.error("[v0] Error in select.eq.gte.lte:", error)
							return { data: [], error }
						}
					},
				}),
			}),
			order: (orderColumn: string, options?: { ascending?: boolean }) => {
				const orderResult = {
					limit: async (count: number) => {
						try {
							console.log(`[v0] Fetching from ${table}, ordering by ${orderColumn}, limit ${count}`)
							const data = getFromStorage<any>(table)
							console.log(`[v0] Total items in ${table}:`, data.length)
							const sorted = data.sort((a: any, b: any) => {
								const aVal = new Date(a[orderColumn]).getTime()
								const bVal = new Date(b[orderColumn]).getTime()
								return options?.ascending ? aVal - bVal : bVal - aVal
							})
							const result = sorted.slice(0, count)
							console.log(`[v0] Returning ${result.length} items after limit`)
							return { data: result, error: null }
						} catch (error) {
							console.error("[v0] Error in select.order.limit:", error)
							return { data: [], error }
						}
					},
					then: async (resolve: any, reject: any) => {
						try {
							console.log(`[v0] Fetching from ${table}, ordering by ${orderColumn} (no limit)`)
							const data = getFromStorage<any>(table)
							console.log(`[v0] Total items in ${table}:`, data.length)
							const sorted = data.sort((a: any, b: any) => {
								const aVal = new Date(a[orderColumn]).getTime()
								const bVal = new Date(b[orderColumn]).getTime()
								return options?.ascending ? aVal - bVal : bVal - aVal
							})
							console.log(`[v0] Returning all ${sorted.length} items`)
							resolve({ data: sorted, error: null })
						} catch (error) {
							console.error("[v0] Error in select.order:", error)
							reject({ data: [], error })
						}
					},
				}
				return orderResult
			},
		}),

		insert: async (items: any[]) => {
			try {
				console.log("[v0] Starting insert into table:", table)
				console.log("[v0] Items to insert:", JSON.stringify(items, null, 2))

				if (!Array.isArray(items)) {
					console.error("[v0] Insert error: items is not an array", items)
					return { data: null, error: { message: "Items must be an array" } }
				}

				if (items.length === 0) {
					console.warn("[v0] Insert called with empty array")
					return { data: [], error: null }
				}

				// Get current data with error handling
				let data: any[]
				try {
					data = getFromStorage<any>(table)
					console.log("[v0] Current data in table:", table, "count:", data.length)
				} catch (error) {
					console.error("[v0] Error getting data from storage, initializing empty array:", error)
					data = []
				}

				// Ensure data is an array
				if (!Array.isArray(data)) {
					console.warn("[v0] Data is not an array, resetting to empty array")
					data = []
				}

				// Create new items with IDs and timestamps
				const newItems = items.map((item) => {
					const newItem = {
						...item,
						id: item.id || generateId(),
						created_at: item.created_at || new Date().toISOString(),
					}
					console.log("[v0] Created new item:", JSON.stringify(newItem, null, 2))
					return newItem
				})

				// Add new items to data
				console.log("[v0] Pushing", newItems.length, "items to data array")
				data.push(...newItems)

				// Save to storage
				console.log("[v0] Saving", data.length, "total items to storage")
				saveToStorage(table, data)

				console.log("[v0] Successfully completed insert operation")
				return { data: newItems, error: null }
			} catch (error) {
				console.error("[v0] Unexpected error in insert:", error)
				console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
				return { data: null, error: { message: error instanceof Error ? error.message : "Unknown error" } }
			}
		},

		upsert: async (item: any) => {
			try {
				const data = getFromStorage<any>(table)
				const index = data.findIndex((d: any) => d.id === item.id)

				if (index !== -1) {
					data[index] = { ...data[index], ...item, updated_at: new Date().toISOString() }
				} else {
					data.push({
						...item,
						id: item.id || generateId(),
						created_at: item.created_at || new Date().toISOString(),
						updated_at: new Date().toISOString(),
					})
				}

				saveToStorage(table, data)
				return { data: item, error: null }
			} catch (error) {
				console.error("[v0] Error in upsert:", error)
				return { data: null, error }
			}
		},

		update: (updates: any) => ({
			eq: async (column: string, value: any) => {
				try {
					const data = getFromStorage<any>(table)
					const index = data.findIndex((d: any) => d[column] === value)

					if (index !== -1) {
						data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() }
						saveToStorage(table, data)
					}

					return { error: null }
				} catch (error) {
					console.error("[v0] Error in update.eq:", error)
					return { error }
				}
			},
		}),
	}),
}

// @ts-ignore
let clientInstance: ReturnType<typeof createClient> | null = null

// Create client that mimics Supabase API
// @ts-ignore
export function createClient() {
	// Return existing instance if available
	if (clientInstance) {
		return clientInstance
	}

	clientInstance = {
		auth: localAuth,
		from: localDb.from,
		storage: {
			from: (bucket: string) => ({
				createSignedUrl: async (path: string, expiresIn: number) => {
					// For localStorage, we'll just return the path as-is
					return { data: { signedUrl: path }, error: null }
				},
			}),
		},
	}

	return clientInstance
}

export const supabase = createClient()
