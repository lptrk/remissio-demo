"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RemissioLogo } from "@/components/remissio-logo"

export default function MealsPage() {
	const [user, setUser] = useState<any>(null)
	const [name, setName] = useState("")
	const [time, setTime] = useState("")
	const [type, setType] = useState("")
	const [ingredients, setIngredients] = useState("")
	const [notes, setNotes] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const { toast } = useToast()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser()
				if (error || !user) {
					router.push("/")
					return
				}
				setUser(user)

				const now = new Date()
				const hours = now.getHours().toString().padStart(2, "0")
				const minutes = now.getMinutes().toString().padStart(2, "0")
				setTime(`${hours}:${minutes}`)
			} catch (error) {
				console.error("[v0] Error fetching user:", error)
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!user) return

		setIsSubmitting(true)

		const payload = {
			user_id: user.id,
			name,
			time,
			type: type || null,
			ingredients,
			notes: notes || null,
			created_at: new Date().toISOString(),
		}

		const { error } = await supabase.from("meals").insert([payload])

		if (error) {
			toast({
				title: "Fehler",
				description: "Mahlzeit konnte nicht gespeichert werden.",
				variant: "destructive",
			})
			setIsSubmitting(false)
			return
		}

		toast({
			title: "Mahlzeit gespeichert",
			description: `${name} wurde erfolgreich hinzugefügt.`,
		})

		router.push("/dashboard")
	}

	if (loading || !user) return null

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
			<header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap items-center py-4 gap-4">
						<Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							<span className="hidden sm:inline">Zurück</span>
						</Button>
						<div className="flex items-center gap-2 sm:gap-4">
							<RemissioLogo />
							<div>
								<h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Mahlzeit hinzufügen</h1>
								<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
									Erfassen Sie Ihre Mahlzeiten und Zutaten
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
							<Utensils className="h-5 w-5" />
							Neue Mahlzeit
						</CardTitle>
						<CardDescription className="text-base sm:text-lg">
							Dokumentieren Sie Ihre Mahlzeiten für bessere Gesundheitseinblicke
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Mahlzeitname *</Label>
									<Input
										id="name"
										placeholder="z.B. Haferflocken mit Banane"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="time">Uhrzeit *</Label>
									<Input
										id="time"
										type="time"
										value={time}
										onChange={(e) => setTime(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="type">Mahlzeittyp</Label>
								<Select value={type} onValueChange={setType} disabled={isSubmitting}>
									<SelectTrigger>
										<SelectValue placeholder="Wählen Sie einen Typ" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="breakfast">Frühstück</SelectItem>
										<SelectItem value="lunch">Mittagessen</SelectItem>
										<SelectItem value="dinner">Abendessen</SelectItem>
										<SelectItem value="snack">Snack</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="ingredients">Zutaten *</Label>
								<Textarea
									id="ingredients"
									placeholder="z.B. Haferflocken, Banane, Mandelmilch, Honig"
									value={ingredients}
									onChange={(e) => setIngredients(e.target.value)}
									rows={3}
									required
									disabled={isSubmitting}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="notes">Notizen (optional)</Label>
								<Textarea
									id="notes"
									placeholder="Besondere Beobachtungen, Reaktionen, etc."
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={3}
									disabled={isSubmitting}
								/>
							</div>

							<div className="flex flex-col sm:flex-row justify-between pt-6 gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push("/dashboard")}
									disabled={isSubmitting}
									className="w-full sm:w-auto"
								>
									Abbrechen
								</Button>

								<Button type="submit" disabled={isSubmitting} className="gap-2 w-full sm:w-auto">
									<Save className="h-4 w-4" />
									{isSubmitting ? "Wird gespeichert..." : "Mahlzeit speichern"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
