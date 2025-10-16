"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RemissioLogo } from "@/components/remissio-logo"

const moodOptions = [
	{ value: 1, label: "Sehr schlecht", emoji: "😢", color: "bg-red-500" },
	{ value: 2, label: "Schlecht", emoji: "😞", color: "bg-orange-500" },
	{ value: 3, label: "Neutral", emoji: "😐", color: "bg-yellow-500" },
	{ value: 4, label: "Gut", emoji: "😊", color: "bg-lime-500" },
	{ value: 5, label: "Sehr gut", emoji: "😄", color: "bg-green-500" },
]

export default function MoodPage() {
	const [user, setUser] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [selectedMood, setSelectedMood] = useState<number | null>(null)
	const [notes, setNotes] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
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
			} catch (error) {
				console.error("[v0] Error fetching user:", error)
				router.push("/")
			} finally {
				setIsLoading(false)
			}
		}
		fetchUser()
	}, [router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!user || selectedMood === null) return

		setIsSubmitting(true)

		try {
			const payload = {
				user_id: user.id,
				amount: selectedMood,
				notes: notes || null,
				created_at: new Date().toISOString(),
			}

			const { error } = await supabase.from("moods").insert([payload])

			if (error) {
				toast({
					title: "Fehler",
					description: "Stimmung konnte nicht gespeichert werden.",
					variant: "destructive",
				})
				setIsSubmitting(false)
				return
			}

			const selectedOption = moodOptions.find((m) => m.value === selectedMood)
			toast({
				title: "Stimmung gespeichert",
				description: `${selectedOption?.emoji} ${selectedOption?.label}`,
			})

			router.push("/dashboard")
		} catch (error) {
			console.error("[v0] Error submitting mood:", error)
			toast({
				title: "Fehler",
				description: "Ein unerwarteter Fehler ist aufgetreten.",
				variant: "destructive",
			})
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-300">Lädt...</p>
				</div>
			</div>
		)
	}

	if (!user) return null

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
								<h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Stimmung bewerten</h1>
								<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Wie fühlen Sie sich heute?</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
							<Heart className="h-5 w-5" />
							Ihre Stimmung heute
						</CardTitle>
						<CardDescription className="text-base sm:text-lg">
							Wählen Sie aus, wie Sie sich heute fühlen
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<Label className="text-base">Wie geht es Ihnen? *</Label>
								<div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
									{moodOptions.map((mood) => (
										<button
											key={mood.value}
											type="button"
											onClick={() => setSelectedMood(mood.value)}
											disabled={isSubmitting}
											className={`
                        flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                        ${
												selectedMood === mood.value
													? `${mood.color} border-slate-900 dark:border-white scale-105 shadow-lg`
													: "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800"
											}
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
										>
											<span className="text-4xl mb-2">{mood.emoji}</span>
											<span
												className={`text-sm font-medium ${
													selectedMood === mood.value ? "text-white" : "text-slate-700 dark:text-slate-300"
												}`}
											>
                        {mood.label}
                      </span>
											<span
												className={`text-xs ${
													selectedMood === mood.value ? "text-white/80" : "text-slate-500 dark:text-slate-400"
												}`}
											>
                        {mood.value}/5
                      </span>
										</button>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="notes">Notizen (optional)</Label>
								<Textarea
									id="notes"
									placeholder="Was hat Ihre Stimmung beeinflusst? Besondere Ereignisse oder Gedanken..."
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={4}
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

								<Button
									type="submit"
									disabled={selectedMood === null || isSubmitting}
									className="gap-2 w-full sm:w-auto"
								>
									<Save className="h-4 w-4" />
									{isSubmitting ? "Wird gespeichert..." : "Stimmung speichern"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
