"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, TrendingUp, Activity, Heart, Utensils } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { RemissioLogo } from "@/components/remissio-logo"

type Pucai = {
  id: string
  created_at: string
  stomachache: number
  rectal_bleeding: number
  texture: number
  frequency: number
  nightly_bowel_movements: number
  level_of_activity: number
  sum: number
  user_id: string
}

type Mood = {
  id: string
  created_at: string
  amount: number
  notes?: string | null
  user_id: string
}

type Meal = {
  id: string
  created_at: string
  name: string
  time: string
  ingredients: string
  notes?: string | null
  user_id: string
  image_url?: string | null
  type?: string | null
}

export default function TimelinePage() {
  const router = useRouter()

  const [user, setUser] = useState<any | null>(null)
  const [pucais, setPucais] = useState<Pucai[]>([])
  const [moods, setMoods] = useState<Mood[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [timeRange, setTimeRange] = useState("7")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      try {
        const {
          data: { user },
          error: authErr,
        } = await supabase.auth.getUser()
        if (authErr || !user) {
          router.push("/")
          return
        }
        if (!mounted) return
        setUser(user)
        const userId = user.id

        const [pucaiRes, moodRes, mealRes] = await Promise.all([
          supabase.from("pucais").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("moods").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("meals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        ])

        if (!mounted) return

        if (pucaiRes.error || moodRes.error || mealRes.error) {
          console.error("Error loading timeline data:", pucaiRes.error || moodRes.error || mealRes.error)
          setPucais([])
          setMoods([])
          setMeals([])
          setLoading(false)
          return
        }

        setPucais((pucaiRes.data || []) as Pucai[])
        setMoods((moodRes.data || []) as Mood[])
        setMeals((mealRes.data || []) as Meal[])
      } catch (err) {
        console.error("Unexpected error loading timeline:", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchAll()
    return () => {
      mounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-600 dark:text-slate-300">
        Daten werden geladen…
      </div>
    )
  }

  if (!user) return null

  // helpers for filtering & chart prep
  const getFilteredData = (data: any[], days: number) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return data.filter((item) => new Date(item.created_at) >= cutoff)
  }

  const prepareChartData = () => {
    const days = Number.parseInt(timeRange, 10)
    const filteredPucai = getFilteredData(pucais, days)
    const filteredMoods = getFilteredData(moods, days)
    const filteredMeals = getFilteredData(meals, days)

    const dates: string[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split("T")[0])
    }

    return dates.map((date) => {
      const p = filteredPucai.find((x) => x.created_at.split("T")[0] === date)
      const m = filteredMoods.find((x) => x.created_at.split("T")[0] === date)
      const dayMeals = filteredMeals.filter((x) => x.created_at.split("T")[0] === date)

      return {
        date,
        displayDate: new Date(date).toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
        pucai: p?.sum ?? null,
        mood: m?.amount ?? null,
        meals: dayMeals.length,
      }
    })
  }

  const chartData = prepareChartData()

  const getPUCAICategory = (score: number) => {
    if (score < 10) return { category: "Remission", color: "#10b981" }
    if (score < 35) return { category: "Leichte Aktivität", color: "#f59e0b" }
    if (score < 65) return { category: "Mäßige Aktivität", color: "#f97316" }
    return { category: "Schwere Aktivität", color: "#ef4444" }
  }

  const getMoodLabel = (score: number) => {
    const map: Record<number, string> = {
      1: "Sehr schlecht",
      2: "Schlecht",
      3: "Neutral",
      4: "Gut",
      5: "Sehr gut",
    }
    return map[score] ?? "Unbekannt"
  }

  const getMoodEmoji = (score: number) => {
    const emojis: Record<number, string> = {
      1: "😢",
      2: "😞",
      3: "😐",
      4: "😊",
      5: "😄",
    }
    return emojis[score] ?? "😐"
  }

  const averages = (() => {
    const validPucai = chartData.filter((d) => d.pucai !== null).map((d) => d.pucai as number)
    const validMoods = chartData.filter((d) => d.mood !== null).map((d) => d.mood as number)
    const totalMeals = chartData.reduce((s, d) => s + d.meals, 0)
    return {
      avgPucai: validPucai.length ? (validPucai.reduce((a, b) => a + b, 0) / validPucai.length).toFixed(1) : null,
      avgMood: validMoods.length ? (validMoods.reduce((a, b) => a + b, 0) / validMoods.length).toFixed(1) : null,
      totalMeals,
      avgMealsPerDay: (totalMeals / Number.parseInt(timeRange, 10)).toFixed(1),
    }
  })()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Zurück</span>
              </Button>
              <RemissioLogo />
              <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-white lg:whitespace-nowrap">
                  Timeline & Verlauf
                </h1>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-600 dark:text-slate-300 lg:whitespace-nowrap">
                  Visualisierung Ihrer Gesundheitsdaten
                </p>
              </div>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Letzte 7 Tage</SelectItem>
                <SelectItem value="14">Letzte 14 Tage</SelectItem>
                <SelectItem value="30">Letzte 30 Tage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ø PUCAI Score</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {averages.avgPucai ? (
                <>
                  <div className="text-2xl font-bold">{averages.avgPucai}</div>
                  <Badge
                    variant="secondary"
                    className="mt-2 text-xs"
                    style={{
                      backgroundColor: getPUCAICategory(Number.parseFloat(averages.avgPucai)).color + "20",
                      color: getPUCAICategory(Number.parseFloat(averages.avgPucai)).color,
                    }}
                  >
                    {getPUCAICategory(Number.parseFloat(averages.avgPucai)).category}
                  </Badge>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Keine Daten
                  </Badge>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ø Stimmung</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              {averages.avgMood ? (
                <>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <span>{getMoodEmoji(Math.round(Number.parseFloat(averages.avgMood)))}</span>
                    <span>{averages.avgMood}/5</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {getMoodLabel(Math.round(Number.parseFloat(averages.avgMood)))}
                  </Badge>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Keine Daten
                  </Badge>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mahlzeiten gesamt</CardTitle>
              <Utensils className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averages.totalMeals}</div>
              <Badge variant="secondary" className="mt-2 text-xs">
                Ø {averages.avgMealsPerDay}/Tag
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-orange-600" />
                Einträge
              </CardTitle>
              <CardDescription className="text-xs">Gesamtzahl Ihrer Einträge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pucais.length + moods.length + meals.length}</div>
              <Badge variant="secondary" className="mt-2 text-xs">
                Gesamt
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* PUCAI Chart */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                PUCAI Score Verlauf
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Entwicklung Ihrer Symptome über Zeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="displayDate" className="text-xs" />
                    <YAxis domain={[0, 85]} className="text-xs" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload[0]) {
                          const value = payload[0].value
                          if (value !== null) {
                            const category = getPUCAICategory(value as number)
                            return (
                              <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
                                <p className="font-medium text-sm">{label}</p>
                                <p className="text-blue-600 text-sm">PUCAI: {value}</p>
                                <p className="text-xs" style={{ color: category.color }}>
                                  {category.category}
                                </p>
                              </div>
                            )
                          }
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pucai"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Mood Chart */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                Stimmungsverlauf
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Ihre emotionale Entwicklung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="displayDate" className="text-xs" />
                    <YAxis domain={[1, 5]} className="text-xs" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload[0]) {
                          const value = payload[0].value
                          if (value !== null) {
                            return (
                              <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
                                <p className="font-medium text-sm">{label}</p>
                                <p className="text-pink-600 flex items-center gap-2 text-sm">
                                  <span>{getMoodEmoji(value as number)}</span>
                                  <span>Stimmung: {value}/5</span>
                                </p>
                                <p className="text-xs">{getMoodLabel(value as number)}</p>
                              </div>
                            )
                          }
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meals Chart */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Mahlzeiten pro Tag
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Übersicht Ihrer täglichen Mahlzeiten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="displayDate" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload[0]) {
                        const value = payload[0].value
                        return (
                          <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
                            <p className="font-medium text-sm">{label}</p>
                            <p className="text-green-600 text-sm">Mahlzeiten: {value}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="meals" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              Letzte Aktivitäten
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Chronologische Übersicht Ihrer Einträge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {[...pucais, ...moods, ...meals]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 10)
                .map((entry: any, index: number) => {
                  const isPucai = "sum" in entry
                  const isMood = "amount" in entry && !("sum" in entry)
                  const isMeal = "name" in entry

                  return (
                    <div
                      key={`${entry.id}-${index}`}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg gap-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {isPucai && <Activity className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                        {isMood && <Heart className="h-4 w-4 text-pink-600 flex-shrink-0" />}
                        {isMeal && <Utensils className="h-4 w-4 text-green-600 flex-shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {isPucai && "PUCAI Score"}
                            {isMood && "Stimmungsbewertung"}
                            {isMeal && entry.name}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            {new Date(entry.created_at).toLocaleDateString("de-DE", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        {isPucai && (
                          <>
                            <div className="font-bold text-sm sm:text-base">{entry.sum}</div>
                            <Badge variant="secondary" className="text-xs">
                              {getPUCAICategory(entry.sum).category}
                            </Badge>
                          </>
                        )}

                        {isMood && (
                          <>
                            <div className="font-bold flex items-center gap-1 text-sm sm:text-base">
                              <span>{getMoodEmoji(entry.amount)}</span>
                              <span>{entry.amount}/5</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {getMoodLabel(entry.amount)}
                            </Badge>
                          </>
                        )}

                        {isMeal && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.time}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}

              {pucais.length === 0 && moods.length === 0 && meals.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Noch keine Aktivitäten vorhanden</p>
                  <p className="text-xs sm:text-sm">Beginnen Sie mit der Erfassung Ihrer Daten</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
