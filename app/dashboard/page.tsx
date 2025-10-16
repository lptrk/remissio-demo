"use client"

import React, {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Calendar, Activity, Utensils, Heart, LogOut, Plus, TrendingUp, BarChart3, Settings} from "lucide-react"
import {RemissioIcon} from "@/components/remissio-logo"
import {supabase} from "@/lib/local-storage"

export default function DashboardPage() {
	const [user, setUser] = useState<any>(null)
	const [latestSymptoms, setLatestSymptoms] = useState<any>(null)
	const [todayMeals, setTodayMeals] = useState<any[]>([])
	const [latestMood, setLatestMood] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const {
					data: {user},
					error: userError,
				} = await supabase.auth.getUser()
				if (userError || !user) {
					router.push("/")
					return
				}

				const {data: profile, error: profileError} = await supabase
					.from("profiles")
					.select("*")
					.eq("id", user.id)
					.single()

				if (profileError || !profile?.onboarding_completed) {
					router.push("/onboarding")
					return
				}

				setUser({...user, profile})

				const {data: symptomsData} = await supabase
					.from("pucais")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", {ascending: false})
					.limit(1)

				if (symptomsData && symptomsData.length > 0) {
					setLatestSymptoms(symptomsData[0])
				}

				const todayString = new Date().toISOString().slice(0, 10)
				const {data: mealsData} = await supabase
					.from("meals")
					.select("*")
					.eq("user_id", user.id)
					.gte("created_at", todayString)
					.lte("created_at", todayString + "T23:59:59")

				if (mealsData) {
					setTodayMeals(mealsData)
				}

				const {data: moodData} = await supabase
					.from("moods")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", {ascending: false})
					.limit(1)

				if (moodData && moodData.length > 0) {
					setLatestMood(moodData[0])
				}
			} catch (error) {
				console.error("[v0] Error fetching dashboard data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [router])

	const handleLogout = async () => {
		await supabase.auth.signOut()
		router.push("/")
	}

	const getPUCAICategory = (score: number) => {
		if (score < 10) return {category: "Remission", color: "#10b981"}
		if (score < 35) return {category: "Leichte Aktivität", color: "#f59e0b"}
		if (score < 65) return {category: "Mäßige Aktivität", color: "#f97316"}
		return {category: "Schwere Aktivität", color: "#ef4444"}
	}

	const getPUCAIBadgeVariant = (score: number): string => {
		if (score <= 10) return "default"
		if (score <= 34) return "secondary"
		if (score <= 64) return "destructive"
		return "destructive"
	}

	const getMealTypeLabel = (type: string) => {
		const types: Record<string, string> = {
			breakfast: "Frühstück",
			lunch: "Mittagessen",
			dinner: "Abendessen",
			snack: "Snack",
		}
		return types[type] || type
	}

	const getMoodLabel = (score: number) => {
		const labels: Record<number, string> = {
			1: "Sehr schlecht",
			2: "Schlecht",
			3: "Neutral",
			4: "Gut",
			5: "Sehr gut",
		}
		return labels[score] || "Unbekannt"
	}

	const getMoodEmoji = (score: number) => {
		const emojis: Record<number, string> = {
			1: "😢",
			2: "😞",
			3: "😐",
			4: "😊",
			5: "😄",
		}
		return emojis[score] || "😐"
	}

	if (loading || !user) return null

	const today = new Date().toLocaleDateString("de-DE", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})

	const todayString = new Date().toDateString()
	const pucaiDoneToday = latestSymptoms && new Date(latestSymptoms.created_at).toDateString() === todayString
	const moodDoneToday = latestMood && new Date(latestMood.created_at).toDateString() === todayString

	return (
		<div className="min-h-screen">
			<header className="glass-card border-b border-border/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap justify-between items-center py-4 gap-4">
						<div className="flex items-center gap-2 sm:gap-4">
							<RemissioIcon/>
							<div>
								<p className="text-sm text-muted-foreground">Willkommen zurück, {user?.profile?.name}</p>

							</div>
						</div>

						<div className="flex items-center gap-2 flex-wrap">
							<Button variant="outline" onClick={() => router.push("/profile")} className="gap-2 glass-card-hover">
								<Settings className="h-4 w-4"/>
								<span className="hidden sm:inline">Profil</span>
							</Button>
							<Button variant="outline" onClick={() => router.push("/timeline")} className="gap-2 glass-card-hover">
								<BarChart3 className="h-4 w-4"/>
								<span className="hidden sm:inline">Timeline</span>
							</Button>
							<Button variant="outline" onClick={handleLogout} className="gap-2 glass-card-hover bg-transparent">
								<LogOut className="h-4 w-4"/>
								<span className="hidden sm:inline">Abmelden</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h2>
					<p className="text-sm sm:text-base text-muted-foreground">{today}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
					{/* PUCAI */}
					<Card className="glass-card glass-card-hover">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Heutiger PUCAI</CardTitle>
							<Activity className="h-4 w-4 text-primary"/>
						</CardHeader>
						<CardContent>
							{pucaiDoneToday ? (
								<>
									<div className="text-2xl font-bold">{latestSymptoms.sum}</div>
									<Badge
										variant="secondary"
										className="mt-2 text-xs"
										style={{
											backgroundColor: getPUCAICategory(Number.parseFloat(latestSymptoms.sum)).color + "20",
											color: getPUCAICategory(Number.parseFloat(latestSymptoms.sum)).color,
										}}
									>
										{getPUCAICategory(Number.parseFloat(latestSymptoms.sum)).category}
									</Badge>
								</>
							) : (
								<>
									<div className="text-xl sm:text-2xl font-bold">Noch nicht erfasst</div>
									<Badge variant="outline" className="mt-2">
										Ausstehend
									</Badge>
								</>
							)}
						</CardContent>
					</Card>

					{/* Mahlzeiten heute */}
					<Card className="glass-card glass-card-hover">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Mahlzeiten heute</CardTitle>
							<Utensils className="h-4 w-4 text-chart-2"/>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{todayMeals.length}</div>
							<Badge variant={todayMeals.length > 0 ? "default" : "outline"} className="mt-2">
								{todayMeals.length > 0 ? `${todayMeals.length} erfasst` : "Keine erfasst"}
							</Badge>
						</CardContent>
					</Card>

					{/* Stimmung heute */}
					<Card className="glass-card glass-card-hover">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Stimmung heute</CardTitle>
							<Heart className="h-4 w-4 text-chart-5"/>
						</CardHeader>
						<CardContent>
							{moodDoneToday ? (
								<>
									<div className="text-2xl font-bold flex items-center gap-2">
										<span>{getMoodEmoji(latestMood.amount)}</span>
										<span>{latestMood.amount}/5</span>
									</div>
									<Badge variant="secondary" className="mt-2">
										{getMoodLabel(latestMood.amount)}
									</Badge>
								</>
							) : (
								<>
									<div className="text-xl sm:text-2xl font-bold">Noch nicht erfasst</div>
									<Badge variant="outline" className="mt-2">
										Ausstehend
									</Badge>
								</>
							)}
						</CardContent>
					</Card>

					{/* Streak */}
					<Card className="glass-card glass-card-hover">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Streak</CardTitle>
							<Calendar className="h-4 w-4 text-chart-4"/>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">0 Tage</div>
							<Badge variant="outline" className="mt-2">
								Neu gestartet
							</Badge>
						</CardContent>
					</Card>
				</div>

				{/* Schnelle Aktionen + Letzte Einträge */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
					<Card className="glass-card glass-card-hover">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<Activity className="h-5 w-5 text-primary"/>
								Schnelle Aktionen
							</CardTitle>
							<CardDescription className="text-sm">Erfassen Sie Ihre täglichen Gesundheitsdaten</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button
								className="w-full justify-start gap-2 text-sm sm:text-base"
								onClick={() => router.push("/symptoms")}
								disabled={pucaiDoneToday}
							>
								<Plus className="h-4 w-4"/>
								{pucaiDoneToday ? "PUCAI heute bereits erfasst" : "PUCAI Score erfassen"}
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start gap-2 glass-card-hover bg-transparent text-sm sm:text-base"
								onClick={() => router.push("/meals")}
							>
								<Plus className="h-4 w-4"/>
								Mahlzeit hinzufügen
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start gap-2 glass-card-hover bg-transparent text-sm sm:text-base"
								onClick={() => router.push("/mood")}
								disabled={moodDoneToday}
							>
								<Plus className="h-4 w-4"/>
								{moodDoneToday ? "Stimmung heute bereits bewertet" : "Stimmung bewerten"}
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start gap-2 glass-card-hover bg-transparent text-sm sm:text-base"
								onClick={() => router.push("/timeline")}
							>
								<BarChart3 className="h-4 w-4"/>
								Timeline & Verlauf anzeigen
							</Button>
						</CardContent>
					</Card>

					<Card className="glass-card glass-card-hover">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<TrendingUp className="h-5 w-5 text-chart-4"/>
								Letzte Einträge
							</CardTitle>
							<CardDescription className="text-sm">Ihre neuesten Gesundheitsdaten</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3 max-h-64 overflow-y-auto">
								{latestSymptoms && (
									<div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div className="min-w-0 flex-1">
											<p className="font-medium text-sm sm:text-base">PUCAI Score</p>
											<p className="text-xs sm:text-sm text-muted-foreground">
												{new Date(latestSymptoms.created_at).toLocaleDateString("de-DE")}
											</p>
										</div>
										<div className="text-right ml-2">
											<div className="text-lg font-bold">{latestSymptoms.sum}</div>
											<Badge
												variant="secondary"
												className="mt-2 text-xs"
												style={{
													backgroundColor: getPUCAICategory(Number.parseFloat(latestSymptoms.sum)).color + "20",
													color: getPUCAICategory(Number.parseFloat(latestSymptoms.sum)).color,
												}}
											>
												{getPUCAICategory(Number.parseFloat(latestSymptoms.sum)).category}
											</Badge>
										</div>
									</div>
								)}

								{latestMood && (
									<div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div className="min-w-0 flex-1">
											<p className="font-medium text-sm sm:text-base">Stimmung</p>
											<p className="text-xs sm:text-sm text-muted-foreground">
												{new Date(latestMood.created_at).toLocaleDateString("de-DE")}
											</p>
										</div>
										<div className="text-right ml-2">
											<div className="text-lg font-bold flex items-center gap-1">
												<span>{getMoodEmoji(latestMood.amount)}</span>
												<span>{latestMood.amount}/5</span>
											</div>
											<Badge variant="secondary" className="text-xs">
												{getMoodLabel(latestMood.amount)}
											</Badge>
										</div>
									</div>
								)}

								{todayMeals.map((meal) => (
									<div key={meal.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div className="min-w-0 flex-1">
											<p className="font-medium text-sm sm:text-base truncate">{meal.name}</p>
											<p className="text-xs sm:text-sm text-muted-foreground">
												{getMealTypeLabel(meal.type)} • {meal.time}
											</p>
										</div>
										<div className="text-right ml-2">
											<Badge variant="secondary" className="text-xs">
												<Utensils className="h-3 w-3 mr-1"/>
												Mahlzeit
											</Badge>
										</div>
									</div>
								))}

								{!latestSymptoms && !latestMood && todayMeals.length === 0 && (
									<div className="text-center py-8 text-muted-foreground">
										<Calendar className="h-12 w-12 mx-auto mb-4 opacity-50"/>
										<p className="text-sm sm:text-base">Noch keine Einträge vorhanden</p>
										<p className="text-xs sm:text-sm">Beginnen Sie mit der Erfassung Ihrer Daten</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
				<p className={'text-sm text-gray-600'}>
					Hinweis: Dies ist eine Demo-Version. Alle eingegebenen Daten werden nicht auf unseren Servern gespeichert und verbleiben nur lokal in deinem Browser.
				</p>
			</main>
		</div>
	)
}
